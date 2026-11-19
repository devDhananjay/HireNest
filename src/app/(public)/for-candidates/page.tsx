import Link from "next/link";
import { BadgeCheck, Bell, Calendar, FileUp, Search, Sparkles, UserRound } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { InterviewProcessTimeline } from "@/components/marketing/interview-process-timeline";
import { StickyActionBar } from "@/components/marketing/sticky-action-bar";
import { btnOutline, btnPrimary } from "@/lib/ui";

const steps = [
  {
    label: "Profile",
    icon: UserRound,
    text: "Add title, skills, education, experience and preferred locations so recruiters see a complete story — not a keyword dump.",
  },
  {
    label: "Resume",
    icon: FileUp,
    text: "Upload PDF or DOC. HIREORA stores it privately and runs a parser that can suggest skills and experience for you to confirm.",
  },
  {
    label: "Explore",
    icon: Search,
    text: "Browse jobs with transparent fit scores. Save roles, filter by industry and salary, and apply in a few clicks.",
  },
  {
    label: "Interview",
    icon: Calendar,
    text: "Track every status change and upcoming round in one timeline — video, phone or onsite — with reminders when enabled.",
  },
  {
    label: "Offer",
    icon: BadgeCheck,
    text: "When you are shortlisted or selected, everything stays in your applications history so you can compare and decide calmly.",
  },
];

const benefits = [
  {
    title: "Free to start",
    text: "Creating a candidate account and applying to listed roles stays free. You only share what you choose to put on your profile.",
  },
  {
    title: "Explainable matching",
    text: "Fit scores break down skills, location, experience and salary band. They are decision-support signals — not a hiring promise.",
  },
  {
    title: "Private documents",
    text: "Resumes are not public. Employers and recruiters download through authenticated routes tied to a live hiring process.",
  },
];

export default function ForCandidatesPage() {
  return (
    <div className="container-shell py-16 pb-28">
      <p className="text-[12px] font-medium tracking-[0.16em] text-muted-foreground uppercase">Candidates</p>
      <h1 className="mt-3 max-w-3xl font-heading text-4xl font-semibold sm:text-5xl">
        A calmer way to find work that fits.
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
        Create a profile, upload your resume, track every application, and see interviews in one place. HIREORA is built
        for Indian job seekers who want clarity on role fit, CTC bands and next steps — without drowning in spam.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/register?role=candidate" className={btnPrimary}>
          Create free profile
        </Link>
        <Link href="/jobs" className={btnOutline}>
          Browse jobs
        </Link>
        <Link href="/talent-community" className={btnOutline}>
          Talent community
        </Link>
      </div>

      <ol className="mt-14 grid gap-5 md:grid-cols-5">
        {steps.map((step, i) => (
          <li key={step.label} className="rounded-[1.85rem] bg-white p-6 shadow-soft">
            <div className="flex justify-center md:justify-start">
              <IconOrb icon={step.icon} />
            </div>
            <p className="mt-4 text-xs tracking-[0.16em] text-muted-foreground uppercase">Step {i + 1}</p>
            <p className="mt-2 font-heading font-semibold">{step.label}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
          </li>
        ))}
      </ol>

      <section className="mt-16 rounded-[1.85rem] bg-white p-7 shadow-soft sm:p-10">
        <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">After you apply</p>
        <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          Interview process timeline
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          Knowing what happens next removes half the anxiety. Typical timing when a desk is active — your recruiter
          confirms the exact loop for each mandate.
        </p>
        <InterviewProcessTimeline className="mt-8 max-w-2xl" />
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        {benefits.map((item) => (
          <div key={item.title} className="rounded-[1.85rem] bg-white p-7 shadow-soft">
            <IconOrb icon={Sparkles} />
            <h2 className="mt-5 font-heading text-xl font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="mt-16 flex flex-col justify-between gap-6 rounded-[1.85rem] bg-black p-7 text-white shadow-lift sm:flex-row sm:items-end sm:p-9">
        <div className="max-w-xl">
          <p className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.16em] text-white/50 uppercase">
            <Bell className="size-3.5" />
            Talent community
          </p>
          <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight">
            Save roles. Get quiet alerts when similar ones open.
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/60">
            Low-volume matching for specialists — not a daily blast. Manage preferences anytime.
          </p>
        </div>
        <Link
          href="/talent-community"
          className="inline-flex h-11 shrink-0 items-center rounded-full bg-white px-5 text-sm font-medium text-black"
        >
          Join community
        </Link>
      </section>

      <section className="mt-16 max-w-3xl rounded-[1.85rem] bg-white p-8 shadow-soft">
        <h2 className="font-heading text-2xl font-semibold">Tips for a stronger shortlist</h2>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
          <li>Keep skills specific (for example “React + TypeScript”, not only “coding”).</li>
          <li>Add education and experience so completeness scoring and fit models have something to work with.</li>
          <li>Set a realistic expected CTC and notice period — hiring managers filter on both.</li>
          <li>Re-upload your resume when you change roles so the stored file matches your profile.</li>
        </ul>
      </section>

      <StickyActionBar
        eyebrow="Candidates"
        title="Start free — profile, resume, then apply"
        primaryHref="/register?role=candidate"
        primaryLabel="Create profile"
        secondaryHref="/jobs"
        secondaryLabel="Browse jobs"
      />
    </div>
  );
}
