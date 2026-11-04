"use client";

import { Briefcase, Clock } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CompanyMark } from "@/components/jobs/company-mark";
import { useDemo } from "@/lib/store";

export default function AdminJobsPage() {
  const { jobs, companyById, approveJob } = useDemo();
  const pending = jobs.filter((job) => job.status === "pending").length;
  return (
    <div>
      <PageHeader title="Jobs moderation" description="Approve or reject employer vacancies before they go live." />
      <div className="mb-8 grid gap-5 sm:grid-cols-2">
        <StatCard label="All jobs" value={jobs.length} icon={Briefcase} />
        <StatCard label="Pending" value={pending} icon={Clock} />
      </div>
      <div className="space-y-4">
        {jobs.map((job) => {
          const company = companyById(job.companyId);
          return (
            <article key={job.id} className="flex flex-wrap items-center justify-between gap-4 rounded-[1.85rem] bg-white p-6 shadow-soft">
              <div className="flex items-center gap-4">
                <CompanyMark name={company?.name ?? "Co"} color={company?.logoColor ?? "#111111"} className="ring-[#f3f4f8]" />
                <div>
                  <h2 className="font-heading font-semibold">{job.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {company?.name} · {job.location} · {job.openings} openings
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {job.status}
                </Badge>
                <Button size="sm" className="rounded-full" onClick={() => approveJob(job.id, true)}>
                  Approve
                </Button>
                <Button size="sm" variant="destructive" className="rounded-full" onClick={() => approveJob(job.id, false)}>
                  Reject
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
