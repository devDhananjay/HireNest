"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { JobCard } from "@/components/jobs/job-card";
import { btnPrimary } from "@/lib/ui";
import { useDemo } from "@/lib/store";

export default function SavedJobsPage() {
  const { session, savedJobIds, jobs } = useDemo();
  const ids = (session && savedJobIds[session.id]) || [];
  const saved = jobs.filter((job) => ids.includes(job.id));
  return (
    <div>
      <PageHeader title="Saved jobs" description="Bookmarks live in this browser until you apply or remove them." />
      <div className="mb-8 max-w-sm">
        <StatCard label="Saved" value={saved.length} icon={Bookmark} />
      </div>
      {saved.length ? (
        <div className="grid gap-6 md:grid-cols-2">
          {saved.map((job, index) => (
            <JobCard key={job.id} job={job} featured={index === 0} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nothing saved"
          description="Bookmark roles from job cards to revisit them here."
          action={
            <Link href="/jobs" className={btnPrimary}>
              Explore jobs
            </Link>
          }
        />
      )}
    </div>
  );
}
