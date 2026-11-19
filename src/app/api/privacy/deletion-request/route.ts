import { NextResponse } from "next/server";
import { getSession, requireSession } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { deleteObject } from "@/lib/server/storage";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; reason?: string };
  const session = await getSession();
  const email = (body.email || session?.email || "").trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const deletion = await prisma.deletionRequest.create({
    data: {
      email,
      reason: body.reason,
      userId: user?.id,
      status: "pending",
    },
  });

  return NextResponse.json({
    ok: true,
    id: deletion.id,
    message: "Deletion request recorded. Admin will fulfil under DPDP timelines.",
  });
}

export async function PATCH(request: Request) {
  const auth = await requireSession(["admin"]);
  if (auth.error) return auth.error;

  const body = (await request.json()) as { id?: string; fulfil?: boolean };
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const deletion = await prisma.deletionRequest.findUnique({ where: { id: body.id } });
  if (!deletion) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (!body.fulfil) {
    const updated = await prisma.deletionRequest.update({
      where: { id: body.id },
      data: { status: "rejected" },
    });
    return NextResponse.json({ ok: true, deletion: updated });
  }

  await prisma.deletionRequest.update({
    where: { id: body.id },
    data: { status: "processing" },
  });

  const user = deletion.userId
    ? await prisma.user.findUnique({
        where: { id: deletion.userId },
        include: { candidate: { include: { resumes: true } } },
      })
    : await prisma.user.findUnique({
        where: { email: deletion.email },
        include: { candidate: { include: { resumes: true } } },
      });

  if (user?.candidate) {
    for (const resume of user.candidate.resumes) {
      await deleteObject(resume.storageKey);
    }
    await prisma.resume.deleteMany({ where: { candidateId: user.candidate.id } });
    await prisma.candidateProfile.update({
      where: { id: user.candidate.id },
      data: {
        phone: "",
        location: "",
        linkedin: "",
        resumeName: "",
        resumeUrl: null,
        education: [],
        experience: [],
        skills: [],
        preferredLocations: [],
      },
    });
  }

  if (user) {
    await prisma.notification.deleteMany({ where: { userId: user.id } });
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: "Deleted User",
        email: `deleted-${user.id}@hireora.invalid`,
        phone: null,
        passwordHash: null,
        disabled: true,
      },
    });
  }

  const completed = await prisma.deletionRequest.update({
    where: { id: body.id },
    data: { status: "completed", completedAt: new Date() },
  });

  await prisma.auditLog.create({
    data: {
      actorId: auth.session.id,
      action: "dpdp.deletion.fulfilled",
      entity: completed.id,
    },
  });

  return NextResponse.json({ ok: true, deletion: completed });
}

export async function GET() {
  const auth = await requireSession(["admin"]);
  if (auth.error) return auth.error;
  const items = await prisma.deletionRequest.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ items });
}
