"use client";

import { Calendar, Video } from "lucide-react";
import { DateBlock } from "@/components/dashboard/date-block";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { CompanyMark } from "@/components/jobs/company-mark";
import { BRAND } from "@/lib/constants";
import { calendarParts } from "@/lib/format";
import { btnOutline } from "@/lib/ui";
import { useDemo } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function CandidateInterviewsPage() {
  const { session, candidateByUserId, interviews, jobs, companyById } = useDemo();
  const candidate = session ? candidateByUserId(session.id) : undefined;
  const mine = interviews.filter((item) => item.candidateId === candidate?.id);
  const upcoming = mine.filter((item) => item.status !== "Cancelled");
  const featured = upcoming[0];

  return (
    <div>
      <PageHeader title="Interviews" description="Upcoming rounds, rooms and reminders in one calm calendar." />
      <div className="mb-8 grid gap-5 sm:grid-cols-2">
        <StatCard label="Scheduled" value={upcoming.length} icon={Calendar} />
        <StatCard label="Video rounds" value={mine.filter((item) => item.mode === "Video").length} icon={Video} />
      </div>
      {mine.length ? (
        <div className="space-y-5">
          {featured ? (
            <FeaturedInterview
              item={featured}
              jobTitle={jobs.find((j) => j.id === featured.jobId)?.title}
              company={companyById(featured.companyId)}
            />
          ) : null}
          <div className="grid gap-5 md:grid-cols-2">
            {mine
              .filter((item) => item.id !== featured?.id)
              .map((item) => {
                const job = jobs.find((j) => j.id === item.jobId);
                const company = companyById(item.companyId);
                const parts = calendarParts(item.scheduledAt);
                const wa = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(`Confirming interview for ${job?.title} on ${item.scheduledAt}`)}`;
                return (
                  <article key={item.id} className="rounded-[1.85rem] bg-white p-6 shadow-soft">
                    <div className="flex items-start gap-4">
                      <DateBlock iso={item.scheduledAt} />
                      <div className="min-w-0">
                        <p className="text-sm text-muted-foreground">{company?.name}</p>
                        <h2 className="font-heading text-lg font-semibold">{job?.title}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {parts.time} · {item.mode} · {item.location}
                        </p>
                        <p className="mt-2 text-sm">{item.interviewer}</p>
                        <a href={wa} className={cn(btnOutline, "mt-4 h-10 px-4")} target="_blank" rel="noreferrer">
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
          </div>
        </div>
      ) : (
        <EmptyState title="No interviews yet" description="When a recruiter schedules a round, it will appear here." />
      )}
    </div>
  );
}

function FeaturedInterview({
  item,
  jobTitle,
  company,
}: {
  item: { scheduledAt: string; mode: string; location: string; interviewer: string; jobId: string };
  jobTitle?: string;
  company?: { name: string; logoColor: string };
}) {
  const parts = calendarParts(item.scheduledAt);
  const wa = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(`Confirming interview for ${jobTitle} on ${item.scheduledAt}`)}`;
  return (
    <article className="rounded-[1.85rem] bg-black p-7 text-white shadow-lift">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="flex items-start gap-4">
          <CompanyMark name={company?.name ?? "Co"} color="#ffffff" className="ring-white/10" />
          <div>
            <p className="text-sm text-white/55">Next round</p>
            <h2 className="mt-1 font-heading text-2xl font-semibold tracking-tight">{jobTitle}</h2>
            <p className="mt-2 text-sm text-white/55">
              {parts.full} · {parts.time} · {item.mode} · {item.location}
            </p>
            <p className="mt-2 text-sm">{item.interviewer}</p>
          </div>
        </div>
        <DateBlock iso={item.scheduledAt} tone="dark" />
      </div>
      <a href={wa} target="_blank" rel="noreferrer" className="mt-7 inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-black">
        Confirm on WhatsApp
      </a>
    </article>
  );
}
