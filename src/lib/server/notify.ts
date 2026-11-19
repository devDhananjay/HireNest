import { prisma } from "@/lib/server/prisma";

async function settings() {
  return (
    (await prisma.platformSettings.findUnique({ where: { id: "default" } })) ?? {
      emailUpdates: true,
      whatsappReminders: false,
    }
  );
}

async function sendResendEmail(to: string, subject: string, text: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "HIREORA <noreply@hireora.in>";
  if (!key) {
    console.info("[hireora:email:dev]", { to, subject, text });
    return { ok: true, provider: "console" as const };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, text }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error("[hireora:email:error]", body);
    return { ok: false, provider: "resend" as const };
  }
  return { ok: true, provider: "resend" as const };
}

async function sendTwilioWhatsApp(to: string, body: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  if (!sid || !token || !from) {
    console.info("[hireora:whatsapp:dev]", { to, body });
    return { ok: true, provider: "console" as const };
  }
  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
  const params = new URLSearchParams({
    From: from,
    To: to.startsWith("whatsapp:") ? to : `whatsapp:${to}`,
    Body: body,
  });
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });
  if (!res.ok) {
    console.error("[hireora:whatsapp:error]", await res.text());
    return { ok: false, provider: "twilio" as const };
  }
  return { ok: true, provider: "twilio" as const };
}

export async function notifyUser(userId: string, title: string, body: string) {
  const notification = await prisma.notification.create({
    data: { userId, title, body },
  });
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const flags = await settings();
  if (flags.emailUpdates && user?.email) {
    await sendResendEmail(user.email, title, body);
  }
  return notification;
}

export async function sendOtpEmail(email: string, code: string, purpose: string) {
  return sendResendEmail(
    email,
    `HIREORA ${purpose} code`,
    `Your HIREORA verification code is ${code}. It expires in 10 minutes.`,
  );
}

export async function sendPasswordResetEmail(email: string, code: string) {
  return sendResendEmail(
    email,
    "HIREORA password reset",
    `Use code ${code} to reset your HIREORA password. It expires in 10 minutes.`,
  );
}

export async function sendWhatsAppReminder(to: string, body: string) {
  const flags = await settings();
  if (!flags.whatsappReminders) {
    return { ok: false, skipped: true as const };
  }
  return sendTwilioWhatsApp(to, body);
}
