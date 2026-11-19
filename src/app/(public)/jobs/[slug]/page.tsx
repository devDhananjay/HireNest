"use client";

import { use, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Bookmark,
  Briefcase,
  Building2,
  CalendarDays,
  Check,
  Clock3,
  IndianRupee,
  MapPin,
  Share2,
  Users,
} from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { CompanyMark } from "@/components/jobs/company-mark";
import { isSalaryTransparent, SalaryBandPanel } from "@/components/jobs/salary-band";
import { InterviewProcessTimeline } from "@/components/marketing/interview-process-timeline";
import { StickyJobApplyBar } from "@/components/marketing/sticky-action-bar";
import { Button } from "@/components/ui/button";
import { experienceRange, salaryRange, timeAgo } from "@/lib/format";
import { matchCandidateToJob, resumeScore } from "@/lib/matching";
import { btnPrimary } from "@/lib/ui";
import { useDemo } from "@/lib/store";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

function MetaPill({
  icon: Icon,
  children,
  tone = "light",
}: {
  icon: typeof MapPin;
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm",
        tone === "dark" ? "bg-white/10 text-white/80" : "bg-[#f4f5f8] text-muted-foreground",
      )}
    >
      <Icon className="size-3.5 shrink-0 opacity-70" />
      {children}
    </span>
  );
}

