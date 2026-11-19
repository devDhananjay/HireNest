import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/server/auth";
import { consumeOtp } from "@/lib/server/otp";
import { prisma } from "@/lib/server/prisma";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; otp?: string; password?: string };
  const email = body.email?.trim().toLowerCase();
  if (!email || !body.otp || !body.password || body.password.length < 6) {
    return NextResponse.json({ error: "Email, OTP and a new password are required" }, { status: 400 });
  }

  const challenge = await consumeOtp(email, "reset", body.otp);
  if (!challenge) {
    return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
  }

  await prisma.user.update({
    where: { email },
    data: { passwordHash: await hashPassword(body.password) },
  });

  return NextResponse.json({ ok: true });
}
