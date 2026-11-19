"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Briefcase, Clock, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { JobCard } from "@/components/jobs/job-card";
import { JobSearchBar } from "@/components/search/job-search-bar";
import { CompanyMark } from "@/components/jobs/company-mark";
import { EmptyState } from "@/components/dashboard/empty-state";
import { jobMatchesSearch, rankJobsForCandidate } from "@/lib/matching";
import { useDemo } from "@/lib/store";

export default function CandidateJobsPage() {
  const { jobs, recentlyViewed, session, companyById, candidateByUserId } = useDemo();
  const candidate = session ? candidateByUserId(session.id) : undefined;
  const viewedIds = (session && recentlyViewed[session.id]) || [];
  const viewed = viewedIds.map((id) => jobs.find((job) => job.id === id)).filter(Boolean);
  const [search, setSearch] = useState({ q: "", location: "", experience: "", type: "" });

  const ranked = useMemo(() => {
    const filtered = jobs.filter((job) => jobMatchesSearch(job, search));
    return rankJobsForCandidate(filtered, candidate);
  }, [jobs, search, candidate]);

  const topFit = ranked[0]?.match?.score ?? null;

  return (
    <div>
      <PageHeader
        title="Jobs for you"
        description="Roles are ranked by your profile fit after resume parse — skills, title, location and experience."
      />
      <div className="mb-8 grid gap-5 sm:grid-cols-3">
        <StatCard label="Open roles" value={ranked.length} icon={Briefcase} />
        <StatCard label="Recently viewed" value={viewed.length} icon={Clock} />
        <StatCard label="Best fit now" value={topFit != null ? `${topFit}%` : "—"} icon={Sparkles} />
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
                <Link
                  key={job.id}
                  href={`/jobs/${job.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-white py-1.5 pr-3 pl-1.5 text-sm shadow-soft hover:bg-[#f7f8fb]"
                >
                  <CompanyMark name={company?.name ?? "Co"} color={company?.logoColor ?? "#111111"} size="sm" className="ring-0" />
                  {job.title}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
      {ranked.length ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {ranked.map(({ job, match }, index) => (
            <JobCard key={job.id} job={job} featured={index === 0} matchScore={match?.score} />
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            title="No matching jobs"
            description="Clear a filter or upload a richer resume so fit ranking has more signal."
            action={
              <Link href="/candidate/profile" className="inline-flex h-10 items-center rounded-full bg-black px-4 text-sm font-medium text-white">
                Upload resume
              </Link>
            }
          />
        </div>
      )}
    </div>
  );
}
