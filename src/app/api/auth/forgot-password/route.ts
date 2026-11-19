import { NextResponse } from "next/server";
import { createOtpChallenge } from "@/lib/server/otp";
import { sendPasswordResetEmail } from "@/lib/server/notify";
import { prisma } from "@/lib/server/prisma";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string };
  const email = body.email?.trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  // Always return ok to avoid account enumeration
  if (!user) {
    return NextResponse.json({
      ok: true,
      message: "If that account exists, a reset code was sent.",
    });
  }

  const { code } = await createOtpChallenge({
    email,
    purpose: "reset",
    userId: user.id,
  });
  await sendPasswordResetEmail(email, code);

  return NextResponse.json({
    ok: true,
    message: process.env.RESEND_API_KEY
      ? "If that account exists, a reset code was sent."
      : `Demo reset OTP is ${process.env.OTP_DEV_CODE || code}`,
  });
}
