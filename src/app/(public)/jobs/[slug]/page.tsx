"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { MapPin, Share2 } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { CompanyMark } from "@/components/jobs/company-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { experienceRange, salaryRange, timeAgo } from "@/lib/format";
import { matchCandidateToJob, resumeScore } from "@/lib/matching";
import { btnPrimary } from "@/lib/ui";
import { useDemo } from "@/lib/store";
import { BRAND } from "@/lib/constants";

export default function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { jobBySlug, companyById, applyToJob, toggleSaveJob, markJobViewed, session, candidateByUserId, savedJobIds, applications } =
    useDemo();
  const job = jobBySlug(slug);
  const company = job ? companyById(job.companyId) : undefined;
  const candidate = session?.role === "candidate" ? candidateByUserId(session.id) : undefined;

  useEffect(() => {
    if (job) markJobViewed(job.id);
    // Intentionally only when the vacancy changes — markJobViewed identity follows store state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job?.id]);

  if (!job) {
    return (
      <div className="container-shell py-20">
        <EmptyState
          title="Job not found"
          description="That vacancy is no longer listed, or the link is outdated."
          action={
            <Link href="/jobs" className={btnPrimary}>
              Browse jobs
            </Link>
          }
        />
      </div>
    );
  }

  const match = candidate ? matchCandidateToJob(candidate, job) : null;
  const score = candidate ? resumeScore(candidate, job) : null;
  const applied = Boolean(candidate && applications.some((app) => app.candidateId === candidate.id && app.jobId === job.id));
  const open = job.status === "active";
  const wa = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(`Hi HIREORA, I am interested in ${job.title} at ${company?.name}.`)}`;

  return (
    <div className="container-shell grid gap-8 py-12 lg:grid-cols-[1fr_320px]">
      <article className="rounded-[2rem] bg-white p-8 shadow-soft">
        <div className="flex items-start gap-4">
          <CompanyMark name={company?.name ?? "Co"} color={company?.logoColor ?? "#111111"} size="lg" />
          <div>
            <p className="text-sm text-muted-foreground">
              {company ? (
                <Link href={`/companies/${company.slug}`} className="hover:underline">
                  {company.name}
                </Link>
              ) : (
                "Company"
              )}
            </p>
            <h1 className="font-heading text-3xl font-semibold sm:text-4xl">{job.title}</h1>
            <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-4" /> {job.location}
              </span>
              <span>{salaryRange(job.salaryMin, job.salaryMax)}</span>
              <span>{experienceRange(job.experienceMin, job.experienceMax)}</span>
              <span>Posted {timeAgo(job.postedAt)}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="outline">{job.employmentType}</Badge>
              <Badge variant="outline">{job.workMode}</Badge>
              <Badge variant="outline">{job.department}</Badge>
            </div>
          </div>
        </div>
        <p className="mt-8 text-base leading-7">{job.description}</p>
        <h2 className="mt-8 font-heading text-xl font-semibold">Responsibilities</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6">
          {job.responsibilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h2 className="mt-8 font-heading text-xl font-semibold">Requirements</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6">
          {job.requirements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </article>
      <aside className="space-y-4">
        <div className="rounded-[1.85rem] bg-white p-5 shadow-soft">
          <Button className="h-12 w-full rounded-full" disabled={!open || applied} onClick={() => applyToJob(job.id)}>
            {!open ? "Role closed" : applied ? "Applied" : "Apply now"}
          </Button>
          <Button variant="outline" className="mt-2 h-11 w-full rounded-full" onClick={() => toggleSaveJob(job.id)}>
            {session && (savedJobIds[session.id] ?? []).includes(job.id) ? "Saved" : "Save job"}
          </Button>
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#f4f5f8] text-sm"
          >
            WhatsApp a recruiter
          </a>
          <button
            type="button"
            className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm text-muted-foreground"
            onClick={() => {
              void navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied");
            }}
          >
            <Share2 className="size-4" /> Copy link
          </button>
        </div>
        {score ? (
          <div className="rounded-[1.85rem] bg-white p-5 shadow-soft">
            <p className="text-sm text-muted-foreground">Live fit model</p>
            <p className="mt-1 font-heading text-4xl font-semibold">{score.score}</p>
            <p className="mt-3 text-sm">
              Hire probability <strong>{match?.hireProbability ?? score.hireProbability}%</strong>
              <span className="text-muted-foreground"> · confidence {match?.confidence ?? score.confidence}</span>
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{score.disclaimer}</p>
            <div className="mt-4 space-y-3">
              {match?.factors.map((factor) => (
                <div key={factor.label} className="text-sm">
                  <div className="flex justify-between">
                    <span>{factor.label}</span>
                    <span className="font-medium">{factor.score}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{factor.detail}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-[1.85rem] bg-white p-5 text-sm leading-6 text-muted-foreground shadow-soft">
            Sign in as a candidate to see a transparent match breakdown.
          </div>
        )}
      </aside>
    </div>
  );
}
