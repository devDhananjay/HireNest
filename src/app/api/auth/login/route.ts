import { NextResponse } from "next/server";
import { DEMO_PASSWORD } from "@/lib/constants";
import {
  setSessionCookie,
  signSessionToken,
  toSessionUser,
  verifyPassword,
} from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase();
  if (!email || !body.password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { employer: true },
  });
  if (!user || user.disabled) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const ok = await verifyPassword(body.password, user.passwordHash);
  if (!ok) {
    return NextResponse.json(
      { error: `Invalid email or password. Seeded accounts use ${DEMO_PASSWORD}.` },
      { status: 401 },
    );
  }

  const session = await toSessionUser(user.id);
  if (!session) {
    return NextResponse.json({ error: "Unable to create session" }, { status: 500 });
  }
  const token = await signSessionToken(session);
  const response = NextResponse.json({ user: session });
  return setSessionCookie(response, token);
}
