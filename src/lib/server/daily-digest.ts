import { prisma } from "@/lib/server/prisma";
import { sendResendEmail } from "@/lib/server/notify-email";
import { sendWhatsAppMessage } from "@/lib/server/whatsapp";

function startOfTodayIst() {
  const now = new Date();
  const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  ist.setHours(0, 0, 0, 0);
  // Convert IST midnight back to UTC approx via offset from local parse
  const offset = now.getTime() - new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })).getTime();
  return new Date(ist.getTime() + offset);
}

export async function buildHiringDigest() {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [newApps, interviewsToday, openLeads, hotLeads, voicePending, activeJobs] = await Promise.all([
    prisma.application.count({ where: { appliedAt: { gte: since } } }),
    prisma.interview.count({
      where: {
        status: "Scheduled",
        scheduledAt: { gte: startOfTodayIst(), lt: new Date(startOfTodayIst().getTime() + 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.lead.count({ where: { status: { not: "Closed" } } }),
    prisma.lead.count({ where: { qualifyLabel: "Hot", status: { not: "Closed" } } }),
    prisma.voiceScreen.count({ where: { status: { in: ["pending", "in_progress"] } } }),
    prisma.job.count({ where: { status: "active" } }),
  ]);

  const lines = [
    "HIREORA daily hiring digest",
    "",
    `• New applications (24h): ${newApps}`,
    `• Interviews today: ${interviewsToday}`,
    `• Open employer leads: ${openLeads} (${hotLeads} Hot)`,
    `• Pending voice screens: ${voicePending}`,
    `• Active jobs: ${activeJobs}`,
    "",
    "Open the recruiter dashboard for pipeline detail.",
  ];

  return {
    subject: `HIREORA digest · ${newApps} apps · ${interviewsToday} interviews today`,
    text: lines.join("\n"),
    stats: { newApps, interviewsToday, openLeads, hotLeads, voicePending, activeJobs },
  };
}

export async function sendDailyHiringDigest() {
  const flags = await prisma.platformSettings.findUnique({ where: { id: "default" } });
  if (flags && flags.dailyDigest === false) {
    return { ok: false, skipped: true as const, reason: "dailyDigest off" };
  }

  const digest = await buildHiringDigest();
  const recipients = await prisma.user.findMany({
    where: { role: { in: ["recruiter", "admin", "employer"] }, disabled: false },
  });

  let emailed = 0;
  let whatsapped = 0;

  for (const user of recipients) {
    if (flags?.emailUpdates !== false && user.email) {
      const mail = await sendResendEmail(user.email, digest.subject, digest.text);
      if (mail.ok) emailed += 1;
    }

    if (flags?.whatsappReminders && user.phone) {
      const wa = await sendWhatsAppMessage({
        toPhone: user.phone,
        body: digest.text,
        relatedType: "digest",
        relatedId: new Date().toISOString().slice(0, 10),
        force: true,
      });
      if (wa.ok) whatsapped += 1;
    }
  }

  // Also ping Hot lead contacts? Skip — digest is internal.

  return { ok: true, skipped: false as const, emailed, whatsapped, stats: digest.stats };
}
