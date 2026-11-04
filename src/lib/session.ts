import type { SessionUser } from "./types";

export const SESSION_COOKIE = "hireora_session";

export function parseSession(value?: string | null): SessionUser | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as SessionUser;
    if (!parsed?.id || !parsed?.role || !parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function readClientSession(): SessionUser | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${SESSION_COOKIE}=`));
  if (!match) return null;
  return parseSession(decodeURIComponent(match.split("=").slice(1).join("=")));
}
