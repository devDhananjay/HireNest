"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AudioLines } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatCard } from "@/components/dashboard/stat-card";

type ScreenRow = {
  id: string;
  status: string;
  overallScore: number | null;
  job: { title: string; company: { name: string } };
};

export default function CandidateVoiceScreensPage() {
  const [screens, setScreens] = useState<ScreenRow[]>([]);

  useEffect(() => {
    fetch("/api/voice-screens")
      .then((res) => res.json())
      .then((data) => setScreens(data.screens ?? []))
      .catch(() => setScreens([]));
  }, []);

  const pending = screens.filter((s) => s.status === "pending" || s.status === "in_progress").length;

  return (
    <div>
      <PageHeader
        title="Voice screens"
        description="Complete async AI screening interviews from your browser — no live call required."
      />
      <div className="mb-8 grid gap-5 sm:grid-cols-2">
        <StatCard label="Invites" value={screens.length} icon={AudioLines} />
        <StatCard label="Pending" value={pending} icon={AudioLines} />
      </div>
      {screens.length ? (
        <div className="space-y-4">
          {screens.map((screen) => (
            <Link
              key={screen.id}
              href={`/candidate/voice-screens/${screen.id}`}
              className="block rounded-[1.85rem] bg-white p-6 shadow-soft transition hover:shadow-lift"
            >
              <p className="text-sm text-muted-foreground">{screen.job.company.name}</p>
              <h2 className="font-heading text-xl font-semibold">{screen.job.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {screen.status}
                {screen.overallScore != null ? ` · score ${screen.overallScore}` : ""}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No voice screens"
          description="When a recruiter invites you, the session will appear here. Keep applying and update your CV so invites arrive faster."
          action={
            <>
              <Link
                href="/candidate/jobs"
                className="inline-flex h-10 items-center rounded-full bg-black px-4 text-sm font-medium text-white"
              >
                Browse matched jobs
              </Link>
              <Link
                href="/candidate/profile"
                className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm font-medium"
              >
                Upload CV
              </Link>
            </>
          }
        />
      )}
    </div>
  );
}
