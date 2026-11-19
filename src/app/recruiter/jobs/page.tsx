"use client";

import Link from "next/link";
import { Briefcase, Users } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { CompanyMark } from "@/components/jobs/company-mark";
import { useDemo } from "@/lib/store";

export default function RecruiterJobsPage() {
  const { jobs, companyById, pipeline } = useDemo();
  const live = jobs.filter((job) => job.status === "active");
  return (
    <div>
      <PageHeader
        title="Assigned jobs"
        description="Active and pending mandates mapped to your recruiter account. Open a role to source, screen and move pipeline."
      />
      <div className="mb-8 grid gap-5 sm:grid-cols-2">
        <StatCard label="Live mandates" value={live.length} icon={Briefcase} />
        <StatCard label="Mapped talent" value={pipeline.length} icon={Users} />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {jobs.map((job) => {
          const company = companyById(job.companyId);
          const mapped = pipeline.filter((p) => p.jobId === job.id).length;
          return (
            <article key={job.id} className="group relative rounded-[1.85rem] bg-white p-6 shadow-soft transition hover:shadow-lift">
              <Link
                href={`/jobs/${job.slug}`}
                className="absolute inset-0 z-0 rounded-[inherit]"
                aria-label={`Open ${job.title}`}
              />
              <div className="relative z-10 pointer-events-none">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CompanyMark name={company?.name ?? "Co"} color={company?.logoColor ?? "#111111"} className="ring-[#f3f4f8]" />
                    <div>
                      <h2 className="font-heading font-semibold">{job.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {company?.name} · {job.location}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {job.status}
                  </Badge>
                </div>
                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                    <span>{mapped} candidates mapped</span>
                    <span>{job.openings} openings</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#f4f5f8]">
                    <div className="h-full rounded-full bg-black" style={{ width: `${Math.min(100, mapped * 18)}%` }} />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
