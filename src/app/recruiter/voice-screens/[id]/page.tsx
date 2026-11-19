"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";

type ScreenDetail = {
  id: string;
  status: string;
  overallScore: number | null;
  summary: string | null;
  questions: { prompt: string; focus: string }[];
  job: { title: string; company: { name: string } };
  candidate: { user: { name: string; email: string }; phone: string };
  answers: {
    questionIndex: number;
    question: string;
    transcript: string;
    score: number | null;
    feedback: string | null;
  }[];
};

export default function RecruiterVoiceScreenDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [screen, setScreen] = useState<ScreenDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/voice-screens/${id}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
        setScreen(data.screen);
      })
      .catch((err: Error) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <EmptyState
        title="Could not load screen"
        description={error}
        action={
          <Link href="/recruiter/voice-screens" className="text-sm font-medium hover:underline">
            Back
          </Link>
        }
      />
    );
  }

  if (!screen) {
    return <p className="text-sm text-muted-foreground">Loading voice screen…</p>;
  }

  return (
    <div>
      <Link href="/recruiter/voice-screens" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> All voice screens
      </Link>
      <PageHeader
        title={screen.job.title}
        description={`${screen.candidate.user.name} · ${screen.job.company.name} · ${screen.status}${screen.overallScore != null ? ` · ${screen.overallScore}/100` : ""}`}
      />
      {screen.summary ? (
        <div className="mb-6 rounded-[1.85rem] bg-black p-6 text-white shadow-lift">
          <p className="text-[11px] tracking-[0.16em] text-white/45 uppercase">AI summary</p>
          <p className="mt-2 text-sm leading-7 text-white/80">{screen.summary}</p>
        </div>
      ) : null}
      <div className="space-y-4">
        {(screen.questions || []).map((question, index) => {
          const answer = screen.answers.find((item) => item.questionIndex === index);
          return (
            <article key={index} className="rounded-[1.85rem] bg-white p-6 shadow-soft">
              <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
                Q{index + 1} · {question.focus}
              </p>
              <h2 className="mt-2 font-heading text-lg font-semibold">{question.prompt}</h2>
              {answer ? (
                <div className="mt-4 space-y-2 text-sm leading-7 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Score:</strong> {answer.score ?? "—"}
                  </p>
                  <p>
                    <strong className="text-foreground">Transcript:</strong> {answer.transcript || "—"}
                  </p>
                  <p>
                    <strong className="text-foreground">Feedback:</strong> {answer.feedback || "—"}
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">Awaiting candidate answer.</p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
