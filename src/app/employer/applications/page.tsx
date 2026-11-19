"use client";

import { useMemo, useState } from "react";
import { Calendar, CheckCircle2, ClipboardList, Users } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { FilterChips } from "@/components/dashboard/filter-chips";
import { PageHeader } from "@/components/dashboard/page-header";
import { StagePills } from "@/components/dashboard/stage-track";
import { StatCard } from "@/components/dashboard/stat-card";
import { CompanyMark } from "@/components/jobs/company-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { calendarParts } from "@/lib/format";
import { useDemo } from "@/lib/store";
import type { ApplicationStatus } from "@/lib/types";

export default function EmployerApplicationsPage() {
  const { session, companies, jobs, applications, candidates, updateApplicationStatus, scheduleInterview } = useDemo();
  const companyId = session?.companyId ?? companies[0]?.id;
  const mine = applications.filter((app) => jobs.find((job) => job.id === app.jobId)?.companyId === companyId);
  const [when, setWhen] = useState("2026-11-12T11:00");
  const [filter, setFilter] = useState("all");

  const counts = useMemo(
    () => ({
      total: mine.length,
      review: mine.filter((app) => app.status === "Under Review" || app.status === "Applied").length,
      interview: mine.filter((app) => app.status === "Interview Scheduled" || app.status === "Shortlisted").length,
      hired: mine.filter((app) => app.status === "Selected").length,
    }),
    [mine],
  );

  const visible = mine.filter((app) => filter === "all" || app.status === filter);

  return (
    <div>
      <PageHeader title="Applications" description="Move people through review, interviews and decisions without the noise." />
      <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Inbox" value={counts.total} icon={ClipboardList} />
        <StatCard label="To review" value={counts.review} icon={Users} />
        <StatCard label="In interview" value={counts.interview} icon={Calendar} />
        <StatCard label="Selected" value={counts.hired} icon={CheckCircle2} />
      </div>
      <FilterChips
        value={filter}
        onChange={setFilter}
        items={[
          { id: "all", label: "All", count: counts.total },
          ...APPLICATION_STATUSES.map((status) => ({
            id: status,
            label: status,
            count: mine.filter((app) => app.status === status).length,
          })),
        ]}
      />
      {visible.length ? (
      <div className="mt-7 space-y-5">
        {visible.map((app) => {
          const job = jobs.find((j) => j.id === app.jobId);
          const candidate = candidates.find((c) => c.id === app.candidateId);
          return (
            <article key={app.id} className="rounded-[1.85rem] bg-white p-6 shadow-soft sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <CompanyMark name={candidate?.name ?? "C"} color="#111111" className="ring-[#f3f4f8]" />
                  <div>
                    <h2 className="font-heading text-xl font-semibold tracking-tight">{candidate?.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {job?.title} · {candidate?.location} · {candidate?.currentTitle}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Applied {calendarParts(app.appliedAt).full} · {candidate?.resumeName}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {candidate?.skills.slice(0, 5).map((skill) => (
                  <span key={skill} className="rounded-full bg-[#f4f5f8] px-3 py-1 text-xs text-muted-foreground">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="mt-5 overflow-x-auto">
                <StagePills current={app.status} onSelect={(status: ApplicationStatus) => updateApplicationStatus(app.id, status)} />
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2 rounded-[1.35rem] bg-[#f7f8fb] p-3">
                <Input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} className="h-11 w-auto bg-white" />
                <Button
                  className="h-11 rounded-full"
                  onClick={() =>
                    scheduleInterview({
                      applicationId: app.id,
                      jobId: app.jobId,
                      candidateId: app.candidateId,
                      companyId: companyId,
                      scheduledAt: new Date(when).toISOString(),
                      mode: "Video",
                      location: "Google Meet",
                      interviewer: session?.name ?? "Hiring manager",
                    })
                  }
                >
                  Schedule interview
                </Button>
                {candidate?.resumeUrl ? (
                  <a
                    className="inline-flex h-11 items-center rounded-full bg-white px-4 text-sm shadow-soft"
                    href={candidate.resumeUrl}
                    download={candidate.resumeName || "resume"}
                  >
                    Download resume
                  </a>
                ) : (
                  <span className="inline-flex h-11 items-center rounded-full bg-white/70 px-4 text-sm text-muted-foreground shadow-soft">
                    {candidate?.resumeName ? `${candidate.resumeName} · re-upload for download` : "No resume on file"}
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
      ) : (
        <div className="mt-7">
          <EmptyState title="No applications in this view" description="New applicants will land here as soon as they apply." />
        </div>
      )}
    </div>
  );
}
