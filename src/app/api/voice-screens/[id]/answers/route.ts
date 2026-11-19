import { NextResponse } from "next/server";
import { requireSession } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { makeStorageKey, putObject } from "@/lib/server/storage";
import { scoreAnswer, summarizeScreen, transcribeAudio, type VoiceQuestion } from "@/lib/server/voice";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireSession(["candidate", "recruiter", "admin"]);
  if (auth.error) return auth.error;
  const { id } = await context.params;

  const screen = await prisma.voiceScreen.findUnique({
    where: { id },
    include: { job: true, answers: true },
  });
  if (!screen) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (auth.session.role === "candidate") {
    const me = await prisma.candidateProfile.findUnique({ where: { userId: auth.session.id } });
    if (!me || me.id !== screen.candidateId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const form = await request.formData();
  const questionIndex = Number(form.get("questionIndex"));
  const file = form.get("audio");
  if (!Number.isInteger(questionIndex) || questionIndex < 0 || !(file instanceof File)) {
    return NextResponse.json({ error: "audio file and questionIndex required" }, { status: 400 });
  }

  const questions = (screen.questions as VoiceQuestion[]) || [];
  const question = questions[questionIndex];
  if (!question) return NextResponse.json({ error: "Invalid question index" }, { status: 400 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const storageKey = makeStorageKey(file.name || `q${questionIndex}.webm`, "voice");
  await putObject(storageKey, bytes, file.type || "audio/webm");

  const transcribed = await transcribeAudio(bytes, file.type || "audio/webm");
  const scored = await scoreAnswer({
    jobTitle: screen.job.title,
    question: question.prompt,
    focus: question.focus,
    transcript: transcribed.transcript,
  });

  const answer = await prisma.voiceAnswer.upsert({
    where: {
      voiceScreenId_questionIndex: { voiceScreenId: screen.id, questionIndex },
    },
    create: {
      voiceScreenId: screen.id,
      questionIndex,
      question: question.prompt,
      audioKey: storageKey,
      transcript: transcribed.transcript,
      score: scored.score,
      feedback: scored.feedback,
    },
    update: {
      audioKey: storageKey,
      transcript: transcribed.transcript,
      score: scored.score,
      feedback: scored.feedback,
    },
  });

  await prisma.voiceScreen.update({
    where: { id: screen.id },
    data: { status: "in_progress" },
  });

  const refreshed = await prisma.voiceAnswer.findMany({
    where: { voiceScreenId: screen.id },
    orderBy: { questionIndex: "asc" },
  });

  if (refreshed.length >= questions.length) {
    const summary = await summarizeScreen({
      jobTitle: screen.job.title,
      answers: refreshed.map((item) => ({
        question: item.question,
        transcript: item.transcript,
        score: item.score,
      })),
    });
    await prisma.voiceScreen.update({
      where: { id: screen.id },
      data: {
        status: "scored",
        overallScore: summary.overallScore,
        summary: summary.summary,
        completedAt: new Date(),
      },
    });
  }

  return NextResponse.json({ answer, transcribed, scored });
}
