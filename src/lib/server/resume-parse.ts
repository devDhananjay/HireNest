import type { Education, Experience } from "@/lib/types";

const SKILL_LEXICON = [
  "React",
  "TypeScript",
  "JavaScript",
  "Next.js",
  "Node.js",
  "Python",
  "Java",
  "Spring Boot",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "Docker",
  "Kubernetes",
  "Figma",
  "User Research",
  "Design Systems",
  "Prototyping",
  "Tailwind CSS",
  "Excel",
  "SQL",
  "Kafka",
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

export type ParsedResume = {
  skills: string[];
  currentTitle?: string;
  location?: string;
  education: Education[];
  experience: Experience[];
  summary: string;
  provider: "openai" | "heuristic";
};

function extractText(bytes: Buffer, fileName: string, mimeType?: string | null) {
  const lower = fileName.toLowerCase();
  const asUtf8 = bytes.toString("utf8");
  // PDF/DOCX are binary — pull printable runs for heuristic parse
  if (lower.endsWith(".pdf") || mimeType?.includes("pdf") || lower.endsWith(".docx") || lower.endsWith(".doc")) {
    const printable = asUtf8.replace(/[^\x09\x0A\x0D\x20-\x7E]/g, " ");
    return printable.replace(/\s+/g, " ").trim().slice(0, 20000);
  }
  return asUtf8.slice(0, 20000);
}

function heuristicParse(text: string, fileName: string): ParsedResume {
  const skills = SKILL_LEXICON.filter((skill) =>
    text.toLowerCase().includes(skill.toLowerCase()),
  );

  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = text.match(/(\+91[\s-]?)?[6-9]\d{9}/);
  const titleHints = [
    "Product Designer",
    "Frontend Engineer",
    "Backend Engineer",
    "Full Stack",
    "Software Engineer",
    "Credit Analyst",
    "Sales Manager",
    "Product Manager",
    "HR Business Partner",
  ];
  const currentTitle = titleHints.find((title) => text.toLowerCase().includes(title.toLowerCase()));
  const cities = ["Bengaluru", "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Chennai", "Ahmedabad", "Remote"];
  const location = cities.find((city) => text.toLowerCase().includes(city.toLowerCase()));

  const education: Education[] = [];
  if (/b\.?tech|bachelor|m\.?tech|mba|m\.?des|b\.?des/i.test(text)) {
    education.push({
      id: `edu-parse-${Date.now()}`,
      school: "Parsed from resume",
      degree: /mba/i.test(text) ? "MBA" : /m\.?des/i.test(text) ? "M.Des" : /m\.?tech/i.test(text) ? "M.Tech" : "B.Tech",
      field: "See resume",
      year: (text.match(/20\d{2}/) || [""])[0],
    });
  }

  const experience: Experience[] = [];
  if (/engineer|designer|manager|analyst|developer/i.test(text)) {
    experience.push({
      id: `exp-parse-${Date.now()}`,
      company: "Parsed from resume",
      title: currentTitle || "Professional",
      start: "",
      end: "Present",
      summary: text.slice(0, 240),
    });
  }

  return {
    skills: skills.length ? skills : fileName.replace(/[_-]/g, " ").split(/\s+/).filter((w) => w.length > 3).slice(0, 5),
    currentTitle,
    location: location === "Bangalore" ? "Bengaluru" : location,
    education,
    experience,
    summary: [
      emailMatch ? `Email signal: ${emailMatch[0]}` : null,
      phoneMatch ? `Phone signal found` : null,
      `${skills.length} skills detected from resume text`,
    ]
      .filter(Boolean)
      .join(". "),
    provider: "heuristic",
  };
}

async function openAiParse(text: string): Promise<ParsedResume | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key || !text.trim()) return null;
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
              "Extract resume fields as JSON with keys: skills (string[]), currentTitle, location, education[{school,degree,field,year}], experience[{company,title,start,end,summary}], summary.",
          },
          { role: "user", content: text.slice(0, 12000) },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Omit<ParsedResume, "provider">;
    return {
      skills: parsed.skills ?? [],
      currentTitle: parsed.currentTitle,
      location: parsed.location,
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
    };
  } catch {
    return null;
  }
}

export async function parseResumeFile(bytes: Buffer, fileName: string, mimeType?: string | null) {
  const text = extractText(bytes, fileName, mimeType);
  const ai = await openAiParse(text);
  if (ai) return ai;
  return heuristicParse(text, fileName);
}