function SectionLabel({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">{eyebrow}</p>
      <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight">{title}</h2>
    </div>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 space-y-3.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3.5 text-[15px] leading-7 text-[#4b5060]">
          <span className="mt-1.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-black text-white">
            <Check className="size-3 stroke-[2.5]" />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const {
    ready,
    jobBySlug,
    companyById,
    applyToJob,
    toggleSaveJob,
    markJobViewed,
    session,
    candidateByUserId,
    savedJobIds,
    applications,
  } = useDemo();
  const job = jobBySlug(slug);
  const company = job ? companyById(job.companyId) : undefined;
  const candidate = session?.role === "candidate" ? candidateByUserId(session.id) : undefined;

  useEffect(() => {
    if (job) markJobViewed(job.id);
    // Intentionally only when the vacancy changes — markJobViewed identity follows store state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job?.id]);

  if (!ready) {
    return (
      <div className="container-shell py-20 text-sm text-muted-foreground">Loading role…</div>
    );
  }

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
  const saved = Boolean(session && (savedJobIds[session.id] ?? []).includes(job.id));

  const responsibilities = [
    ...job.responsibilities,
    "Share weekly progress with your manager and keep documentation current for the team.",
    "Raise risks early and partner with stakeholders to unblock delivery.",
  ];

  const requirements = [
    ...job.requirements,
    `${experienceRange(job.experienceMin, job.experienceMax)} of relevant experience, or strong adjacent evidence we can evaluate in interview.`,
    "Clear written communication and comfort working in a paced Indian hiring cycle.",
  ];

  return (
    <div className="relative overflow-hidden pb-28 lg:pb-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.95),_transparent_62%),linear-gradient(180deg,#eceef3_0%,transparent_100%)]"
      />

      <div className="container-shell relative pt-8 sm:pt-10">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          All jobs
        </Link>

        <div className="mt-6 grid gap-7 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="min-w-0 space-y-6">
            <header className="animate-fade-up mesh-dark relative overflow-hidden rounded-[2rem] px-7 py-8 text-white shadow-lift sm:rounded-[2.25rem] sm:px-10 sm:py-10">

              <div className="relative flex flex-wrap items-start justify-between gap-5">
                <div className="flex min-w-0 items-start gap-4">
                  <CompanyMark
                    name={company?.name ?? "Co"}
                    color="#ffffff"
                    size="lg"
                    className="ring-white/10"
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-white/55">
                      {company ? (
                        <Link href={`/companies/${company.slug}`} className="transition hover:text-white">
                          {company.name}
                        </Link>
                      ) : (
                        "Company"
                      )}
                      {company?.industry ? ` · ${company.industry}` : null}
                      {company?.verified ? " · Verified" : null}
                    </p>
                    <h1 className="mt-2 font-heading text-[2rem] leading-[1.12] font-semibold tracking-tight sm:text-[2.65rem]">
                      {job.title}
                    </h1>
                  </div>
                </div>
                <span className="rounded-full border border-white/12 bg-white/8 px-3.5 py-1.5 text-xs font-medium tracking-wide text-white/75 uppercase">
                  {open ? "Open role" : job.status}
                </span>
              </div>

              <div className="relative mt-8 flex flex-wrap gap-2.5">
                <MetaPill icon={MapPin} tone="dark">
                  {job.location}
                </MetaPill>
                <MetaPill icon={Briefcase} tone="dark">
                  {job.employmentType} · {job.workMode}
                </MetaPill>
                <MetaPill icon={IndianRupee} tone="dark">
                  {salaryRange(job.salaryMin, job.salaryMax)}
                </MetaPill>
                <MetaPill icon={Clock3} tone="dark">
                  {experienceRange(job.experienceMin, job.experienceMax)}
                </MetaPill>
                <MetaPill icon={Users} tone="dark">
                  {job.openings} openings
                </MetaPill>
                <MetaPill icon={CalendarDays} tone="dark">
                  Posted {timeAgo(job.postedAt)}
                </MetaPill>
              </div>

              <div className="relative mt-8 flex flex-wrap gap-2 border-t border-white/10 pt-6">
                {[job.department, job.category, job.workMode].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/12 px-3 py-1 text-xs tracking-wide text-white/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            <article className="animate-fade-up rounded-[2rem] bg-white p-7 shadow-soft sm:rounded-[2.25rem] sm:p-10 [animation-delay:80ms]">
              <section>
                <SectionLabel eyebrow="Overview" title="About the role" />
                <p className="mt-5 max-w-3xl text-[16px] leading-8 text-[#4b5060]">{job.description}</p>
                <p className="mt-4 max-w-3xl text-[16px] leading-8 text-[#4b5060]">
                  This is a {job.employmentType.toLowerCase()} {job.workMode.toLowerCase()} role in {job.location},
                  sitting in the {job.department} team under {job.category}. You will collaborate with cross-functional
                  partners and be measured on clear delivery outcomes for the first two quarters.
                </p>
              </section>

              <section className="mt-12 border-t border-[#eef0f4] pt-10">
                <SectionLabel eyebrow="Day to day" title="What you will do" />
                <Checklist items={responsibilities} />
              </section>

              <section className="mt-12 border-t border-[#eef0f4] pt-10">
                <SectionLabel eyebrow="Profile" title="What we look for" />
                <Checklist items={requirements} />
              </section>

              <section className="mt-12 border-t border-[#eef0f4] pt-10">
                <SectionLabel eyebrow="Stack" title="Skills that matter" />
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-[#e7e9ef] bg-[#f7f8fb] px-4 py-2 text-sm font-medium text-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              <section className="mt-12 border-t border-[#eef0f4] pt-10">
                <SectionLabel eyebrow="Offer" title="Compensation & logistics" />
                {isSalaryTransparent(job) ? (
                  <SalaryBandPanel job={job} className="mt-6" />
                ) : null}
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "CTC band", value: salaryRange(job.salaryMin, job.salaryMax) },
                    { label: "Experience", value: experienceRange(job.experienceMin, job.experienceMax) },
                    { label: "Work mode", value: `${job.workMode} · ${job.location}` },
                    { label: "Apply by", value: job.deadline || "Open until filled" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[1.35rem] border border-[#eef0f4] bg-[linear-gradient(180deg,#fbfbfc,#f6f7fa)] px-5 py-4"
                    >
                      <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                        {item.label}
                      </p>
                      <p className="mt-2 font-heading text-lg font-semibold tracking-tight">{item.value}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground">
                  Final offer depends on interview performance, notice period and internal banding. Variable pay,
                  benefits and joining bonus (if any) are confirmed during offer stage.
                </p>
              </section>

              {company ? (
                <section className="mt-12 overflow-hidden rounded-[1.75rem] border border-[#eef0f4] bg-[#f7f8fb] p-6 sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <CompanyMark name={company.name} color={company.logoColor} size="lg" className="ring-white" />
                      <div>
                        <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                          Employer
                        </p>
                        <h2 className="mt-1 font-heading text-2xl font-semibold tracking-tight">{company.name}</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {company.employees} · Founded {company.founded} · {company.location}
                          {company.verified ? " · Verified on HIREORA" : ""}
                        </p>
                      </div>
                    </div>
                    <Building2 className="size-5 text-muted-foreground/50" />
                  </div>
                  <p className="mt-5 max-w-3xl text-[15px] leading-7 text-[#4b5060]">{company.about}</p>
                  <Link
                    href={`/companies/${company.slug}`}
                    className="mt-5 inline-flex text-sm font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    View company page
                  </Link>
                </section>
              ) : null}

              <section className="mt-12 border-t border-[#eef0f4] pt-10">
                <SectionLabel eyebrow="Journey" title="Hiring process" />
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                  Typical timing if the desk is active — your recruiter will confirm exact rounds for this mandate.
                </p>
                <InterviewProcessTimeline className="mt-8" />
              </section>
            </article>
          </div>

          <aside className="animate-fade-up space-y-4 [animation-delay:140ms] lg:sticky lg:top-24">
            <div className="rounded-[1.85rem] bg-white p-6 shadow-lift">
              <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">Apply</p>
              <p className="mt-2 font-heading text-xl font-semibold tracking-tight">
                {open ? "Ready when you are" : "This role is closed"}
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {salaryRange(job.salaryMin, job.salaryMax)} · {job.location}
              </p>

              <Button
                className="mt-6 h-12 w-full rounded-full text-sm font-medium shadow-[0_10px_24px_rgba(17,17,17,0.16)]"
                disabled={!open || applied}
                onClick={() => applyToJob(job.id)}
              >
                {!open ? "Role closed" : applied ? "Applied" : "Apply now"}
              </Button>

              <div className="mt-2 grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="h-11 rounded-full"
                  onClick={() => toggleSaveJob(job.id)}
                >
                  <Bookmark className={cn("size-4", saved && "fill-current")} />
                  {saved ? "Saved" : "Save"}
                </Button>
                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-white text-sm transition hover:bg-muted"
                  onClick={() => {
                    void navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied");
                  }}
                >
                  <Share2 className="size-4" />
                  Share
                </button>
              </div>

              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#f4f5f8] text-sm font-medium transition hover:bg-[#eceef3]"
              >
                WhatsApp a recruiter
              </a>

              <p className="mt-5 text-xs leading-5 text-muted-foreground">
                Free for candidates. Complete profiles shortlist faster.
              </p>
            </div>

            {score ? (
              <div className="rounded-[1.85rem] bg-black p-6 text-white shadow-lift">
                <p className="text-[11px] font-medium tracking-[0.16em] text-white/45 uppercase">Live fit</p>
                <div className="mt-3 flex items-end gap-3">
                  <p className="font-heading text-5xl font-semibold tracking-tight">{score.score}</p>
                  <p className="mb-1.5 text-sm text-white/50">/ 100</p>
                </div>
                <p className="mt-3 text-sm text-white/70">
                  Hire probability <span className="font-medium text-white">{match?.hireProbability ?? score.hireProbability}%</span>
                  <span className="text-white/40"> · {match?.confidence ?? score.confidence} confidence</span>
                </p>
                <p className="mt-2 text-xs leading-5 text-white/40">{score.disclaimer}</p>
                <div className="mt-6 space-y-4">
                  {match?.factors.map((factor) => (
                    <div key={factor.label}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/70">{factor.label}</span>
                        <span className="font-medium">{factor.score}</span>
                      </div>
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-white transition-[width] duration-700"
                          style={{ width: `${Math.min(100, Math.max(8, factor.score))}%` }}
                        />
                      </div>
                      <p className="mt-1.5 text-xs leading-5 text-white/40">{factor.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-[1.85rem] border border-[#e7e9ef] bg-white/80 p-6 text-sm leading-6 text-muted-foreground shadow-soft backdrop-blur">
                Sign in as a candidate to see a transparent match breakdown for this role.
              </div>
            )}
          </aside>
        </div>
      </div>

      <StickyJobApplyBar
        open={open}
        applied={applied}
        salaryLabel={salaryRange(job.salaryMin, job.salaryMax)}
        location={job.location}
        onApply={() => applyToJob(job.id)}
        whatsappHref={wa}
      />
    </div>
  );
}
