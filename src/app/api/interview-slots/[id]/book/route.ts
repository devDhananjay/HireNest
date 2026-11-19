import { NextResponse } from "next/server";
import { requireSession } from "@/lib/server/auth";
import { enqueueInterviewFollowUps } from "@/lib/server/followups";
import { notifyUser, sendWhatsAppReminder } from "@/lib/server/notify";
import { prisma } from "@/lib/server/prisma";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireSession(["candidate"]);
  if (auth.error) return auth.error;
  const { id } = await context.params;

  const candidate = await prisma.candidateProfile.findUnique({
    where: { userId: auth.session.id },
    include: { user: true },
  });
  if (!candidate) return NextResponse.json({ error: "Candidate profile required" }, { status: 400 });

  const slot = await prisma.interviewSlot.findUnique({ where: { id }, include: { job: true } });
  if (!slot || slot.status !== "open") {
    return NextResponse.json({ error: "Slot unavailable" }, { status: 409 });
  }
  if (slot.candidateId && slot.candidateId !== candidate.id) {
    return NextResponse.json({ error: "This slot is reserved for another candidate" }, { status: 403 });
  }
  if (slot.applicationId) {
    const app = await prisma.application.findUnique({ where: { id: slot.applicationId } });
    if (!app || app.candidateId !== candidate.id) {
      return NextResponse.json({ error: "Slot not offered on your application" }, { status: 403 });
    }
  }

  const interview = await prisma.interview.create({
    data: {
      applicationId: slot.applicationId,
      jobId: slot.jobId,
      candidateId: candidate.id,
      companyId: slot.companyId,
      scheduledAt: slot.startsAt,
      mode: slot.mode,
      location: slot.location,
      interviewer: slot.interviewer || "Hiring team",
      status: "Scheduled",
    },
  });

  await prisma.interviewSlot.update({
    where: { id: slot.id },
    data: { status: "booked", bookedInterviewId: interview.id, candidateId: candidate.id },
  });

  if (slot.applicationId) {
    const app = await prisma.application.findUnique({ where: { id: slot.applicationId } });
    if (app) {
      const timeline = [
        ...((app.timeline as { status: string; at: string; note: string }[]) ?? []),
        {
          status: "Interview Scheduled",
          at: new Date().toISOString(),
          note: "Candidate booked an offered interview slot",
        },
      ];
      await prisma.application.update({
        where: { id: app.id },
        data: { status: "Interview Scheduled", timeline },
      });
    }
  }

  await notifyUser(
    candidate.userId,
    "Interview booked",
    `${slot.mode} interview for ${slot.job.title} is confirmed.`,
  );

  if (candidate.phone) {
    await sendWhatsAppReminder(
      candidate.phone,
      `HIREORA: Interview booked for ${slot.job.title} at ${slot.startsAt.toLocaleString("en-IN")}. Mode: ${slot.mode}.`,
      {
        candidateId: candidate.id,
        relatedType: "interview",
        relatedId: interview.id,
        template: process.env.WHATSAPP_INTERVIEW_TEMPLATE,
      },
    );
  }

  await enqueueInterviewFollowUps({
    interviewId: interview.id,
    candidateId: candidate.id,
    jobTitle: slot.job.title,
    scheduledAt: slot.startsAt,
    mode: slot.mode,
    interviewer: slot.interviewer || "Hiring team",
    phone: candidate.phone,
    email: candidate.user.email,
  });

  return NextResponse.json({ ok: true, interview });
}
