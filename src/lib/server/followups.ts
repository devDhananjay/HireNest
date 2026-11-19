import { prisma } from "@/lib/server/prisma";
import { sendResendEmail } from "@/lib/server/notify-email";
import { sendWhatsAppMessage } from "@/lib/server/whatsapp";

function hoursFromNow(hours: number) {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

async function autoFollowUpsEnabled() {
  const flags = await prisma.platformSettings.findUnique({ where: { id: "default" } });
  return flags?.autoFollowUps !== false;
}

export async function enqueueApplicationFollowUps(input: {
  applicationId: string;
  candidateId: string;
  jobTitle: string;
  phone?: string | null;
  email?: string | null;
}) {
  if (!(await autoFollowUpsEnabled())) return;
  const bodyAck = `HIREORA: We received your application for ${input.jobTitle}. A recruiter will review your profile shortly.`;
  const bodyNudge = `HIREORA: Quick nudge — your application for ${input.jobTitle} is under review. Keep your phone reachable for a short screen.`;

  await prisma.followUpTask.createMany({
    data: [
      {
        kind: "apply_ack",
        channel: "both",
        dueAt: new Date(),
        toPhone: input.phone || null,
        toEmail: input.email || null,
        subject: `Application received · ${input.jobTitle}`,
        body: bodyAck,
        relatedType: "application",
        relatedId: input.applicationId,
        candidateId: input.candidateId,
      },
      {
        kind: "screen_nudge",
        channel: "whatsapp",
        dueAt: hoursFromNow(24),
        toPhone: input.phone || null,
        toEmail: input.email || null,
        subject: `Profile review · ${input.jobTitle}`,
        body: bodyNudge,
        relatedType: "application",
        relatedId: input.applicationId,
        candidateId: input.candidateId,
      },
    ],
  });
}

export async function enqueueVoiceScreenFollowUps(input: {
  voiceScreenId: string;
  candidateId: string;
  jobTitle: string;
  link: string;
  phone?: string | null;
  email?: string | null;
}) {
  if (!(await autoFollowUpsEnabled())) return;
  await prisma.followUpTask.createMany({
    data: [
      {
        kind: "voice_invite_ack",
        channel: "both",
        dueAt: new Date(),
        toPhone: input.phone || null,
        toEmail: input.email || null,
        subject: `Voice screen · ${input.jobTitle}`,
        body: `HIREORA: Please complete your voice screen for ${input.jobTitle}. Open: ${input.link}`,
        relatedType: "voice_screen",
        relatedId: input.voiceScreenId,
        candidateId: input.candidateId,
      },
      {
        kind: "voice_nudge",
        channel: "whatsapp",
        dueAt: hoursFromNow(24),
        toPhone: input.phone || null,
        toEmail: input.email || null,
        subject: `Reminder · voice screen · ${input.jobTitle}`,
        body: `HIREORA reminder: your voice screen for ${input.jobTitle} is still pending. ${input.link}`,
        relatedType: "voice_screen",
        relatedId: input.voiceScreenId,
        candidateId: input.candidateId,
      },
    ],
  });
}

export async function enqueueInterviewFollowUps(input: {
  interviewId: string;
  candidateId: string;
  jobTitle: string;
  scheduledAt: Date;
  mode: string;
  interviewer: string;
  phone?: string | null;
  email?: string | null;
}) {
  if (!(await autoFollowUpsEnabled())) return;
  const when = input.scheduledAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const reminderAt = new Date(input.scheduledAt.getTime() - 2 * 60 * 60 * 1000);
  const noshowAt = new Date(input.scheduledAt.getTime() + 30 * 60 * 1000);

  await prisma.followUpTask.createMany({
    data: [
      {
        kind: "interview_reminder",
        channel: "both",
        dueAt: reminderAt > new Date() ? reminderAt : hoursFromNow(0.1),
        toPhone: input.phone || null,
        toEmail: input.email || null,
        subject: `Interview reminder · ${input.jobTitle}`,
        body: `HIREORA reminder: ${input.mode} interview for ${input.jobTitle} with ${input.interviewer} at ${when}.`,
        relatedType: "interview",
        relatedId: input.interviewId,
        candidateId: input.candidateId,
      },
      {
        kind: "interview_noshow",
        channel: "whatsapp",
        dueAt: noshowAt,
        toPhone: input.phone || null,
        toEmail: input.email || null,
        subject: `Missed interview? · ${input.jobTitle}`,
        body: `HIREORA: If you missed the ${input.jobTitle} interview, reply here and we will help reschedule.`,
        relatedType: "interview",
        relatedId: input.interviewId,
        candidateId: input.candidateId,
      },
    ],
  });
}

export async function enqueueStatusFollowUp(input: {
  applicationId: string;
  candidateId: string;
  status: string;
  jobTitle: string;
  phone?: string | null;
  email?: string | null;
}) {
  if (!(await autoFollowUpsEnabled())) return;
  if (!["Shortlisted", "Selected", "Interview Scheduled"].includes(input.status)) return;

  const kind = input.status === "Selected" ? "offer_followup" : "status_nudge";
  const body =
    input.status === "Selected"
      ? `HIREORA: Congrats — you are selected for ${input.jobTitle}. Reply to confirm interest and next steps.`
      : `HIREORA update: Your application for ${input.jobTitle} is now ${input.status}.`;

  await prisma.followUpTask.create({
    data: {
      kind,
      channel: "both",
      dueAt: hoursFromNow(input.status === "Selected" ? 4 : 0),
      toPhone: input.phone || null,
      toEmail: input.email || null,
      subject: `${input.status} · ${input.jobTitle}`,
      body,
      relatedType: "application",
      relatedId: input.applicationId,
      candidateId: input.candidateId,
    },
  });
}

export async function processDueFollowUps(limit = 40) {
  if (!(await autoFollowUpsEnabled())) {
    return { processed: 0, skipped: true as const };
  }

  const due = await prisma.followUpTask.findMany({
    where: { status: "pending", dueAt: { lte: new Date() } },
    orderBy: { dueAt: "asc" },
    take: limit,
  });

  let sent = 0;
  let failed = 0;
  for (const task of due) {
    let delivered = false;
    let attempted = false;
    const channel = task.channel || "whatsapp";

    if (!task.toPhone && !task.toEmail) {
      await prisma.followUpTask.update({
        where: { id: task.id },
        data: { status: "skipped", sentAt: new Date() },
      });
      continue;
    }

    if ((channel === "whatsapp" || channel === "both") && task.toPhone) {
      attempted = true;
      const wa = await sendWhatsAppMessage({
        toPhone: task.toPhone,
        body: task.body,
        candidateId: task.candidateId || undefined,
        relatedType: task.relatedType || undefined,
        relatedId: task.relatedId || undefined,
        template: process.env.WHATSAPP_DEFAULT_TEMPLATE || undefined,
        // Auto sequences have their own gate (autoFollowUps); don't double-block on whatsappReminders.
        force: true,
      });
      delivered = delivered || Boolean(wa.ok && !wa.skipped);
    }

    if ((channel === "email" || channel === "both") && task.toEmail) {
      attempted = true;
      const mail = await sendResendEmail(
        task.toEmail,
        task.subject || "HIREORA update",
        task.body,
      );
      delivered = delivered || mail.ok;
    }

    await prisma.followUpTask.update({
      where: { id: task.id },
      data: { status: delivered ? "sent" : attempted ? "failed" : "skipped", sentAt: new Date() },
    });
    if (delivered) sent += 1;
    else failed += 1;
  }

  return { processed: due.length, sent, failed, skipped: false as const };
}
