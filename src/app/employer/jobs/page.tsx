"use client";

import Link from "next/link";
import { Briefcase, Clock, Users } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { btnPrimary } from "@/lib/ui";
import { experienceRange, salaryRange } from "@/lib/format";
import { useDemo } from "@/lib/store";

export default function EmployerJobsPage() {
  const { session, jobs, companies, applications, deleteJob, updateJob } = useDemo();
  const companyId = session?.companyId ?? companies[0]?.id;
  const mine = jobs.filter((job) => job.companyId === companyId);
  const active = mine.filter((job) => job.status === "active").length;
  const pending = mine.filter((job) => job.status === "pending").length;

  return (
    <div>
      <PageHeader
        title="Jobs"
        description="Live, pending and expired vacancies for your company."
        actions={
          <Link href="/employer/jobs/create" className={btnPrimary}>
            Create job
          </Link>
        }
      />
      <div className="mb-8 grid gap-5 sm:grid-cols-3">
        <StatCard label="Active" value={active} icon={Briefcase} />
        <StatCard label="Pending review" value={pending} icon={Clock} />
        <StatCard label="Applications" value={applications.filter((app) => mine.some((job) => job.id === app.jobId)).length} icon={Users} />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {mine.map((job, index) => {
          const apps = applications.filter((app) => app.jobId === job.id).length;
          const featured = index === 0 && job.status === "active";
          return (
            <article key={job.id} className={featured ? "rounded-[1.85rem] bg-black p-6 text-white shadow-lift" : "rounded-[1.85rem] bg-white p-6 shadow-soft"}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-heading text-xl font-semibold tracking-tight">{job.title}</h2>
                  <p className={featured ? "mt-1 text-sm text-white/55" : "mt-1 text-sm text-muted-foreground"}>
                    {job.location} · {job.workMode} · {experienceRange(job.experienceMin, job.experienceMax)}
                  </p>
                  <p className={featured ? "mt-1 text-sm text-white/55" : "mt-1 text-sm text-muted-foreground"}>{salaryRange(job.salaryMin, job.salaryMax)}</p>
                </div>
                <Badge variant={featured ? "secondary" : "outline"} className={featured ? "border-0 bg-white/12 text-white capitalize" : "capitalize"}>
                  {job.status}
                </Badge>
              </div>
              <p className={featured ? "mt-5 text-sm text-white/55" : "mt-5 text-sm text-muted-foreground"}>
                {job.openings} openings · {apps} applications
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {job.status === "active" ? (
                  <Button variant="outline" className={featured ? "rounded-full border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white" : "rounded-full"} onClick={() => updateJob(job.id, { status: "expired" })}>
                    Expire
                  </Button>
                ) : null}
                <Button variant="destructive" className="rounded-full" onClick={() => deleteJob(job.id)}>
                  Delete
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
