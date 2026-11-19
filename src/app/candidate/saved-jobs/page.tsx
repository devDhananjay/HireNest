"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Bell, Bookmark } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { JobCard } from "@/components/jobs/job-card";
import { btnOutline, btnPrimary } from "@/lib/ui";
import { useDemo } from "@/lib/store";

const ALERTS_KEY = "hireora.saved-job-alerts";

export default function SavedJobsPage() {
  const { session, savedJobIds, jobs } = useDemo();
  const ids = (session && savedJobIds[session.id]) || [];
  const saved = jobs.filter((job) => ids.includes(job.id));
  const [alertsOn, setAlertsOn] = useState(false);

  useEffect(() => {
    try {
      setAlertsOn(localStorage.getItem(ALERTS_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  function toggleAlerts() {
    const next = !alertsOn;
    setAlertsOn(next);
    try {
      localStorage.setItem(ALERTS_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
    toast.success(next ? "Saved-job alerts on" : "Alerts paused");
  }

  return (
    <div>
      <PageHeader
        title="Saved jobs"
        description="Roles you bookmarked while browsing. Turn on quiet alerts when similar mandates open."
      />
      <div className="mb-8 grid gap-5 sm:grid-cols-2">
        <StatCard label="Saved" value={saved.length} icon={Bookmark} />
        <button
          type="button"
          onClick={toggleAlerts}
          className="rounded-[1.85rem] bg-white p-6 text-left shadow-soft transition hover:shadow-lift"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Saved-job alerts</p>
              <p className="mt-2 font-heading text-2xl font-semibold tracking-tight">{alertsOn ? "On" : "Off"}</p>
              <p className="mt-1 text-xs text-muted-foreground">Low-volume · talent community style</p>
            </div>
            <Bell className={`size-5 ${alertsOn ? "text-foreground" : "text-muted-foreground"}`} />
          </div>
        </button>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <Link href="/talent-community" className={btnOutline}>
          Talent community
        </Link>
        <Link href="/jobs" className={btnPrimary}>
          Find more roles
        </Link>
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
          description="Bookmark roles from job cards to revisit them here — then enable alerts for similar openings."
          action={
            <>
              <Link href="/jobs" className={btnPrimary}>
                Explore jobs
              </Link>
              <Link href="/talent-community" className={btnOutline}>
                Join community
              </Link>
            </>
          }
        />
      )}
    </div>
  );
}
