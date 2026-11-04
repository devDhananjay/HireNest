"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Briefcase, Clock } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { JobCard } from "@/components/jobs/job-card";
import { JobSearchBar } from "@/components/search/job-search-bar";
import { CompanyMark } from "@/components/jobs/company-mark";
import { EmptyState } from "@/components/dashboard/empty-state";
import { jobMatchesSearch } from "@/lib/matching";
import { useDemo } from "@/lib/store";

export default function CandidateJobsPage() {
  const { jobs, recentlyViewed, session, companyById } = useDemo();
  const viewedIds = (session && recentlyViewed[session.id]) || [];
  const viewed = viewedIds.map((id) => jobs.find((job) => job.id === id)).filter(Boolean);
  const [search, setSearch] = useState({ q: "", location: "", experience: "", type: "" });
  const active = useMemo(() => jobs.filter((job) => jobMatchesSearch(job, search)), [jobs, search]);

  return (
    <div>
      <PageHeader title="Jobs for you" description="Recently viewed roles stay on this device. Search the full marketplace from here." />
      <div className="mb-8 grid gap-5 sm:grid-cols-2">
        <StatCard label="Open roles" value={active.length} icon={Briefcase} />
        <StatCard label="Recently viewed" value={viewed.length} icon={Clock} />
      </div>
      <JobSearchBar values={search} onChange={setSearch} onSubmit={() => undefined} />
      {viewed.length ? (
        <div className="mt-8">
          <p className="mb-3 text-sm font-medium">Recently viewed</p>
          <div className="flex flex-wrap gap-2">
            {viewed.slice(0, 6).map((job) => {
              if (!job) return null;
              const company = companyById(job.companyId);
              return (
                <Link key={job.id} href={`/jobs/${job.slug}`} className="inline-flex items-center gap-2 rounded-full bg-white py-1.5 pr-3 pl-1.5 text-sm shadow-soft hover:bg-[#f7f8fb]">
                  <CompanyMark name={company?.name ?? "Co"} color={company?.logoColor ?? "#111111"} size="sm" className="ring-0" />
                  {job.title}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
      {active.length ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {active.map((job, index) => (
            <JobCard key={job.id} job={job} featured={index === 1} />
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState title="No matching jobs" description="Clear a filter or try another title." />
        </div>
      )}
    </div>
  );
}
