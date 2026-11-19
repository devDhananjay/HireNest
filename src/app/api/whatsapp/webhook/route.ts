import { NextResponse } from "next/server";
import { handleInboundWhatsAppText } from "@/lib/server/inbound-whatsapp";
import { prisma } from "@/lib/server/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  const expected = process.env.WHATSAPP_VERIFY_TOKEN || "hireora-whatsapp";

  if (mode === "subscribe" && token === expected && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

type MetaMessage = {
  id?: string;
  from?: string;
  type?: string;
  text?: { body?: string };
};

type MetaStatus = {
  id?: string;
  status?: string;
  errors?: { title?: string }[];
};

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const changes =
    payload?.entry?.flatMap(
      (entry: { changes?: { value?: { statuses?: MetaStatus[]; messages?: MetaMessage[] } }[] }) =>
        entry.changes ?? [],
    ) ?? [];

  for (const change of changes) {
    const statuses = change.value?.statuses ?? [];
    for (const status of statuses) {
      if (!status.id) continue;
      const mapped =
        status.status === "delivered"
          ? "delivered"
          : status.status === "read"
            ? "read"
            : status.status === "failed"
              ? "failed"
              : status.status === "sent"
                ? "sent"
                : null;
      if (!mapped) continue;
      await prisma.whatsAppMessage.updateMany({
        where: { providerId: status.id },
        data: {
          status: mapped,
          error: status.errors?.[0]?.title,
        },
      });
    }

    const messages = change.value?.messages ?? [];
    for (const message of messages) {
      if (!message.from || message.type !== "text" || !message.text?.body) continue;
      try {
        await handleInboundWhatsAppText({
          fromPhone: message.from,
          text: message.text.body,
          providerId: message.id,
        });
      } catch (error) {
        console.error("[hireora:whatsapp:inbound]", error);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
