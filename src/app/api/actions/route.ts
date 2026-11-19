import { runAction } from "@/lib/server/actions";

export async function POST(request: Request) {
  const body = (await request.json()) as { action?: string; payload?: Record<string, unknown> };
  if (!body.action) {
    return Response.json({ error: "action is required" }, { status: 400 });
  }
  return runAction(body.action, body.payload ?? {});
}
