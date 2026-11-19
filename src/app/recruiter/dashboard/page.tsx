"use client";

import Link from "next/link";
import { Briefcase, KanbanSquare, Users, Trophy } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { PIPELINE_STAGES } from "@/lib/constants";
import { useDemo } from "@/lib/store";

export default function RecruiterDashboard() {
  const { candidates, pipeline, jobs, leads } = useDemo();
  return (
    <div>
      <PageHeader
        title="Recruiter workspace"
        description="Track clients, pipeline stages and interview rounds for every mandate you own — with notes and duplicate flags in one CRM."
      />
      <div className="grid gap-6 md:grid-cols-4">
        <StatCard label="Candidates" value={candidates.length} icon={Users} />
        <StatCard label="Pipeline" value={pipeline.length} icon={KanbanSquare} tone="royal" />
        <StatCard label="Live jobs" value={jobs.filter((j) => j.status === "active").length} icon={Briefcase} />
        <StatCard label="Open leads" value={leads.filter((l) => l.status !== "Closed").length} icon={Trophy} tone="orange" />
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {PIPELINE_STAGES.slice(0, 4).map((stage) => {
          const count = pipeline.filter((item) => item.stage === stage.id).length;
          return (
            <Link key={stage.id} href="/recruiter/pipeline" className="hover-lift rounded-[1.85rem] bg-white p-5 shadow-soft">
              <p className="text-sm text-muted-foreground">{stage.label}</p>
              <p className="mt-2 font-heading text-3xl font-semibold">{count}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
