import { PDFParse } from "pdf-parse";
import type { Education, Experience } from "@/lib/types";

const SKILL_LEXICON = [
  "React Native",
  "React.js",
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Redux Toolkit",
  "Redux",
  "Node.js",
  "Express",
  "Python",
  "Java",
  "Spring Boot",
  "PostgreSQL",
  "MongoDB",
  "SQLite",
  "Firebase",
  "AWS",
  "Docker",
  "Kubernetes",
  "Kafka",
  "GraphQL",
  "REST APIs",
  "WebSocket",
  "Socket.IO",
  "OAuth",
  "JWT",
  "CI/CD",
  "Git",
  "GitHub",
  "GitLab",
  "Bitbucket",
  "Figma",
  "Tailwind CSS",
  "HTML",
  "CSS",
  "SSR",
  "SEO",
  "Chart.js",
  "Twilio",
  "Google Maps",
  "Push Notifications",
  "Agile",
  "Scrum",
  "User Research",
  "Design Systems",
  "Prototyping",
  "Excel",
  "SQL",
  "Product Management",
  "Sales",
  "CRM",
  "SolidWorks",
  "GD&T",
  "Negotiation",
  "Leadership",
  "Communication",
  "Financial Modelling",
  "Credit Analysis",
  "Healthcare",
  "NABH",
];

const SKILL_ALIASES: Record<string, string> = {
  "react-native": "React Native",
  "react native": "React Native",
  "react.js": "React.js",
  reactjs: "React.js",
  "next.js": "Next.js",
  nextjs: "Next.js",
  ts: "TypeScript",
  typescript: "TypeScript",
  js: "JavaScript",
  javascript: "JavaScript",
  es6: "JavaScript",
  "redux-thunk": "Redux",
  "redux toolkit": "Redux Toolkit",
  "react-hooks": "React",
  "rest api": "REST APIs",
  "restful apis": "REST APIs",
  "rest apis": "REST APIs",
  websocket: "WebSocket",
  "socket.io": "Socket.IO",
  "socket io": "Socket.IO",
  fcm: "Push Notifications",
  "push notifications": "Push Notifications",
  oauth: "OAuth",
  "oauth 2.0": "OAuth",
  jwt: "JWT",
  cicd: "CI/CD",
  "ci/cd": "CI/CD",
  gitlab: "GitLab",
  github: "GitHub",
  bitbucket: "Bitbucket",
  sqlite: "SQLite",
  firebase: "Firebase",
  twilio: "Twilio",
  figma: "Figma",
  ssr: "SSR",
  seo: "SEO",
  agile: "Agile",
  scrum: "Scrum",
};

export type ParsedResume = {
  skills: string[];
  currentTitle?: string;
  location?: string;
  phone?: string;
  email?: string;
  noticePeriod?: string;
  education: Education[];
  experience: Experience[];
  summary: string;
  yearsExperience?: number;
  provider: "openai" | "heuristic";
  rawTextLength: number;
};

async function extractPdfText(bytes: Buffer) {
  const parser = new PDFParse({ data: bytes });
  try {
    const result = await parser.getText();
    return (result.text || "").replace(/\u0000/g, " ").replace(/\s+/g, " ").trim();
  } finally {
    await parser.destroy?.();
  }
}

function extractTextFallback(bytes: Buffer, fileName: string, mimeType?: string | null) {
  const lower = fileName.toLowerCase();
  const asUtf8 = bytes.toString("utf8");
  if (lower.endsWith(".pdf") || mimeType?.includes("pdf") || lower.endsWith(".docx") || lower.endsWith(".doc")) {
    const printable = asUtf8.replace(/[^\x09\x0A\x0D\x20-\x7E]/g, " ");
    return printable.replace(/\s+/g, " ").trim().slice(0, 40000);
  }
  return asUtf8.slice(0, 40000);
}

