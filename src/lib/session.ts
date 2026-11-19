import { SESSION_COOKIE } from "@/lib/auth-constants";
import type { SessionUser } from "./types";

export { SESSION_COOKIE };

/** @deprecated Prefer /api/auth/me — session cookie is httpOnly. */
export function parseSession(_value?: string | null): SessionUser | null {
  return null;
}

/** @deprecated Prefer /api/auth/me — session cookie is httpOnly. */
export function readClientSession(): SessionUser | null {
  return null;
}
