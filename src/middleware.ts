import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "@/lib/auth-constants";
import { ROLE_HOME } from "@/lib/constants";
import type { UserRole } from "@/lib/types";

const guarded: { prefix: string; role: UserRole }[] = [
  { prefix: "/candidate", role: "candidate" },
  { prefix: "/employer", role: "employer" },
  { prefix: "/recruiter", role: "recruiter" },
  { prefix: "/admin", role: "admin" },
];

async function readSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token || !process.env.AUTH_SECRET) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET));
    if (!payload.id || !payload.email || !payload.role) return null;
    return {
      id: String(payload.id),
      role: payload.role as UserRole,
    };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await readSession(request);

  if ((pathname === "/login" || pathname === "/register") && session) {
    return NextResponse.redirect(new URL(ROLE_HOME[session.role], request.url));
  }

  for (const rule of guarded) {
    if (pathname === rule.prefix || pathname.startsWith(`${rule.prefix}/`)) {
      if (!session) {
        const url = new URL("/login", request.url);
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
      }
      if (session.role !== rule.role) {
        return NextResponse.redirect(new URL(ROLE_HOME[session.role], request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/candidate/:path*",
    "/employer/:path*",
    "/recruiter/:path*",
    "/admin/:path*",
  ],
};
