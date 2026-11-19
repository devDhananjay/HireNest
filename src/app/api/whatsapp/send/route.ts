import { NextResponse } from "next/server";
import { requireSession } from "@/lib/server/auth";
import { sendWhatsAppMessage, whatsappProviderStatus } from "@/lib/server/whatsapp";
import { prisma } from "@/lib/server/prisma";

export async function GET() {
  const auth = await requireSession(["recruiter", "admin", "employer"]);
  if (auth.error) return auth.error;
  return NextResponse.json({
    ...whatsappProviderStatus(),
    recent: await prisma.whatsAppMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  });
}

export async function POST(request: Request) {
  const auth = await requireSession(["recruiter", "admin", "employer"]);
  if (auth.error) return auth.error;

  const body = (await request.json()) as {
    candidateId?: string;
    phone?: string;
    message?: string;
    template?: string;
    relatedType?: string;
    relatedId?: string;
  };

  let phone = body.phone?.trim();
  let candidateId = body.candidateId;

  if (candidateId && !phone) {
    const candidate = await prisma.candidateProfile.findUnique({ where: { id: candidateId } });
    phone = candidate?.phone || undefined;
  }

  if (!phone || !body.message?.trim()) {
    return NextResponse.json({ error: "phone and message required" }, { status: 400 });
  }

  const result = await sendWhatsAppMessage({
    toPhone: phone,
    body: body.message.trim(),
    template: body.template,
    candidateId,
    relatedType: body.relatedType,
    relatedId: body.relatedId,
    force: true,
  });

  return NextResponse.json(result, { status: result.ok || result.skipped ? 200 : 502 });
}
