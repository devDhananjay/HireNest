"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, CheckCircle2, ClipboardList, Search } from "lucide-react";
import { FilterChips } from "@/components/dashboard/filter-chips";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StageTrack } from "@/components/dashboard/stage-track";
import { StatCard } from "@/components/dashboard/stat-card";
import { CompanyMark } from "@/components/jobs/company-mark";
import { APPLICATION_STATUSES, BRAND } from "@/lib/constants";
import { calendarParts, salaryRange } from "@/lib/format";
import { btnOutline, btnPrimary } from "@/lib/ui";
import { useDemo } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/lib/types";

export default function CandidateApplicationsPage() {
  const { session, candidateByUserId, applications, jobs, companyById } = useDemo();
  const candidate = session ? candidateByUserId(session.id) : undefined;
  const mine = applications.filter((app) => app.candidateId === candidate?.id);
  const [filter, setFilter] = useState("all");

  const counts = useMemo(() => {
    const byStatus = Object.fromEntries(APPLICATION_STATUSES.map((status) => [status, mine.filter((app) => app.status === status).length]));
    return {
      total: mine.length,
      review: mine.filter((app) => app.status === "Under Review" || app.status === "Shortlisted").length,
      interview: mine.filter((app) => app.status === "Interview Scheduled").length,
      selected: mine.filter((app) => app.status === "Selected").length,
      byStatus,
    };
  }, [mine]);

  const visible = mine.filter((app) => filter === "all" || app.status === filter);
  const featuredId = visible.find((app) => app.status === "Interview Scheduled" || app.status === "Shortlisted")?.id;

  return (
    <div>
      <PageHeader title="Applications" description="Track every stage from applied to selected — quietly, in one place." />
      <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Submitted" value={counts.total} icon={ClipboardList} />
        <StatCard label="In review" value={counts.review} icon={Search} />
        <StatCard label="Interviews" value={counts.interview} icon={Calendar} />
        <StatCard label="Offers" value={counts.selected} icon={CheckCircle2} />
      </div>
      <FilterChips
        value={filter}
        onChange={setFilter}
        items={[
          { id: "all", label: "All", count: counts.total },
          ...APPLICATION_STATUSES.map((status) => ({ id: status, label: status, count: counts.byStatus[status] ?? 0 })),
        ]}
      />
      {visible.length ? (
        <div className="mt-7 space-y-5">
          {visible.map((app) => {
            const job = jobs.find((item) => item.id === app.jobId);
            const company = job ? companyById(job.companyId) : undefined;
            const featured = app.id === featuredId;
            const applied = calendarParts(app.appliedAt);
            const wa = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(`Hi HIREORA, following up on ${job?.title} at ${company?.name}.`)}`;
            return (
              <article
                key={app.id}
                className={cn("rounded-[1.85rem] p-6 shadow-soft sm:p-7", featured ? "bg-black text-white shadow-lift" : "bg-white")}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <CompanyMark
                      name={company?.name ?? "Co"}
                      color={featured ? "#ffffff" : company?.logoColor ?? "#111111"}
                      className={featured ? "ring-white/10" : "ring-[#f3f4f8]"}
                    />
                    <div>
                      <p className={cn("text-sm font-medium", featured ? "text-white" : "text-foreground")}>{company?.name}</p>
                      <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-[1.45rem]">{job?.title}</h2>
                      <p className={cn("mt-1 text-sm", featured ? "text-white/55" : "text-muted-foreground")}>
                        {job?.location} · {job ? salaryRange(job.salaryMin, job.salaryMax) : ""} · Applied {applied.full}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      featured ? "bg-white/12 text-white" : app.status === "Rejected" ? "bg-destructive/10 text-destructive" : "bg-[#f4f5f8] text-foreground",
                    )}
                  >
                    {app.status}
                  </span>
                </div>
                <div className="mt-6">
                  <StageTrack current={app.status as ApplicationStatus} tone={featured ? "dark" : "light"} />
                </div>
                <ol className={cn("mt-6 space-y-3 border-l pl-5", featured ? "border-white/12" : "border-[#eef0f5]")}>
                  {app.timeline.slice(-3).map((event, index) => (
                    <li key={index} className="text-sm">
                      <p className="font-medium">{event.status}</p>
                      <p className={cn("text-xs", featured ? "text-white/45" : "text-muted-foreground")}>
                        {calendarParts(event.at).full} · {event.note}
                      </p>
                    </li>
                  ))}
                </ol>
                <div className="mt-6 flex flex-wrap gap-2">
                  {job ? (
                    <Link href={`/jobs/${job.slug}`} className={cn(featured ? "inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-black" : btnPrimary)}>
                      View role
                    </Link>
                  ) : null}
                  <a href={wa} target="_blank" rel="noreferrer" className={cn(btnOutline, featured && "border-0 bg-white/10 text-white shadow-none hover:bg-white/15")}>
                    Message recruiter
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-7">
          <EmptyState
            title={filter === "all" ? "No applications yet" : "Nothing in this stage"}
            description="Apply from a job page and the timeline will live here."
            action={
              <Link href="/jobs" className={btnPrimary}>
                Browse jobs
              </Link>
            }
          />
        </div>
      )}
    </div>
  );
}
