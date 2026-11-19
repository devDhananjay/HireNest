import { NextResponse } from "next/server";
import { profileCompleteness } from "@/lib/matching";
import { requireSession } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { parseResumeFile } from "@/lib/server/resume-parse";
import { makeStorageKey, publicOrProxyUrl, putObject } from "@/lib/server/storage";
import type { Education, Experience } from "@/lib/types";

export async function POST(request: Request) {
  const auth = await requireSession(["candidate"]);
  if (auth.error) return auth.error;

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  const candidate = await prisma.candidateProfile.findUnique({
    where: { userId: auth.session.id },
    include: { user: true },
  });
  if (!candidate) {
    return NextResponse.json({ error: "Candidate profile not found" }, { status: 404 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const storageKey = makeStorageKey(file.name);
  await putObject(storageKey, bytes, file.type || "application/octet-stream");
  const resumeUrl = publicOrProxyUrl(storageKey);
  const parsed = await parseResumeFile(bytes, file.name, file.type);

  await prisma.resume.create({
    data: {
      candidateId: candidate.id,
      fileName: file.name,
      storageKey,
      mimeType: file.type || null,
    },
  });

  if (!parsed.rawTextLength && !parsed.skills.length) {
    return NextResponse.json(
      {
        error: "Could not read text from this PDF. Use a text-based PDF (not a scanned image) and try again.",
        parsed,
      },
      { status: 422 },
    );
  }

  // Prefer freshly parsed resume skills; fall back to existing profile skills only if parse found none.
  const skills = Array.from(
    new Set(parsed.skills?.length ? parsed.skills : (candidate.skills ?? [])),
  ).slice(0, 40);
  const education =
    parsed.education.length > 0 ? parsed.education : ((candidate.education as Education[]) ?? []);
  const experience =
    parsed.experience.length > 0 ? parsed.experience : ((candidate.experience as Experience[]) ?? []);
  const currentTitle = parsed.currentTitle || candidate.currentTitle;
  const location = parsed.location || candidate.location;
  const phone = parsed.phone || candidate.phone;
  const preferredLocations = Array.from(
    new Set([...(candidate.preferredLocations ?? []), ...(location ? [location] : [])].filter(Boolean)),
  );

  const completeness = profileCompleteness({
    name: candidate.user.name,
    phone,
    location,
    currentTitle,
    expectedSalary: candidate.expectedSalary,
    skills,
    education,
    experience,
    resumeName: file.name,
    noticePeriod: candidate.noticePeriod,
  });

  const updated = await prisma.candidateProfile.update({
    where: { id: candidate.id },
    data: {
      resumeName: file.name,
      resumeUrl,
      skills,
      education,
      experience,
      currentTitle,
      location,
      phone,
      preferredLocations,
      completeness,
      tags: Array.from(
        new Set([
          ...(candidate.tags ?? []).filter((tag) => !tag.startsWith("years:")),
          "Parsed",
          parsed.provider === "openai" ? "AI-parsed" : "Heuristic-parsed",
          ...(parsed.yearsExperience ? [`years:${parsed.yearsExperience}`] : []),
        ]),
      ),
    },
    include: { user: true },
  });

  return NextResponse.json({
    ok: true,
    resumeName: file.name,
    resumeUrl,
    completeness: updated.completeness,
    parsed: {
      provider: parsed.provider,
      skills: parsed.skills,
      summary: parsed.summary,
      currentTitle: parsed.currentTitle,
      location: parsed.location,
      phone: parsed.phone,
      yearsExperience: parsed.yearsExperience,
      experienceCount: parsed.experience.length,
      educationCount: parsed.education.length,
      rawTextLength: parsed.rawTextLength,
    },
  });
}
