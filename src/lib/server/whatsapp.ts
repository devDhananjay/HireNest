import { prisma } from "@/lib/server/prisma";

export type WhatsAppSendInput = {
  toPhone: string;
  body: string;
  template?: string;
  candidateId?: string;
  relatedType?: string;
  relatedId?: string;
  /** Skip platformSettings.whatsappReminders gate (manual admin/recruiter sends). */
  force?: boolean;
};

function normalizePhone(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("91") && digits.length >= 12) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  return digits.startsWith("+") ? digits : `+${digits}`;
}

function metaConfigured() {
  return Boolean(
    process.env.WHATSAPP_TOKEN &&
      process.env.WHATSAPP_PHONE_NUMBER_ID &&
      process.env.WHATSAPP_TOKEN.trim() &&
      process.env.WHATSAPP_PHONE_NUMBER_ID.trim(),
  );
}

function twilioConfigured() {
  return Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM);
}

async function sendMetaText(to: string, body: string) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID!;
  const token = process.env.WHATSAPP_TOKEN!;
  const res = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: to.replace(/^\+/, ""),
      type: "text",
      text: { preview_url: false, body },
    }),
  });
  const data = (await res.json()) as {
    messages?: { id: string }[];
    error?: { message?: string };
  };
  if (!res.ok) {
    return { ok: false as const, provider: "meta" as const, error: data.error?.message || "Meta send failed", providerId: undefined };
  }
  return {
    ok: true as const,
    provider: "meta" as const,
    providerId: data.messages?.[0]?.id,
    error: undefined,
  };
}

async function sendMetaTemplate(to: string, template: string, body: string) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID!;
  const token = process.env.WHATSAPP_TOKEN!;
  const language = process.env.WHATSAPP_TEMPLATE_LANG || "en";
  const res = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: to.replace(/^\+/, ""),
      type: "template",
      template: {
        name: template,
        language: { code: language },
        components: [
          {
            type: "body",
            parameters: [{ type: "text", text: body.slice(0, 1024) }],
          },
        ],
      },
    }),
  });
  const data = (await res.json()) as {
    messages?: { id: string }[];
    error?: { message?: string };
  };
  if (!res.ok) {
    // Fall back to session text if template not approved / wrong params
    console.warn("[hireora:whatsapp:template-fallback]", data.error?.message);
    return sendMetaText(to, body);
  }
  return {
    ok: true as const,
    provider: "meta" as const,
    providerId: data.messages?.[0]?.id,
    error: undefined,
  };
}

async function sendTwilio(to: string, body: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID!;
  const token = process.env.TWILIO_AUTH_TOKEN!;
  const from = process.env.TWILIO_WHATSAPP_FROM!;
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
    return { ok: false as const, provider: "twilio" as const, error: await res.text(), providerId: undefined };
  }
  const data = (await res.json()) as { sid?: string };
  return { ok: true as const, provider: "twilio" as const, providerId: data.sid, error: undefined };
}

export async function sendWhatsAppMessage(input: WhatsAppSendInput) {
  const flags = await prisma.platformSettings.findUnique({ where: { id: "default" } });
  const toPhone = normalizePhone(input.toPhone);

  const row = await prisma.whatsAppMessage.create({
    data: {
      toPhone,
      body: input.body,
      template: input.template,
      candidateId: input.candidateId,
      relatedType: input.relatedType,
      relatedId: input.relatedId,
      status: "queued",
      provider: "pending",
    },
  });

  if (!input.force && flags && flags.whatsappReminders === false) {
    await prisma.whatsAppMessage.update({
      where: { id: row.id },
      data: { status: "skipped", provider: "disabled", error: "whatsappReminders off in settings" },
    });
    return { ok: false, skipped: true as const, id: row.id };
  }

  let result: { ok: boolean; provider: string; providerId?: string; error?: string };

  if (metaConfigured()) {
    result = input.template
      ? await sendMetaTemplate(toPhone, input.template, input.body)
      : await sendMetaText(toPhone, input.body);
  } else if (twilioConfigured()) {
    result = await sendTwilio(toPhone, input.body);
  } else {
    console.info("[hireora:whatsapp:dev]", { to: toPhone, body: input.body, template: input.template });
    result = { ok: true, provider: "console", providerId: `dev-${row.id}` };
  }

  await prisma.whatsAppMessage.update({
    where: { id: row.id },
    data: {
      status: result.ok ? "sent" : "failed",
      provider: result.provider,
      providerId: result.providerId,
      error: result.error,
    },
  });

  return { ...result, id: row.id, skipped: false as const };
}

export function whatsappProviderStatus() {
  if (metaConfigured()) return { provider: "meta" as const, ready: true };
  if (twilioConfigured()) return { provider: "twilio" as const, ready: true };
  return { provider: "console" as const, ready: false };
}
