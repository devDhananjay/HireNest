import type { Candidate, Job } from "./types";

export type MatchFactor = {
  label: string;
  score: number;
  detail: string;
  weight: number;
};

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

function yearsFromExperience(candidate: Candidate) {
  if (!candidate.experience?.length) return 0;
  let years = 0;
  for (const row of candidate.experience) {
    const start = Number.parseInt(row.start, 10);
    const end = /present/i.test(row.end) ? new Date().getFullYear() : Number.parseInt(row.end, 10);
    if (Number.isFinite(start) && Number.isFinite(end) && end >= start) {
      years += end - start;
    } else {
      years += 2;
    }
  }
  return Math.max(years, candidate.experience.length * 1.5);
}

export function matchCandidateToJob(candidate: Candidate, job: Job) {
  const skillHits = job.skills.filter((skill) =>
    candidate.skills.some((s) => s.toLowerCase() === skill.toLowerCase()),
  );
  const skillScore = Math.round((skillHits.length / Math.max(job.skills.length, 1)) * 100);

  const locationScore =
    candidate.location === job.location ||
    candidate.preferredLocations.includes(job.location) ||
    job.workMode === "Remote" ||
    candidate.preferredLocations.includes("Remote")
      ? 100
      : 35;

  const expYears = yearsFromExperience(candidate);
  const expScore =
    expYears >= job.experienceMin && expYears <= job.experienceMax + 2
      ? 92
      : expYears >= job.experienceMin - 1
        ? 72
        : 42;

  const salaryScore =
    candidate.expectedSalary >= job.salaryMin * 0.8 &&
    candidate.expectedSalary <= job.salaryMax * 1.15
      ? 88
      : 52;

  const weights = { skills: 0.38, location: 0.22, experience: 0.2, salary: 0.12, profile: 0.08 };
  const score = Math.round(
    clamp(
      skillScore * weights.skills +
        locationScore * weights.location +
        expScore * weights.experience +
        salaryScore * weights.salary +
        candidate.completeness * weights.profile,
    ),
  );

  // Calibrated "fit probability" for UI — not a guarantee of hire.
  const hireProbability = Math.round(
    clamp(12 + score * 0.78 + (skillHits.length >= 2 ? 6 : 0) - (candidate.completeness < 50 ? 8 : 0)),
  );
  const confidence =
    candidate.completeness >= 80 && skillHits.length >= 2
      ? "high"
      : candidate.completeness >= 55
        ? "medium"
        : "low";

  const factors: MatchFactor[] = [
    {
      label: "Skills",
      score: skillScore,
      weight: weights.skills,
      detail: skillHits.length ? `Matched ${skillHits.join(", ")}` : "Limited skill overlap",
    },
    {
      label: "Location",
      score: locationScore,
      weight: weights.location,
      detail: `${candidate.location || "Unknown"} vs ${job.location} (${job.workMode})`,
    },
    {
      label: "Experience",
      score: expScore,
      weight: weights.experience,
      detail: `~${expYears.toFixed(1)} yrs vs role ${job.experienceMin}–${job.experienceMax}`,
    },
    {
      label: "Salary band",
      score: salaryScore,
      weight: weights.salary,
      detail: "Compared expected CTC to posted range",
    },
    {
      label: "Profile depth",
      score: candidate.completeness,
      weight: weights.profile,
      detail: `Completeness ${candidate.completeness}%`,
    },
  ];

  return {
    score,
    hireProbability,
    confidence,
    factors,
    disclaimer:
      "Fit score and hire probability are model estimates from profile overlap. They are decision-support signals, not hiring outcomes.",
  };
}

export function resumeScore(candidate: Candidate, job?: Job) {
  const completeness = candidate.completeness;
  const match = job ? matchCandidateToJob(candidate, job) : null;
  const score = Math.round(completeness * 0.55 + (match?.score ?? 70) * 0.45);
  return {
    score,
    completeness,
    relevance: match?.score ?? null,
    hireProbability: match?.hireProbability ?? null,
    confidence: match?.confidence ?? (completeness >= 70 ? "medium" : "low"),
    disclaimer:
      match?.disclaimer ??
      "This is a completeness and relevance score for guidance only. It is not a guaranteed hiring probability.",
  };
}

export function jobMatchesExperience(job: Job, experience: string) {
  if (!experience) return true;
  if (experience === "0-1") return job.experienceMin <= 1;
  if (experience === "1-3") return job.experienceMin <= 3 && job.experienceMax >= 1;
  if (experience === "3-6") return job.experienceMin <= 6 && job.experienceMax >= 3;
  if (experience === "6-10") return job.experienceMax >= 6;
  return true;
}

export function jobMatchesSearch(
  job: Job,
  filters: { q: string; location: string; experience: string; type: string },
) {
  if (job.status !== "active") return false;
  const haystack = `${job.title} ${job.skills.join(" ")} ${job.location} ${job.category} ${job.employmentType}`.toLowerCase();
  if (filters.q && !haystack.includes(filters.q.toLowerCase())) return false;
  if (filters.location && job.location !== filters.location) return false;
  if (filters.type && job.category !== filters.type && job.employmentType !== filters.type) return false;
  if (filters.experience && !jobMatchesExperience(job, filters.experience)) return false;
  return true;
}

export function profileCompleteness(candidate: Partial<Candidate>) {
  const checks = [
    Boolean(candidate.name),
    Boolean(candidate.phone),
    Boolean(candidate.location),
    Boolean(candidate.currentTitle),
    Boolean(candidate.expectedSalary),
    Boolean(candidate.skills?.length),
    Boolean(candidate.education?.length),
    Boolean(candidate.experience?.length),
    Boolean(candidate.resumeName),
    Boolean(candidate.noticePeriod),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
