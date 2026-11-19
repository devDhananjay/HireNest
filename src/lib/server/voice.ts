export type VoiceQuestion = {
  prompt: string;
  focus: string;
};

export function buildVoiceQuestions(job: {
  title: string;
  description: string;
  skills: string[];
  requirements: string[];
  department: string;
}): VoiceQuestion[] {
  const skill = job.skills[0] || "this role";
  const req = job.requirements[0] || "relevant experience";
  return [
    {
      prompt: `Introduce yourself briefly and why you are interested in the ${job.title} role.`,
      focus: "Motivation",
    },
    {
      prompt: `Walk through one project where you used ${skill}. What was your contribution and the outcome?`,
      focus: "Skills evidence",
    },
    {
      prompt: `This role needs: "${req}". How have you demonstrated this recently?`,
      focus: "Requirements fit",
    },
    {
      prompt: `Describe a challenge in ${job.department || "your team"} work and how you handled stakeholders.`,
      focus: "Communication",
    },
    {
      prompt: `What notice period / joining timeline can you commit to, and any constraints we should know?`,
      focus: "Logistics",
    },
  ];
}

export async function transcribeAudio(bytes: Buffer, mimeType: string) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return {
      transcript:
        "[Demo transcript] Candidate answered clearly with relevant experience. Connect OPENAI_API_KEY for real Whisper transcription.",
      provider: "demo" as const,
    };
  }

  const form = new FormData();
  const blob = new Blob([new Uint8Array(bytes)], { type: mimeType || "audio/webm" });
  form.append("file", blob, "answer.webm");
  form.append("model", "whisper-1");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  });
  if (!res.ok) {
    const err = await res.text();
    console.error("[hireora:whisper:error]", err);
    return { transcript: "", provider: "openai" as const, error: err };
  }
  const data = (await res.json()) as { text?: string };
  return { transcript: data.text?.trim() || "", provider: "openai" as const };
}

export async function scoreAnswer(input: {
  jobTitle: string;
  question: string;
  focus: string;
  transcript: string;
}) {
  const key = process.env.OPENAI_API_KEY;
  if (!key || !input.transcript) {
    const lengthScore = Math.min(92, 55 + Math.floor(input.transcript.split(/\s+/).length / 4));
    return {
      score: input.transcript ? lengthScore : 40,
      feedback: input.transcript
        ? "Demo score based on answer length. Connect OPENAI_API_KEY for LLM scoring."
        : "No transcript available to score.",
      provider: "demo" as const,
    };
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You score candidate voice-screen answers for Indian hiring. Return JSON {score:0-100, feedback:string}. Be fair, concise.",
        },
        {
          role: "user",
          content: JSON.stringify({
            jobTitle: input.jobTitle,
            focus: input.focus,
            question: input.question,
            transcript: input.transcript,
          }),
        },
      ],
    }),
  });

  if (!res.ok) {
    console.error("[hireora:score:error]", await res.text());
    return { score: 50, feedback: "Scoring failed; manual review needed.", provider: "openai" as const };
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  try {
    const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}") as {
      score?: number;
      feedback?: string;
    };
    return {
      score: Math.max(0, Math.min(100, Number(parsed.score) || 50)),
      feedback: parsed.feedback || "No feedback returned.",
      provider: "openai" as const,
    };
  } catch {
    return { score: 50, feedback: "Could not parse score response.", provider: "openai" as const };
  }
}

export async function summarizeScreen(input: {
  jobTitle: string;
  answers: { question: string; transcript: string; score: number | null }[];
}) {
  const scores = input.answers.map((a) => a.score).filter((s): s is number => typeof s === "number");
  const overall = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
  const key = process.env.OPENAI_API_KEY;

  if (!key) {
    return {
      overallScore: overall,
      summary:
        overall == null
          ? "Awaiting answers."
          : `Demo overall ${overall}/100. Stronger answers scored higher on clarity and role fit. Enable OPENAI_API_KEY for narrative summary.`,
    };
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: "Write a 2-3 sentence recruiter summary of this async voice screen for an Indian hiring desk.",
        },
        {
          role: "user",
          content: JSON.stringify({ jobTitle: input.jobTitle, overall, answers: input.answers }),
        },
      ],
    }),
  });

  if (!res.ok) {
    return { overallScore: overall, summary: `Overall score ${overall ?? "n/a"}.` };
  }
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return {
    overallScore: overall,
    summary: data.choices?.[0]?.message?.content?.trim() || `Overall score ${overall ?? "n/a"}.`,
  };
}
