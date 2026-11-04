"use client";

import { useMemo, useState } from "react";
import { Calendar, ClipboardList, Users } from "lucide-react";
import { FilterChips } from "@/components/dashboard/filter-chips";
import { PageHeader } from "@/components/dashboard/page-header";
import { StageTrack } from "@/components/dashboard/stage-track";
import { StatCard } from "@/components/dashboard/stat-card";
import { CompanyMark } from "@/components/jobs/company-mark";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { calendarParts } from "@/lib/format";
import { useDemo } from "@/lib/store";

export default function AdminApplicationsPage() {
  const { applications, jobs, candidates, companyById } = useDemo();
  const [filter, setFilter] = useState("all");
  const visible = applications.filter((app) => filter === "all" || app.status === filter);
  const counts = useMemo(
    () => ({
      total: applications.length,
      live: applications.filter((app) => app.status !== "Rejected" && app.status !== "Selected").length,
      interviews: applications.filter((app) => app.status === "Interview Scheduled").length,
    }),
    [applications],
  );

  return (
    <div>
      <PageHeader title="Applications" description="Platform-wide movement, without opening every mandate." />
      <div className="mb-8 grid gap-5 md:grid-cols-3">
        <StatCard label="All applications" value={counts.total} icon={ClipboardList} />
        <StatCard label="In motion" value={counts.live} icon={Users} />
        <StatCard label="Interviews" value={counts.interviews} icon={Calendar} />
      </div>
      <FilterChips
        value={filter}
        onChange={setFilter}
        items={[
          { id: "all", label: "All", count: applications.length },
          ...APPLICATION_STATUSES.map((status) => ({
            id: status,
            label: status,
            count: applications.filter((app) => app.status === status).length,
          })),
        ]}
      />
      <div className="mt-7 space-y-4">
        {visible.map((app) => {
          const job = jobs.find((j) => j.id === app.jobId);
          const candidate = candidates.find((c) => c.id === app.candidateId);
          const company = job ? companyById(job.companyId) : undefined;
          return (
            <article key={app.id} className="rounded-[1.85rem] bg-white p-6 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <CompanyMark name={candidate?.name ?? "C"} color="#111111" className="ring-[#f3f4f8]" />
                  <div>
                    <p className="font-heading text-lg font-semibold">{candidate?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {job?.title} · {company?.name} · Applied {calendarParts(app.appliedAt).full}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-[#f4f5f8] px-3 py-1 text-xs font-medium">{app.status}</span>
              </div>
              <div className="mt-5">
                <StageTrack current={app.status} />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
