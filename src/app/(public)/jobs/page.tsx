"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { JobCard } from "@/components/jobs/job-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { JobSearchBar } from "@/components/search/job-search-bar";
import { Button } from "@/components/ui/button";
import { jobMatchesSearch, rankJobsForCandidate } from "@/lib/matching";
import { useDemo } from "@/lib/store";

function JobsMarketplace() {
  const params = useSearchParams();
  const router = useRouter();
  const { jobs, session, candidateByUserId } = useDemo();
  const candidate = session?.role === "candidate" ? candidateByUserId(session.id) : undefined;
  const [filters, setFilters] = useState({
    q: params.get("q") ?? "",
    location: params.get("location") ?? "",
    experience: params.get("experience") ?? "",
    type: params.get("category") ?? "",
  });

  useEffect(() => {
    setFilters({
      q: params.get("q") ?? "",
      location: params.get("location") ?? "",
      experience: params.get("experience") ?? "",
      type: params.get("category") ?? "",
    });
  }, [params]);

  const results = useMemo(() => {
    const filtered = jobs.filter((job) => jobMatchesSearch(job, filters));
    return rankJobsForCandidate(filtered, candidate);
  }, [filters, jobs, candidate]);

  function persist(next = filters) {
    const query = new URLSearchParams();
    if (next.q) query.set("q", next.q);
    if (next.location) query.set("location", next.location);
    if (next.experience) query.set("experience", next.experience);
    if (next.type) query.set("category", next.type);
    router.replace(query.size ? `/jobs?${query.toString()}` : "/jobs");
  }

  return (
    <div className="container-shell py-10 sm:py-14">
      <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase sm:text-[12px]">Marketplace</p>
      <h1 className="mt-2 font-heading text-[2rem] font-semibold tracking-tight sm:text-5xl">Find jobs across India</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
        Search live vacancies across technology, finance, healthcare and operations.
      </p>
      <JobSearchBar
        className="mt-8 sm:mt-10"
        values={filters}
        onChange={setFilters}
        onSubmit={() => persist()}
      />
      <div className="mt-5 flex items-center justify-between gap-3 text-sm text-muted-foreground sm:mt-6">
        <p>
          {results.length} roles
          {candidate ? " · ranked by your fit" : ""}
        </p>
        <Button
          variant="ghost"
          className="h-9 shrink-0 rounded-full px-3"
          onClick={() => {
            const cleared = { q: "", location: "", experience: "", type: "" };
            setFilters(cleared);
            persist(cleared);
          }}
        >
          Clear filters
        </Button>
      </div>
      {results.length ? (
        <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {results.map(({ job, match }, index) => (
            <JobCard key={job.id} job={job} featured={index === 0 && Boolean(candidate)} matchScore={match?.score} />
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            title="No matching jobs"
            description="Try a broader title, another city, or clear the filters."
            action={
              <Button
                className="h-10 rounded-full px-4"
                onClick={() => {
                  const cleared = { q: "", location: "", experience: "", type: "" };
                  setFilters(cleared);
                  persist(cleared);
                }}
              >
                Clear filters
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="container-shell py-14 text-sm text-muted-foreground">Loading jobs…</div>}>
      <JobsMarketplace />
    </Suspense>
  );
}
