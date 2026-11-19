import { NextResponse } from "next/server";
import { requireSession } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { getObject } from "@/lib/server/storage";

export async function GET(
  _request: Request,
  context: { params: Promise<{ key: string[] }> },
) {
  const auth = await requireSession();
  if (auth.error) return auth.error;

  const { key: parts } = await context.params;
  const storageKey = parts.map(decodeURIComponent).join("/");
  const resume = await prisma.resume.findFirst({
    where: { storageKey },
    include: { candidate: true },
  });

  if (!resume) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const allowed =
    auth.session.role === "admin" ||
    auth.session.role === "recruiter" ||
    auth.session.role === "employer" ||
    resume.candidate.userId === auth.session.id;

  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { bytes, contentType } = await getObject(storageKey);
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${resume.fileName}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "File missing" }, { status: 404 });
  }
}
