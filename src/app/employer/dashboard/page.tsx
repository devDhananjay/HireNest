"use client";

import Link from "next/link";
import { Briefcase, Users, Calendar, LineChart } from "lucide-react";
import { CompanyMark } from "@/components/jobs/company-mark";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { btnPrimary } from "@/lib/ui";
import { useDemo } from "@/lib/store";

export default function EmployerDashboard() {
  const { session, jobs, applications, interviews, companies, candidates } = useDemo();
  const companyId = session?.companyId ?? companies[0]?.id;
  const mine = jobs.filter((job) => job.companyId === companyId);
  const apps = applications.filter((app) => mine.some((job) => job.id === app.jobId));
  return (
    <div>
      <PageHeader
        title="Hiring desk"
        description="Post roles, review applicants and request a recruiter when you need support."
        actions={
          <Link href="/employer/jobs/create" className={btnPrimary}>
            Post a job
          </Link>
        }
      />
      <div className="grid gap-6 md:grid-cols-4">
        <StatCard label="Active jobs" value={mine.filter((j) => j.status === "active").length} icon={Briefcase} />
        <StatCard label="Applications" value={apps.length} icon={Users} tone="royal" />
        <StatCard label="Interviews" value={interviews.filter((i) => i.companyId === companyId).length} icon={Calendar} tone="orange" />
        <StatCard label="Pending approval" value={mine.filter((j) => j.status === "pending").length} icon={LineChart} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[1.85rem] bg-white p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">Live roles</h2>
            <Link href="/employer/jobs" className="text-sm text-muted-foreground hover:text-foreground">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {mine.slice(0, 4).map((job) => (
              <div key={job.id} className="flex items-center justify-between rounded-2xl bg-[#f7f8fb] px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{job.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {job.location} · {job.openings} openings
                  </p>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {job.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[1.85rem] bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">Recent applicants</h2>
            <Link href="/employer/applications" className="text-sm text-muted-foreground hover:text-foreground">
              Pipeline
            </Link>
          </div>
          <div className="space-y-3">
            {apps.slice(0, 4).map((app) => {
              const candidate = candidates.find((item) => item.id === app.candidateId);
              const job = jobs.find((item) => item.id === app.jobId);
              return (
                <div key={app.id} className="flex items-center gap-3 rounded-2xl bg-[#f7f8fb] px-4 py-3">
                  <CompanyMark name={candidate?.name ?? "C"} color="#111111" size="sm" className="ring-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{candidate?.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{job?.title}</p>
                  </div>
                  <Badge variant="outline">{app.status}</Badge>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
