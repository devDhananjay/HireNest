import { NextResponse } from "next/server";
import { requireSession } from "@/lib/server/auth";
import { enqueueVoiceScreenFollowUps } from "@/lib/server/followups";
import { prisma } from "@/lib/server/prisma";
import { buildVoiceQuestions } from "@/lib/server/voice";
import { sendWhatsAppReminder } from "@/lib/server/notify";
import { BRAND } from "@/lib/constants";

export async function GET() {
  const auth = await requireSession(["recruiter", "admin", "employer", "candidate"]);
  if (auth.error) return auth.error;

  if (auth.session.role === "candidate") {
    const candidate = await prisma.candidateProfile.findUnique({ where: { userId: auth.session.id } });
    if (!candidate) return NextResponse.json({ screens: [] });
    const screens = await prisma.voiceScreen.findMany({
      where: { candidateId: candidate.id },
      include: { job: { include: { company: true } }, answers: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ screens });
  }

  const screens = await prisma.voiceScreen.findMany({
    include: {
      job: { include: { company: true } },
      candidate: { include: { user: true } },
      answers: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ screens });
}

export async function POST(request: Request) {
  const auth = await requireSession(["recruiter", "admin", "employer"]);
  if (auth.error) return auth.error;

  const body = (await request.json()) as { jobId?: string; candidateId?: string; notifyWhatsApp?: boolean };
  if (!body.jobId || !body.candidateId) {
    return NextResponse.json({ error: "jobId and candidateId required" }, { status: 400 });
  }

  const job = await prisma.job.findUnique({ where: { id: body.jobId } });
  const candidate = await prisma.candidateProfile.findUnique({
    where: { id: body.candidateId },
    include: { user: true },
  });
  if (!job || !candidate) {
    return NextResponse.json({ error: "Job or candidate not found" }, { status: 404 });
  }

  const questions = buildVoiceQuestions(job);
  const screen = await prisma.voiceScreen.create({
    data: {
      jobId: job.id,
      candidateId: candidate.id,
      createdById: auth.session.id,
      questions,
      status: "pending",
    },
  });

  const link = `${BRAND.siteUrl}/candidate/voice-screens/${screen.id}`;
  await prisma.notification.create({
    data: {
      userId: candidate.userId,
      title: "Voice screen invited",
      body: `Complete your async voice screen for ${job.title}. ${link}`,
    },
  });

  if (body.notifyWhatsApp !== false && candidate.phone) {
    await sendWhatsAppReminder(
      candidate.phone,
      `HIREORA: Please complete your voice screen for ${job.title}. Open: ${link}`,
      {
        candidateId: candidate.id,
        relatedType: "voice_screen",
        relatedId: screen.id,
        template: process.env.WHATSAPP_VOICE_TEMPLATE,
      },
    );
  }

  await enqueueVoiceScreenFollowUps({
    voiceScreenId: screen.id,
    candidateId: candidate.id,
    jobTitle: job.title,
    link,
    phone: candidate.phone,
    email: candidate.user.email,
  });

  return NextResponse.json({ screen });
}
