import { NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { loadBootstrap } from "@/lib/server/bootstrap";

export async function GET() {
  const session = await getSession();
  const data = await loadBootstrap(session);
  return NextResponse.json(data);
}
