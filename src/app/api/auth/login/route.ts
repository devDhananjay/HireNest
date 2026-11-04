import { NextResponse } from "next/server";
import { users } from "@/lib/demo/seed";
import { SESSION_COOKIE } from "@/lib/session";
import type { SessionUser, UserRole } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<SessionUser> & { password?: string };
  const existing = users.find(
    (user) => user.email.toLowerCase() === body.email?.toLowerCase(),
  );

  const user: SessionUser = existing ?? {
    id: body.id ?? `u-${crypto.randomUUID().slice(0, 8)}`,
    name: body.name ?? "HIREORA User",
    email: body.email ?? "",
    role: (body.role as UserRole) ?? "candidate",
    companyId: body.companyId,
  };

  if (!user.email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const response = NextResponse.json({ user });
  response.cookies.set(SESSION_COOKIE, JSON.stringify(user), {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
