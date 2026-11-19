import { NextResponse } from "next/server";
import { requireSession } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";

export async function GET(request: Request) {
  const auth = await requireSession(["candidate", "employer", "recruiter", "admin"]);
  if (auth.error) return auth.error;

  const url = new URL(request.url);
  const applicationId = url.searchParams.get("applicationId") || undefined;
  const candidateId = url.searchParams.get("candidateId") || undefined;
  const jobId = url.searchParams.get("jobId") || undefined;
  const mine = url.searchParams.get("mine") === "1";

  let forCandidateId = candidateId;
  if (mine && auth.session.role === "candidate") {
    const profile = await prisma.candidateProfile.findUnique({ where: { userId: auth.session.id } });
    forCandidateId = profile?.id;
  }

  const slots = await prisma.interviewSlot.findMany({
    where: {
      status: "open",
      ...(applicationId ? { applicationId } : {}),
      ...(forCandidateId ? { OR: [{ candidateId: forCandidateId }, { candidateId: null }] } : {}),
      ...(jobId ? { jobId } : {}),
      startsAt: { gte: new Date() },
    },
    orderBy: { startsAt: "asc" },
    take: 40,
    include: { job: { select: { title: true, slug: true } } },
  });

  return NextResponse.json({ slots });
}

export async function POST(request: Request) {
  const auth = await requireSession(["employer", "recruiter", "admin"]);
  if (auth.error) return auth.error;

  const body = await request.json().catch(() => ({}));
  const jobId = String(body.jobId || "");
  const startsAt = new Date(String(body.startsAt || ""));
  if (!jobId || Number.isNaN(startsAt.getTime())) {
    return NextResponse.json({ error: "jobId and startsAt required" }, { status: 400 });
  }

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  const endsAt = body.endsAt
    ? new Date(String(body.endsAt))
    : new Date(startsAt.getTime() + 45 * 60 * 1000);

  const slot = await prisma.interviewSlot.create({
    data: {
      jobId,
      companyId: job.companyId,
      applicationId: body.applicationId ? String(body.applicationId) : null,
      candidateId: body.candidateId ? String(body.candidateId) : null,
      startsAt,
      endsAt,
      mode: String(body.mode || "Video"),
      location: String(body.location || "Google Meet"),
      interviewer: String(body.interviewer || auth.session.name),
      status: "open",
    },
  });

  return NextResponse.json({ ok: true, slot });
}
