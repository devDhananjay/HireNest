import { NextResponse } from "next/server";
import { createOtpChallenge } from "@/lib/server/otp";
import { sendOtpEmail } from "@/lib/server/notify";
import { prisma } from "@/lib/server/prisma";
import type { UserRole } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    role?: UserRole;
    companyName?: string;
  };

  const email = body.email?.trim().toLowerCase();
  if (!body.name || !email || !body.password || body.password.length < 6) {
    return NextResponse.json({ error: "Name, email and a 6+ character password are required" }, { status: 400 });
  }
  const role = body.role === "employer" ? "employer" : "candidate";
  if (role === "employer" && !body.companyName?.trim()) {
    return NextResponse.json({ error: "Company name is required for employers" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists" }, { status: 409 });
  }

  const { code } = await createOtpChallenge({
    email,
    phone: body.phone,
    purpose: "register",
    payload: {
      name: body.name,
      phone: body.phone ?? "",
      password: body.password,
      role,
      companyName: body.companyName ?? "",
    },
  });

  await sendOtpEmail(email, code, "registration");
  return NextResponse.json({
    ok: true,
    email,
    message: process.env.RESEND_API_KEY
      ? "OTP sent to your email"
      : `Demo OTP is ${process.env.OTP_DEV_CODE || code}`,
  });
}
