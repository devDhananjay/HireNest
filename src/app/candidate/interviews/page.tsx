"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Calendar, Video } from "lucide-react";
import { DateBlock } from "@/components/dashboard/date-block";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { CompanyMark } from "@/components/jobs/company-mark";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/constants";
import { calendarParts } from "@/lib/format";
import { btnOutline } from "@/lib/ui";
import { useDemo } from "@/lib/store";
import type { InterviewSlot } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function CandidateInterviewsPage() {
  const { session, candidateByUserId, interviews, jobs, companyById, refresh } = useDemo();
  const candidate = session ? candidateByUserId(session.id) : undefined;
  const mine = interviews.filter((item) => item.candidateId === candidate?.id);
  const upcoming = mine.filter((item) => item.status !== "Cancelled");
  const featured = upcoming[0];
  const [slots, setSlots] = useState<(InterviewSlot & { job?: { title?: string } })[]>([]);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const loadSlots = useCallback(async () => {
    const res = await fetch("/api/interview-slots?mine=1", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    setSlots(
      (data.slots ?? []).map(
        (slot: {
          id: string;
          jobId: string;
          companyId: string;
          applicationId?: string | null;
          candidateId?: string | null;
          startsAt: string;
          endsAt: string;
          mode: string;
          location: string;
          interviewer: string;
          status: string;
          job?: { title?: string };
        }) => ({
          ...slot,
          startsAt: new Date(slot.startsAt).toISOString(),
          endsAt: new Date(slot.endsAt).toISOString(),
          jobTitle: slot.job?.title,
        }),
      ),
    );
  }, []);

  useEffect(() => {
    void loadSlots();
  }, [loadSlots]);

  async function bookSlot(id: string) {
    setBookingId(id);
    try {
      const res = await fetch(`/api/interview-slots/${id}/book`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Booking failed");
      toast.success("Interview booked");
      await refresh();
      await loadSlots();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Booking failed");
    } finally {
      setBookingId(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="Interviews"
        description="Upcoming rounds, offered self-book slots, and reminders in one calm calendar."
      />
      <div className="mb-8 grid gap-5 sm:grid-cols-2">
        <StatCard label="Scheduled" value={upcoming.length} icon={Calendar} />
        <StatCard label="Open slots" value={slots.length} icon={Video} />
      </div>

      {slots.length ? (
        <section className="mb-8">
          <h2 className="font-heading text-lg font-semibold">Book an offered slot</h2>
          <p className="mt-1 text-sm text-muted-foreground">Employers can offer times — pick one that works for you.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {slots.map((slot) => {
              const company = companyById(slot.companyId);
              const parts = calendarParts(slot.startsAt);
              return (
                <article key={slot.id} className="rounded-[1.85rem] bg-white p-5 shadow-soft">
                  <p className="text-sm text-muted-foreground">{company?.name}</p>
                  <h3 className="font-heading text-lg font-semibold">{slot.jobTitle || "Interview slot"}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {parts.full} · {slot.mode} · {slot.location}
                  </p>
                  <Button
                    className="mt-4 h-10 rounded-full"
                    disabled={bookingId === slot.id}
                    onClick={() => void bookSlot(slot.id)}
                  >
                    {bookingId === slot.id ? "Booking…" : "Book this slot"}
                  </Button>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

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
        <EmptyState
          title="No interviews yet"
          description="When a recruiter schedules a round or offers a slot, it will appear here. Keep your profile and resume current so slots come faster."
          action={
            <Link href="/candidate/profile" className="inline-flex h-10 items-center rounded-full bg-black px-4 text-sm font-medium text-white">
              Update profile
            </Link>
          }
        />
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
      <a
        href={wa}
        target="_blank"
        rel="noreferrer"
        className="mt-7 inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-black"
      >
        Confirm on WhatsApp
      </a>
    </article>
  );
}
