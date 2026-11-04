import type { Candidate, Job } from "./types";

export type MatchFactor = {
  label: string;
  score: number;
  detail: string;
};

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

  const expYears = candidate.experience.length * 2.5;
  const expScore =
    expYears >= job.experienceMin && expYears <= job.experienceMax + 2
      ? 90
      : expYears >= job.experienceMin - 1
        ? 70
        : 40;

  const salaryScore =
    candidate.expectedSalary >= job.salaryMin * 0.8 &&
    candidate.expectedSalary <= job.salaryMax * 1.15
      ? 85
      : 50;

  const score = Math.round(
    skillScore * 0.4 + locationScore * 0.25 + expScore * 0.2 + salaryScore * 0.15,
  );

  const factors: MatchFactor[] = [
    {
      label: "Skills",
      score: skillScore,
      detail: skillHits.length
        ? `Matched ${skillHits.join(", ")}`
        : "Limited skill overlap",
    },
    {
      label: "Location",
      score: locationScore,
      detail: `${candidate.location} vs ${job.location} (${job.workMode})`,
    },
    {
      label: "Experience",
      score: expScore,
      detail: `Role asks ${job.experienceMin}–${job.experienceMax} years`,
    },
    {
      label: "Salary band",
      score: salaryScore,
      detail: "Compared expected CTC to posted range",
    },
  ];

  return { score, factors };
}

export function resumeScore(candidate: Candidate, job?: Job) {
  const completeness = candidate.completeness;
  const match = job ? matchCandidateToJob(candidate, job).score : 70;
  const score = Math.round(completeness * 0.55 + match * 0.45);
  return {
    score,
    completeness,
    relevance: job ? match : null,
    disclaimer:
      "This is a completeness and relevance score for guidance only. It is not a hiring probability.",
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
