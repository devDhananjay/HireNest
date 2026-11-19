import { prisma } from "@/lib/server/prisma";
import { sendResendEmail } from "@/lib/server/notify-email";
import { sendWhatsAppMessage } from "@/lib/server/whatsapp";

async function settings() {
  return (
    (await prisma.platformSettings.findUnique({ where: { id: "default" } })) ?? {
      emailUpdates: true,
      whatsappReminders: false,
      autoFollowUps: true,
      dailyDigest: true,
    }
  );
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

export async function sendWhatsAppReminder(
  to: string,
  body: string,
  meta?: { candidateId?: string; relatedType?: string; relatedId?: string; template?: string },
) {
  return sendWhatsAppMessage({
    toPhone: to,
    body,
    template: meta?.template || process.env.WHATSAPP_DEFAULT_TEMPLATE || undefined,
    candidateId: meta?.candidateId,
    relatedType: meta?.relatedType,
    relatedId: meta?.relatedId,
  });
}
