import { qualifyLead } from "@/lib/server/lead-qualify";
import { prisma } from "@/lib/server/prisma";
import { sendWhatsAppMessage } from "@/lib/server/whatsapp";

function normalizePhone(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("91") && digits.length >= 12) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  return digits.startsWith("+") ? digits : `+${digits}`;
}

function looksLikeHiring(text: string) {
  return /\b(hir(e|ing)|recruit|role|jd|job|opening|candidate|staffing|mandate|headcount)\b/i.test(text);
}

async function draftFirstReply(text: string, isHiring: boolean) {
  const key = process.env.OPENAI_API_KEY?.trim();
  const fallback = isHiring
    ? "Thanks for reaching HIREORA. Share company name, roles, location and urgency — a consultant will follow up within one business day. Or submit a brief at hireora.in/contact"
    : "Thanks for messaging HIREORA. Tell us if you are hiring or looking for a role, and we will route you to the right desk. hireora.in";

  if (!key) return fallback;

  try {
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content:
              "You are HIREORA's WhatsApp desk for Indian recruitment. Reply in 1-3 short sentences. Ask for missing hiring details if needed. No fluff.",
          },
          { role: "user", content: text },
        ],
      }),
    });
    if (!res.ok) return fallback;
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return (data.choices?.[0]?.message?.content || fallback).slice(0, 700);
  } catch {
    return fallback;
  }
}

export async function handleInboundWhatsAppText(input: {
  fromPhone: string;
  text: string;
  providerId?: string;
}) {
  const fromPhone = normalizePhone(input.fromPhone);
  const text = input.text.trim().slice(0, 4000);
  if (!text) return { ok: false, reason: "empty" as const };

  // Log inbound as a message row (toPhone = our desk number placeholder / peer)
  await prisma.whatsAppMessage.create({
    data: {
      toPhone: fromPhone,
      body: `[inbound] ${text}`,
      status: "delivered",
      provider: "meta-inbound",
      providerId: input.providerId,
      relatedType: "inbound",
    },
  });

  const isHiring = looksLikeHiring(text);
  let leadId: string | undefined;
  let inquiryId: string | undefined;

  if (isHiring) {
    const qualify = await qualifyLead({
      companyName: "WhatsApp lead",
      contactName: fromPhone,
      email: "",
      phone: fromPhone,
      hiringNeed: text,
      roles: "",
      location: "",
    });
    const lead = await prisma.lead.create({
      data: {
        companyName: "WhatsApp inbound",
        contactName: fromPhone,
        email: `${fromPhone.replace(/\D/g, "")}@whatsapp.hireora.local`,
        phone: fromPhone,
        hiringNeed: text,
        roles: "",
        location: "",
        source: "whatsapp",
        qualifyScore: qualify.score,
        qualifyLabel: qualify.label,
        qualifyNotes: qualify.notes,
        status: "New",
      },
    });
    leadId = lead.id;
  } else {
    const inquiry = await prisma.inquiry.create({
      data: {
        name: fromPhone,
        email: `${fromPhone.replace(/\D/g, "")}@whatsapp.hireora.local`,
        phone: fromPhone,
        topic: "WhatsApp",
        message: text,
        source: "whatsapp",
      },
    });
    inquiryId = inquiry.id;
  }

  const reply = await draftFirstReply(text, isHiring);
  await sendWhatsAppMessage({
    toPhone: fromPhone,
    body: reply,
    relatedType: leadId ? "lead" : "inquiry",
    relatedId: leadId || inquiryId,
    force: true,
  });

  // Notify recruiters in-app
  const recruiters = await prisma.user.findMany({
    where: { role: { in: ["recruiter", "admin"] }, disabled: false },
    select: { id: true },
  });
  if (recruiters.length) {
    await prisma.notification.createMany({
      data: recruiters.map((user) => ({
        userId: user.id,
        title: isHiring ? "WhatsApp hiring lead" : "WhatsApp enquiry",
        body: text.slice(0, 180),
      })),
    });
  }

  return { ok: true as const, leadId, inquiryId, reply };
}
