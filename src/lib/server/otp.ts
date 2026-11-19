import { createHash, randomInt } from "crypto";
import { prisma } from "@/lib/server/prisma";

export function hashOtp(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

export function generateOtpCode() {
  if (process.env.OTP_DEV_CODE) return process.env.OTP_DEV_CODE;
  return String(randomInt(100000, 999999));
}

export async function createOtpChallenge(input: {
  email: string;
  phone?: string;
  purpose: string;
  payload?: unknown;
  userId?: string;
}) {
  const code = generateOtpCode();
  const challenge = await prisma.otpChallenge.create({
    data: {
      email: input.email.toLowerCase(),
      phone: input.phone,
      purpose: input.purpose,
      codeHash: hashOtp(code),
      payload: input.payload as object | undefined,
      userId: input.userId,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });
  return { challenge, code };
}

export async function consumeOtp(email: string, purpose: string, code: string) {
  const challenge = await prisma.otpChallenge.findFirst({
    where: {
      email: email.toLowerCase(),
      purpose,
      consumed: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });
  if (!challenge || challenge.codeHash !== hashOtp(code)) {
    return null;
  }
  await prisma.otpChallenge.update({
    where: { id: challenge.id },
    data: { consumed: true },
  });
  return challenge;
}
