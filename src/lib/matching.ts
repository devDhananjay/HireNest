import type { Candidate, Job } from "./types";

export type MatchFactor = {
  label: string;
  score: number;
  detail: string;
  weight: number;
};

const SKILL_ALIASES: Record<string, string[]> = {
  react: ["react", "react.js", "reactjs", "react native", "react-native"],
  "react native": ["react native", "react-native", "react.js", "react"],
  "react.js": ["react.js", "reactjs", "react", "react native"],
  "next.js": ["next.js", "nextjs", "next"],
  typescript: ["typescript", "ts"],
  javascript: ["javascript", "js", "es6", "ecmascript"],
  redux: ["redux", "redux toolkit", "redux-thunk", "redux toolkit"],
  "node.js": ["node.js", "nodejs", "node"],
  "rest apis": ["rest", "rest api", "rest apis", "restful", "api"],
  firebase: ["firebase", "fcm"],
  sql: ["sql", "postgresql", "mysql", "sqlite"],
  postgresql: ["postgresql", "postgres", "sql"],
  figma: ["figma", "ui/ux", "design"],
  leadership: ["leadership", "lead", "mentored", "managed"],
};

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9.+#/\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function tokenize(value: string) {
  return normalize(value)
    .split(/[\s,/|]+/)
    .filter((token) => token.length > 1);
}

function skillVariants(skill: string) {
  const key = normalize(skill);
  return new Set([key, ...(SKILL_ALIASES[key] ?? [])]);
}

function skillsMatch(candidateSkill: string, jobSkill: string) {
  const left = skillVariants(candidateSkill);
  const right = skillVariants(jobSkill);
  for (const item of left) {
    if (right.has(item)) return true;
    for (const other of right) {
      if (item.includes(other) || other.includes(item)) return true;
    }
  }
  return false;
}

function candidateSkillPool(candidate: Candidate) {
  const pool = new Set<string>();
  for (const skill of candidate.skills ?? []) pool.add(skill);
  for (const row of candidate.experience ?? []) {
    if (row.title) pool.add(row.title);
    if (row.summary) {
      for (const token of tokenize(row.summary)) {
        if (token.length > 3) pool.add(token);
      }
    }
  }
  if (candidate.currentTitle) pool.add(candidate.currentTitle);
  return Array.from(pool);
}

export function yearsFromExperience(candidate: Candidate) {
  const tagged = candidate.tags?.find((tag) => /^years:\d+(\.\d+)?$/i.test(tag));
  if (tagged) {
    const value = Number.parseFloat(tagged.split(":")[1] || "");
    if (Number.isFinite(value) && value > 0) return value;
  }

  if (!candidate.experience?.length) return 0;
  let years = 0;
  for (const row of candidate.experience) {
    const start = Number.parseInt(String(row.start).slice(0, 4), 10);
    const end = /present/i.test(row.end)
      ? new Date().getFullYear()
      : Number.parseInt(String(row.end).slice(0, 4), 10);
    if (Number.isFinite(start) && Number.isFinite(end) && end >= start) {
      years += Math.max(end - start, 0.5);
    } else {
      years += 1.5;
    }
  }
  return Math.max(years, candidate.experience.length * 1.2);
}

function titleOverlapScore(candidate: Candidate, job: Job) {
  const title = normalize(candidate.currentTitle || "");
  const jobTitle = normalize(job.title);
  if (!title || !jobTitle) return 35;

  if (title === jobTitle) return 100;
  if (title.includes(jobTitle) || jobTitle.includes(title)) return 92;

  const candTokens = new Set(tokenize(title));
  const jobTokens = tokenize(job.title).filter((t) => !["senior", "junior", "lead", "associate"].includes(t));
  const hits = jobTokens.filter((token) => {
    if (candTokens.has(token)) return true;
    // React Native developer vs Frontend engineer: shared mobile/frontend family
    if (["react", "native", "frontend", "front", "mobile", "javascript", "typescript", "next"].includes(token)) {
      return [...candTokens].some((c) => c.includes(token) || token.includes(c));
    }
    return false;
  });
  if (!jobTokens.length) return 40;
  return clamp(Math.round((hits.length / jobTokens.length) * 100));
}

function jdKeywordScore(candidate: Candidate, job: Job) {
  const corpus = normalize(
    [
      candidate.currentTitle,
      ...(candidate.skills ?? []),
      ...(candidate.experience ?? []).flatMap((row) => [row.title, row.summary]),
    ]
      .filter(Boolean)
      .join(" "),
  );
  const keywords = Array.from(
    new Set(
      tokenize(
        `${job.title} ${job.description ?? ""} ${(job.skills ?? []).join(" ")} ${(job.requirements ?? []).join(" ")}`,
      )
        .filter((token) => token.length > 3)
        .slice(0, 40),
    ),
  );
  if (!keywords.length) return 50;
  const hits = keywords.filter((token) => corpus.includes(token));
  return clamp(Math.round((hits.length / keywords.length) * 100));
}

