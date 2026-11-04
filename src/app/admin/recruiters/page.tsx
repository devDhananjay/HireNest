"use client";

import { UserRound } from "lucide-react";
import { CompanyMark } from "@/components/jobs/company-mark";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { useDemo } from "@/lib/store";

export default function AdminRecruitersPage() {
  const { users, pipeline } = useDemo();
  const recruiters = users.filter((u) => u.role === "recruiter");
  return (
    <div>
      <PageHeader title="Recruiters" description="Performance is counted from pipeline movement in this demo." />
      <div className="mb-8 max-w-sm">
        <StatCard label="Active recruiters" value={recruiters.length} icon={UserRound} />
      </div>
      <div className="space-y-4">
        {recruiters.map((recruiter) => {
          const assigned = pipeline.filter((p) => p.recruiterId === recruiter.id).length;
          const joined = pipeline.filter((p) => p.recruiterId === recruiter.id && (p.stage === "joined" || p.stage === "offered" || p.stage === "selected")).length;
          return (
            <article key={recruiter.id} className="rounded-[1.85rem] bg-white p-6 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CompanyMark name={recruiter.name} color="#111111" className="ring-[#f3f4f8]" />
                  <div>
                    <h2 className="font-heading font-semibold">{recruiter.name}</h2>
                    <p className="text-sm text-muted-foreground">{recruiter.email}</p>
                  </div>
                </div>
                <p className="text-right text-sm">
                  <span className="font-heading text-2xl font-semibold">{assigned}</span>
                  <span className="block text-xs text-muted-foreground">assignments</span>
                </p>
              </div>
              <div className="mt-5">
                <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                  <span>{joined} offered / joined</span>
                  <span>{assigned ? Math.round((joined / assigned) * 100) : 0}% conversion</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#f4f5f8]">
                  <div className="h-full rounded-full bg-black" style={{ width: `${assigned ? Math.min(100, (joined / assigned) * 100) : 0}%` }} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
