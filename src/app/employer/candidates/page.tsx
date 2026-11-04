"use client";

import { useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { CompanyMark } from "@/components/jobs/company-mark";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { LOCATIONS } from "@/lib/constants";
import { matchCandidateToJob } from "@/lib/matching";
import { useDemo } from "@/lib/store";

export default function EmployerCandidatesPage() {
  const { candidates, jobs, session, companies } = useDemo();
  const companyId = session?.companyId ?? companies[0]?.id;
  const myJobs = jobs.filter((job) => job.companyId === companyId && job.status === "active");
  const [filters, setFilters] = useState({ skill: "", location: "", minExp: "" });
  const filtered = useMemo(
    () =>
      candidates.filter((candidate) => {
        if (filters.skill && !candidate.skills.join(" ").toLowerCase().includes(filters.skill.toLowerCase())) return false;
        if (filters.location && candidate.location !== filters.location) return false;
        if (filters.minExp) {
          const years = candidate.experience.length * 2.5;
          if (years < Number(filters.minExp)) return false;
        }
        return true;
      }),
    [candidates, filters],
  );

  return (
    <div>
      <PageHeader title="Candidate search" description="Only authorised resume metadata is shown in this demo." />
      <div className="mb-8 max-w-sm">
        <StatCard label="Visible talent" value={filtered.length} icon={Users} />
      </div>
      <div className="mb-7 grid gap-3 rounded-[1.85rem] bg-white p-3 shadow-soft md:grid-cols-[1fr_1fr_1fr_auto]">
        <Input placeholder="Skill" value={filters.skill} onChange={(e) => setFilters({ ...filters, skill: e.target.value })} className="bg-[#f7f8fb]" />
        <NativeSelect value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })}>
          <option value="">Location</option>
          {LOCATIONS.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </NativeSelect>
        <Input placeholder="Min experience" value={filters.minExp} onChange={(e) => setFilters({ ...filters, minExp: e.target.value })} className="bg-[#f7f8fb]" />
        <span className="hidden items-center justify-center rounded-full bg-[#f4f5f8] px-4 text-sm text-muted-foreground md:inline-flex">
          <Search className="mr-2 size-4" /> Filter
        </span>
      </div>
      {filtered.length ? (
      <div className="grid gap-5 md:grid-cols-2">
        {filtered.map((candidate) => {
          const best = myJobs
            .map((job) => ({ job, score: matchCandidateToJob(candidate, job).score }))
            .sort((a, b) => b.score - a.score)[0];
          return (
            <article key={candidate.id} className="rounded-[1.85rem] bg-white p-6 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CompanyMark name={candidate.name} color="#111111" className="ring-[#f3f4f8]" />
                  <div>
                    <h2 className="font-heading font-semibold">{candidate.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {candidate.currentTitle} · {candidate.location}
                    </p>
                  </div>
                </div>
                {best ? (
                  <div className="text-right">
                    <p className="font-heading text-2xl font-semibold">{best.score}%</p>
                    <p className="text-[11px] text-muted-foreground">vs {best.job.title}</p>
                  </div>
                ) : null}
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {candidate.skills.slice(0, 5).map((skill) => (
                  <span key={skill} className="rounded-full bg-[#f4f5f8] px-3 py-1 text-xs text-muted-foreground">
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>
      ) : (
        <EmptyState title="No candidates match" description="Try another skill, city, or lower the experience filter." />
      )}
    </div>
  );
}