function locationScoreFor(candidate: Candidate, job: Job) {
  const cand = normalize(candidate.location || "");
  const preferred = (candidate.preferredLocations ?? []).map(normalize);
  const jobLoc = normalize(job.location);
  const openToRemote = preferred.includes("remote");

  // Remote-friendly candidates only get a full location boost on remote (or hybrid) roles —
  // not on every on-site job.
  if (job.workMode === "Remote") return openToRemote || !cand ? 100 : 78;
  if (!cand && !preferred.length) return 45;
  if (cand === jobLoc || preferred.includes(jobLoc)) return 100;

  const delhiFamily = ["delhi ncr", "delhi", "noida", "gurgaon", "gurugram", "new delhi"];
  if (delhiFamily.includes(cand) && delhiFamily.includes(jobLoc)) return 95;
  if (cand.includes(jobLoc) || jobLoc.includes(cand)) return 88;
  if (job.workMode === "Hybrid" && (openToRemote || delhiFamily.includes(cand))) return 70;
  if (job.workMode === "Hybrid") return 58;
  return 28;
}

export function matchCandidateToJob(candidate: Candidate, job: Job) {
  const pool = candidateSkillPool(candidate);
  const jobSkills = job.skills ?? [];
  const skillHits = jobSkills.filter((skill) => pool.some((item) => skillsMatch(item, skill)));
  const softHits = jobSkills.filter(
    (skill) => !skillHits.includes(skill) && pool.some((item) => normalize(item).includes(normalize(skill).slice(0, 4))),
  );
  const skillScore = clamp(
    Math.round(((skillHits.length + softHits.length * 0.35) / Math.max(jobSkills.length, 1)) * 100),
  );

  const locationScore = locationScoreFor(candidate, job);
  const expYears = yearsFromExperience(candidate);
  const expScore =
    expYears >= job.experienceMin && expYears <= job.experienceMax + 3
      ? 94
      : expYears >= job.experienceMin - 1
        ? 78
        : expYears >= job.experienceMin - 2
          ? 58
          : 38;

  const hasSalary = Boolean(candidate.expectedSalary && candidate.expectedSalary > 0);
  const salaryScore = !hasSalary
    ? 70
    : candidate.expectedSalary >= job.salaryMin * 0.75 && candidate.expectedSalary <= job.salaryMax * 1.25
      ? 90
      : candidate.expectedSalary <= job.salaryMax * 1.45
        ? 68
        : 42;

  const titleScore = titleOverlapScore(candidate, job);
  const keywordScore = jdKeywordScore(candidate, job);

  const weights = {
    skills: 0.32,
    title: 0.22,
    keywords: 0.1,
    location: 0.14,
    experience: 0.12,
    salary: 0.05,
    profile: 0.05,
  };

  const score = Math.round(
    clamp(
      skillScore * weights.skills +
        titleScore * weights.title +
        keywordScore * weights.keywords +
        locationScore * weights.location +
        expScore * weights.experience +
        salaryScore * weights.salary +
        (candidate.completeness ?? 0) * weights.profile,
    ),
  );

  const hireProbability = Math.round(
    clamp(
      10 +
        score * 0.8 +
        (skillHits.length >= 2 ? 7 : 0) +
        (titleScore >= 80 ? 4 : 0) -
        ((candidate.completeness ?? 0) < 45 ? 10 : 0),
    ),
  );

  const confidence =
    candidate.completeness >= 75 && (skillHits.length >= 2 || titleScore >= 80)
      ? "high"
      : candidate.completeness >= 50 || skillHits.length >= 1
        ? "medium"
        : "low";

  const factors: MatchFactor[] = [
    {
      label: "Skills",
      score: skillScore,
      weight: weights.skills,
      detail: skillHits.length
        ? `Matched ${skillHits.join(", ")}${softHits.length ? ` · near: ${softHits.slice(0, 3).join(", ")}` : ""}`
        : "Limited skill overlap — update skills on your profile",
    },
    {
      label: "Title fit",
      score: titleScore,
      weight: weights.title,
      detail: `${candidate.currentTitle || "No title"} ↔ ${job.title}`,
    },
    {
      label: "JD keywords",
      score: keywordScore,
      weight: weights.keywords,
      detail: "Overlap across description, requirements and skills",
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
      detail: hasSalary ? "Compared expected CTC to posted range" : "No expected CTC set — neutral score",
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
    skillHits,
    disclaimer:
      "Fit score and hire probability are model estimates from profile overlap. They are decision-support signals, not hiring outcomes.",
  };
}

export function resumeScore(candidate: Candidate, job?: Job) {
  const completeness = candidate.completeness;
  const match = job ? matchCandidateToJob(candidate, job) : null;
  const score = Math.round(completeness * 0.35 + (match?.score ?? 65) * 0.65);
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

export function rankJobsForCandidate(jobs: Job[], candidate?: Candidate | null) {
  if (!candidate) return jobs.map((job) => ({ job, match: null as ReturnType<typeof matchCandidateToJob> | null }));
  return jobs
    .map((job) => ({ job, match: matchCandidateToJob(candidate, job) }))
    .sort((a, b) => (b.match?.score ?? 0) - (a.match?.score ?? 0));
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
  const haystack = `${job.title} ${(job.skills ?? []).join(" ")} ${job.description ?? ""} ${job.location} ${job.category ?? ""} ${job.employmentType}`.toLowerCase();
  if (filters.q) {
    const q = filters.q.toLowerCase().trim();
    const tokens = q.split(/\s+/).filter(Boolean);
    const ok = tokens.every((token) => haystack.includes(token));
    if (!ok) return false;
  }
  if (filters.location && job.location !== filters.location) {
    const delhiFamily = ["Delhi NCR", "Delhi", "Noida", "Gurgaon", "Gurugram"];
    if (!(delhiFamily.includes(filters.location) && delhiFamily.includes(job.location))) return false;
  }
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
