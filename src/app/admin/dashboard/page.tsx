"use client";

import { Briefcase, Building2, Trophy, Users } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { useDemo } from "@/lib/store";

const monthly = [
  { month: "Jun", registrations: 42, applications: 110 },
  { month: "Jul", registrations: 58, applications: 140 },
  { month: "Aug", registrations: 61, applications: 155 },
  { month: "Sep", registrations: 74, applications: 168 },
  { month: "Oct", registrations: 81, applications: 190 },
  { month: "Nov", registrations: 36, applications: 72 },
];

export default function AdminDashboard() {
  const { candidates, companies, jobs, applications, pipeline, leads, inquiries } = useDemo();
  const placements = pipeline.filter((p) => p.stage === "joined" || p.stage === "offered" || p.stage === "selected").length;
  return (
    <div>
      <PageHeader
        title="Platform control"
        description="Live counts across candidates, employers, pending jobs and leads — plus quick links into moderation and reports."
      />
      <div className="grid gap-6 md:grid-cols-4">
        <StatCard label="Candidates" value={candidates.length} icon={Users} />
        <StatCard label="Employers" value={companies.length} icon={Building2} tone="royal" />
        <StatCard label="Active jobs" value={jobs.filter((j) => j.status === "active").length} icon={Briefcase} />
        <StatCard label="Placements / offered" value={placements} icon={Trophy} tone="orange" />
      </div>
      <div className="mt-6 rounded-[1.85rem] bg-white p-6 shadow-soft">
        <p className="mb-4 text-sm font-medium">Monthly registrations vs applications · demo</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly}>
              <XAxis dataKey="month" tick={{ fill: "#8a8f9c", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 16, border: "none", boxShadow: "0 12px 32px rgba(17,17,17,0.08)" }}
              />
              <Bar dataKey="registrations" fill="#111111" radius={8} />
              <Bar dataKey="applications" fill="#c5c9d4" radius={8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Applications {applications.length} · Pending leads {leads.filter((l) => l.status === "New").length} · Inquiries {inquiries.length}
        </p>
      </div>
    </div>
  );
}
