import { NextResponse } from "next/server";
import { requireSession } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireSession(["recruiter", "admin", "employer", "candidate"]);
  if (auth.error) return auth.error;
  const { id } = await context.params;

  const screen = await prisma.voiceScreen.findUnique({
    where: { id },
    include: {
      job: { include: { company: true } },
      candidate: { include: { user: true } },
      answers: { orderBy: { questionIndex: "asc" } },
    },
  });
  if (!screen) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (auth.session.role === "candidate") {
    const me = await prisma.candidateProfile.findUnique({ where: { userId: auth.session.id } });
    if (!me || me.id !== screen.candidateId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.json({ screen });
}
