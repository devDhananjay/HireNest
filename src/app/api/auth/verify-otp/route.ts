import { NextResponse } from "next/server";
import {
  hashPassword,
  setSessionCookie,
  signSessionToken,
  toSessionUser,
} from "@/lib/server/auth";
import { consumeOtp } from "@/lib/server/otp";
import { prisma } from "@/lib/server/prisma";
import { slugify } from "@/lib/server/slug";
import type { UserRole } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; otp?: string };
  const email = body.email?.trim().toLowerCase();
  if (!email || !body.otp) {
    return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
  }

  const challenge = await consumeOtp(email, "register", body.otp);
  if (!challenge) {
    return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
  }

  const payload = challenge.payload as {
    name: string;
    phone?: string;
    password: string;
    role: UserRole;
    companyName?: string;
  };

  const userId = `u-${crypto.randomUUID().slice(0, 8)}`;
  const passwordHash = await hashPassword(payload.password);

  let companyId: string | undefined;
  if (payload.role === "employer" && payload.companyName) {
    companyId = `co-${crypto.randomUUID().slice(0, 8)}`;
    await prisma.company.create({
      data: {
        id: companyId,
        slug: slugify(`${payload.companyName}-${Date.now()}`),
        name: payload.companyName,
        industry: "General",
        location: "India",
        about: "New employer on HIREORA.",
        employees: "1-50",
        founded: String(new Date().getFullYear()),
        logoColor: "#111111",
        verified: false,
        hiring: true,
      },
    });
  }

  await prisma.user.create({
    data: {
      id: userId,
      email,
      name: payload.name,
      phone: payload.phone,
      role: payload.role,
      passwordHash,
      ...(payload.role === "employer" && companyId
        ? { employer: { create: { companyId } } }
        : {}),
      ...(payload.role === "candidate"
        ? {
            candidate: {
              create: {
                id: `cand-${crypto.randomUUID().slice(0, 8)}`,
                phone: payload.phone ?? "",
                photoInitials: payload.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase(),
                completeness: 20,
                tags: ["New"],
              },
            },
          }
        : {}),
    },
  });

  const session = await toSessionUser(userId);
  if (!session) {
    return NextResponse.json({ error: "Account created but session failed" }, { status: 500 });
  }
  const token = await signSessionToken(session);
  const response = NextResponse.json({ user: session });
  return setSessionCookie(response, token);
}