export async function extractResumeText(bytes: Buffer, fileName: string, mimeType?: string | null) {
  const lower = fileName.toLowerCase();
  const isPdf = lower.endsWith(".pdf") || Boolean(mimeType?.includes("pdf"));
  if (isPdf) {
    try {
      const text = await extractPdfText(bytes);
      if (text.length > 80) return text.slice(0, 40000);
      console.warn("[hireora:pdf-parse]", "PDF text too short", text.length);
    } catch (error) {
      console.warn("[hireora:pdf-parse]", error);
    }
    // Never fall back to raw binary for PDFs — it invents fake phones/skills from noise.
    return "";
  }
  return extractTextFallback(bytes, fileName, mimeType);
}

function normalizeSkillToken(token: string) {
  const cleaned = token.toLowerCase().replace(/[^a-z0-9.+#/\s-]/g, " ").replace(/\s+/g, " ").trim();
  if (!cleaned || cleaned.length < 2) return null;
  if (SKILL_ALIASES[cleaned]) return SKILL_ALIASES[cleaned];
  const lexiconHit = SKILL_LEXICON.find((skill) => skill.toLowerCase() === cleaned);
  if (lexiconHit) return lexiconHit;
  return null;
}

function detectSkills(text: string) {
  const found = new Set<string>();
  const lower = text.toLowerCase();

  for (const skill of SKILL_LEXICON) {
    if (lower.includes(skill.toLowerCase())) found.add(skill);
  }
  for (const [alias, canonical] of Object.entries(SKILL_ALIASES)) {
    if (lower.includes(alias)) found.add(canonical);
  }

  // Pull comma / bullet chunks from a SKILLS section when present
  const skillsBlock = text.match(/skills([\s\S]{0,1800}?)(professional experience|experience|projects|education|achievements|$)/i);
  if (skillsBlock?.[1]) {
    for (const part of skillsBlock[1].split(/[,•|/]/)) {
      const normalized = normalizeSkillToken(part);
      if (normalized) found.add(normalized);
    }
  }

  return Array.from(found).slice(0, 40);
}

function detectTitle(text: string) {
  const titleHints = [
    "React Native Developer",
    "React Native Lead",
    "Frontend Engineer",
    "Front End Engineer",
    "Full Stack Developer",
    "Full-Stack Developer",
    "Backend Engineer",
    "Software Engineer",
    "Mobile Developer",
    "Product Designer",
    "Credit Analyst",
    "Sales Manager",
    "Product Manager",
    "HR Business Partner",
  ];
  const lower = text.toLowerCase();
  const direct = titleHints.find((title) => lower.includes(title.toLowerCase()));
  if (direct) return direct;

  const lead = text.match(/react native developer[^.\n]{0,40}/i);
  if (lead) return lead[0].replace(/\s+/g, " ").trim().slice(0, 60);

  return undefined;
}

function detectLocation(text: string) {
  const cities = [
    ["Delhi NCR", "Delhi NCR"],
    ["Noida", "Delhi NCR"],
    ["Gurgaon", "Delhi NCR"],
    ["Gurugram", "Delhi NCR"],
    ["New Delhi", "Delhi NCR"],
    ["Bengaluru", "Bengaluru"],
    ["Bangalore", "Bengaluru"],
    ["Mumbai", "Mumbai"],
    ["Hyderabad", "Hyderabad"],
    ["Pune", "Pune"],
    ["Chennai", "Chennai"],
    ["Ahmedabad", "Ahmedabad"],
    ["Remote", "Remote"],
  ] as const;
  const lower = text.toLowerCase();
  for (const [needle, canonical] of cities) {
    if (lower.includes(needle.toLowerCase())) return canonical;
  }
  return undefined;
}

function detectYears(text: string) {
  const match = text.match(/(\d+(?:\.\d+)?)\+?\s*years?\s+of\s+experience/i);
  if (match) return Number.parseFloat(match[1]);
  return undefined;
}

function yearFromResumeDate(value: string) {
  if (/present/i.test(value)) return "Present";
  const parts = value.match(/(\d{2})\/(\d{4})/);
  if (parts) return parts[2];
  const year = value.match(/(20\d{2}|19\d{2})/);
  return year?.[1] || value;
}

function detectExperience(text: string, fallbackTitle?: string): Experience[] {
  const rows: Experience[] = [];
  const pattern =
    /([A-Z][A-Za-z0-9&.,'’\-]*(?:\s+[A-Za-z0-9&.,'’\-]+){0,6}?\s(?:Pvt\.?\s*Ltd\.?|Ltd\.?|Limited|Inc\.?|LLC|Technologies|Technosoft|Services|Mindz))\s+(React Native(?:\/React\.js)? Developer(?: as Lead)?|Frontend Engineer|Software Engineer|Mobile Developer|Full Stack Developer)\s+(\d{2}\/\d{4})\s*[–\-—]+\s*(present|\d{2}\/\d{4})/gi;

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) && rows.length < 8) {
    const company = match[1]
      .replace(/\s+/g, " ")
      .replace(/^.*?\b(EXPERIENCE|Experience)\b/i, "")
      .replace(/^[^A-Z]+/, "")
      .trim();
    rows.push({
      id: `exp-parse-${rows.length + 1}`,
      company: company || match[1].replace(/\s+/g, " ").trim(),
      title: match[2].replace(/\s+/g, " ").trim(),
      start: yearFromResumeDate(match[3]),
      end: yearFromResumeDate(match[4]),
      summary: `${company || match[1].trim()} · ${match[3]} – ${match[4]}`,
    });
  }

  if (!rows.length) {
    const loose =
      / (React Native(?:\/React\.js)? Developer(?: as Lead)?|Frontend Engineer|Software Engineer)\s+(\d{2}\/\d{4})\s*[–\-—]+\s*(present|\d{2}\/\d{4})/gi;
    while ((match = loose.exec(text)) && rows.length < 6) {
      const before = text.slice(Math.max(0, match.index - 80), match.index);
      const companyGuess = before.match(/([A-Z][A-Za-z0-9&.,'’\-\s]{3,50}(?:Pvt\.?\s*Ltd\.?|Ltd\.?|Limited|Technologies|Technosoft|Services|Mindz))\s*$/);
      rows.push({
        id: `exp-parse-${rows.length + 1}`,
        company: companyGuess?.[1]?.trim() || "Parsed from resume",
        title: match[1].trim(),
        start: yearFromResumeDate(match[2]),
        end: yearFromResumeDate(match[3]),
        summary: `${match[1]} · ${match[2]} – ${match[3]}`,
      });
    }
  }

  if (!rows.length && /developer|engineer|designer|manager|analyst/i.test(text)) {
    const years = detectYears(text);
    rows.push({
      id: `exp-parse-1`,
      company: "Parsed from resume",
      title: fallbackTitle || "Professional",
      start: years ? String(new Date().getFullYear() - Math.ceil(years)) : "",
      end: "Present",
      summary: text.slice(0, 280),
    });
  }

  return rows;
}

function detectEducation(text: string): Education[] {
  const education: Education[] = [];
  if (/masters? of computer application|\bMCA\b/i.test(text)) {
    education.push({
      id: "edu-parse-1",
      school: "Parsed from resume",
      degree: "MCA",
      field: "Computer Application",
      year: (text.match(/20\d{2}/) || [""])[0],
    });
  } else if (/b\.?tech|bachelor|m\.?tech|mba|m\.?des|b\.?des/i.test(text)) {
    education.push({
      id: "edu-parse-1",
      school: "Parsed from resume",
      degree: /mba/i.test(text) ? "MBA" : /m\.?des/i.test(text) ? "M.Des" : /m\.?tech/i.test(text) ? "M.Tech" : "B.Tech",
      field: "See resume",
      year: (text.match(/20\d{2}/) || [""])[0],
    });
  }
  return education;
}

function heuristicParse(text: string, fileName: string): ParsedResume {
  if (!text.trim()) {
    return {
      skills: [],
      education: [],
      experience: [],
      summary: "Could not read resume text. Re-upload a text-based PDF.",
      provider: "heuristic",
      rawTextLength: 0,
    };
  }

  const skills = detectSkills(text);
  const currentTitle = detectTitle(text);
  const location = detectLocation(text);
  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  // Prefer +91 / spaced Indian mobiles; avoid random 10-digit noise from bad extracts
  const phoneMatch =
    text.match(/\+91[\s-]?[6-9]\d{9}/) ||
    text.match(/(?:^|[^\d])([6-9]\d{9})(?:[^\d]|$)/);
  const phone = phoneMatch ? (phoneMatch[0].match(/[6-9]\d{9}|\+91[\s-]?[6-9]\d{9}/)?.[0] || "").replace(/\s/g, "") : undefined;
  const yearsExperience = detectYears(text);
  const education = detectEducation(text);
  const experience = detectExperience(text, currentTitle);

  return {
    skills,
    currentTitle,
    location,
    phone: phone ? (phone.startsWith("+") ? phone : `+91${phone}`) : undefined,
    email: emailMatch?.[0],
    education,
    experience,
    yearsExperience,
    summary: [
      currentTitle ? `Title: ${currentTitle}` : null,
      yearsExperience ? `${yearsExperience}+ years experience` : null,
      location ? `Location: ${location}` : null,
      `${skills.length} skills extracted`,
      emailMatch ? `Email: ${emailMatch[0]}` : null,
    ]
      .filter(Boolean)
      .join(" · ") || `Parsed ${fileName}`,
    provider: "heuristic",
    rawTextLength: text.length,
  };
}

async function openAiParse(text: string): Promise<ParsedResume | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key || text.trim().length < 40) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Extract Indian resume fields as JSON: skills(string[]), currentTitle, location, phone, email, noticePeriod, yearsExperience(number), education[{school,degree,field,year}], experience[{company,title,start,end,summary}], summary. Normalize location to Bengaluru/Mumbai/Delhi NCR/Hyderabad/Pune/Chennai/Ahmedabad/Remote when possible. Expand skills to canonical tech names (React Native, TypeScript, Next.js, etc).",
          },
          { role: "user", content: text.slice(0, 14000) },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Omit<ParsedResume, "provider" | "rawTextLength">;
    const skills = Array.from(
      new Set((parsed.skills ?? []).map((s) => normalizeSkillToken(s) || s).filter(Boolean)),
    ) as string[];
    return {
      skills,
      currentTitle: parsed.currentTitle,
      location: parsed.location,
      phone: parsed.phone,
      email: parsed.email,
      noticePeriod: parsed.noticePeriod,
      yearsExperience: parsed.yearsExperience,
      education: (parsed.education ?? []).map((row, i) => ({
        id: `edu-ai-${i}`,
        school: row.school ?? "",
        degree: row.degree ?? "",
        field: row.field ?? "",
        year: row.year ?? "",
      })),
      experience: (parsed.experience ?? []).map((row, i) => ({
        id: `exp-ai-${i}`,
        company: row.company ?? "",
        title: row.title ?? "",
        start: row.start ?? "",
        end: row.end ?? "",
        summary: row.summary ?? "",
      })),
      summary: parsed.summary ?? "Parsed with OpenAI",
      provider: "openai",
      rawTextLength: text.length,
    };
  } catch {
    return null;
  }
}

export async function parseResumeFile(bytes: Buffer, fileName: string, mimeType?: string | null) {
  const text = await extractResumeText(bytes, fileName, mimeType);
  const ai = await openAiParse(text);
  if (ai && ai.skills.length) return ai;
  const heuristic = heuristicParse(text, fileName);
  if (ai) {
    return {
      ...heuristic,
      ...ai,
      skills: Array.from(new Set([...(ai.skills ?? []), ...heuristic.skills])),
      provider: "openai" as const,
      rawTextLength: text.length,
    };
  }
  return heuristic;
}
