import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROLE_HOME } from "@/lib/constants";
import { parseSession, SESSION_COOKIE } from "@/lib/session";
import type { UserRole } from "@/lib/types";

const guarded: { prefix: string; role: UserRole }[] = [
  { prefix: "/candidate", role: "candidate" },
  { prefix: "/employer", role: "employer" },
  { prefix: "/recruiter", role: "recruiter" },
  { prefix: "/admin", role: "admin" },
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = parseSession(request.cookies.get(SESSION_COOKIE)?.value);

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
