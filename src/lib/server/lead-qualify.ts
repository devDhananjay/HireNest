export type LeadQualifyInput = {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  hiringNeed: string;
  roles: string;
  location: string;
};

export type LeadQualifyResult = {
  score: number;
  label: "Hot" | "Warm" | "Cold";
  notes: string;
  provider: "heuristic" | "openai";
};

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

function heuristicQualify(input: LeadQualifyInput): LeadQualifyResult {
  let score = 28;
  const notes: string[] = [];

  if (input.companyName.trim().length > 2) {
    score += 10;
    notes.push("Company named");
  }
  if (/@.+\./.test(input.email) && !/gmail|yahoo|hotmail|outlook/i.test(input.email)) {
    score += 14;
    notes.push("Work email");
  } else if (/@.+\./.test(input.email)) {
    score += 6;
    notes.push("Personal email");
  }
  if (/(\+91)?[6-9]\d{9}/.test(input.phone.replace(/\s/g, ""))) {
    score += 10;
    notes.push("Valid phone");
  }
  if (input.roles.trim().length > 2) {
    score += 10;
    notes.push("Roles listed");
  }
  if (input.location.trim().length > 2) {
    score += 8;
    notes.push("Location set");
  }

  const need = input.hiringNeed.toLowerCase();
  if (need.length > 80) {
    score += 12;
    notes.push("Detailed brief");
  } else if (need.length > 30) {
    score += 6;
    notes.push("Brief present");
  }

  if (/\b(urgent|asap|immediate|this week|immediate joiner)\b/i.test(need)) {
    score += 12;
    notes.push("Urgency signal");
  }
  if (/\b(bulk|volume|campus|10\+|multiple openings|headcount)\b/i.test(need) || /\d+\s*(roles?|openings?|hires?)/i.test(need)) {
    score += 10;
    notes.push("Volume hiring");
  }
  if (/\b(lakh|lpa|ctc|budget|package|₹|rs\.?)\b/i.test(need)) {
    score += 8;
    notes.push("Budget mentioned");
  }
  if (/\b(executive|cxo|vp|director|leadership)\b/i.test(`${need} ${input.roles}`)) {
    score += 8;
    notes.push("Senior search");
  }

  score = clamp(Math.round(score));
  const label: LeadQualifyResult["label"] = score >= 72 ? "Hot" : score >= 48 ? "Warm" : "Cold";
  return { score, label, notes: notes.join(" · ") || "Basic capture", provider: "heuristic" };
}

export async function qualifyLead(input: LeadQualifyInput): Promise<LeadQualifyResult> {
  const base = heuristicQualify(input);
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return base;

  try {
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Score Indian recruitment inbound leads 0-100. Return JSON {score:number, label:'Hot'|'Warm'|'Cold', notes:string}. Hot>=72, Warm>=48.",
          },
          {
            role: "user",
            content: JSON.stringify(input),
          },
        ],
      }),
    });
    if (!res.ok) return base;
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}") as Partial<LeadQualifyResult>;
    const score = clamp(Number(parsed.score ?? base.score));
    const label =
      parsed.label === "Hot" || parsed.label === "Warm" || parsed.label === "Cold"
        ? parsed.label
        : score >= 72
          ? "Hot"
          : score >= 48
            ? "Warm"
            : "Cold";
    return {
      score,
      label,
      notes: String(parsed.notes || base.notes).slice(0, 280),
      provider: "openai",
    };
  } catch {
    return base;
  }
}
