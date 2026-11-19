"use client";

import Link from "next/link";
import { Calendar, Video } from "lucide-react";
import { DateBlock } from "@/components/dashboard/date-block";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { CompanyMark } from "@/components/jobs/company-mark";
import { calendarParts } from "@/lib/format";
import { useDemo } from "@/lib/store";

export default function RecruiterInterviewsPage() {
  const { interviews, candidates, jobs, companyById } = useDemo();
  return (
    <div>
      <PageHeader title="Interview calendar" description="Upcoming rounds across assigned mandates." />
      <div className="mb-8 grid gap-5 sm:grid-cols-2">
        <StatCard label="This week" value={interviews.length} icon={Calendar} />
        <StatCard label="Video" value={interviews.filter((item) => item.mode === "Video").length} icon={Video} />
      </div>
      {interviews.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {interviews.map((item, index) => {
            const job = jobs.find((j) => j.id === item.jobId);
            const candidate = candidates.find((c) => c.id === item.candidateId);
            const company = companyById(item.companyId);
            const parts = calendarParts(item.scheduledAt);
            const featured = index === 0;
            return (
              <article
                key={item.id}
                className={featured ? "rounded-[1.85rem] bg-black p-6 text-white shadow-lift md:col-span-2 md:flex md:items-start md:justify-between md:gap-6 md:p-7" : "rounded-[1.85rem] bg-white p-6 shadow-soft"}
              >
                <div className="flex items-start gap-4">
                  {featured ? (
                    <CompanyMark name={candidate?.name ?? "C"} color="#ffffff" className="ring-white/10" />
                  ) : (
                    <DateBlock iso={item.scheduledAt} />
                  )}
                  <div>
                    <p className={featured ? "text-sm text-white/55" : "text-sm text-muted-foreground"}>{company?.name}</p>
                    <h2 className="font-heading text-lg font-semibold">{job?.title}</h2>
                    <p className={featured ? "mt-1 text-sm text-white/55" : "mt-1 text-sm text-muted-foreground"}>
                      {candidate?.name} · {parts.time} · {item.mode}
                    </p>
                    <p className="mt-2 text-sm">
                      {item.location} · {item.interviewer}
                    </p>
                  </div>
                </div>
                {featured ? <DateBlock iso={item.scheduledAt} tone="dark" /> : null}
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No interviews scheduled"
          description="Book a round from the pipeline, or offer a self-serve slot from an application."
          action={
            <>
              <Link
                href="/recruiter/pipeline"
                className="inline-flex h-10 items-center rounded-full bg-black px-4 text-sm font-medium text-white"
              >
                Open pipeline
              </Link>
              <Link
                href="/recruiter/candidates"
                className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm font-medium"
              >
                Review candidates
              </Link>
            </>
          }
        />
      )}
    </div>
  );
}
