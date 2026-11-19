import Link from "next/link";
import { ArrowRight, Briefcase, ClipboardList, Lock, LineChart, Sparkles, UserRoundSearch, ShieldCheck } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { StickyBriefBar } from "@/components/marketing/sticky-action-bar";
import { btnOutline, btnPrimary } from "@/lib/ui";

const features = [
  {
    title: "Post & manage jobs",
    text: "Create vacancies with clear responsibilities, skills and salary bands. Track live, pending and expired roles from one hiring desk — with admin approval before posts go public.",
    icon: Briefcase,
  },
  {
    title: "Review applications",
    text: "See who applied, move candidates through review and shortlist stages, schedule interviews, and download resumes through authenticated links — not open attachments.",
    icon: ClipboardList,
  },
  {
    title: "Confidential search",
    text: "For leadership or sensitive replacements, run a silent mandate with a HIREORA recruiter. No public listing required; shortlists stay inside your employer workspace.",
    icon: Lock,
  },
];

const process = [
  {
    title: "Brief the role",
    text: "Share outcomes, team context, location, and compensation. We turn that into a scorecard your interviewers can reuse.",
  },
  {
    title: "Source & screen",
    text: "Use the public board, search our candidate pool, or assign a recruiter. Fit scores explain skill, location and experience overlap.",
  },
  {
    title: "Interview & close",
    text: "Schedule rounds, capture status history, and move to offer. Job packages via Razorpay cover volume or executive retainers when you need more capacity.",
  },
];

const extras = [
  {
    title: "Company verification",
    text: "New employer accounts start unverified. HIREORA admin reviews company profiles so candidates know who is behind the listing.",
    icon: ShieldCheck,
  },
  {
    title: "Recruiter on demand",
    text: "Hand off a mandate when your TA team is stretched. Pipeline stages, notes and client SLAs live in the recruiter CRM.",
    icon: UserRoundSearch,
  },
  {
    title: "Hiring reports",
    text: "See applications, leads and conversion from applied to joined — useful for leadership reviews and budget planning.",
    icon: LineChart,
  },
];

export default function ForEmployersPage() {
  return (
    <div className="container-shell py-16 pb-28">
      <p className="text-[12px] font-medium tracking-[0.16em] text-muted-foreground uppercase">Employers</p>
      <h1 className="mt-3 max-w-3xl font-heading text-4xl font-semibold sm:text-5xl">
        Hire with the judgement of a consultancy and the speed of a product.
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
        Post jobs, search candidates, or hand the mandate to a HIREORA recruiter. Candidate registration stays free.
        Employer job packages (Starter, Growth, Enterprise) are available through Razorpay when you need more volume or
        retained search support.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/register?role=employer" className={btnPrimary}>
          Create employer account
        </Link>
        <Link href="/contact" className={btnOutline}>
          Request a recruiter
        </Link>
        <Link href="/engagement" className={btnOutline}>
          Engagement & fees
        </Link>
        <Link href="/trust" className={btnOutline}>
          Trust
        </Link>
      </div>

      <Link
        href="/services/ai-hiring-os"
        className="group mt-12 flex flex-col justify-between gap-6 rounded-[1.85rem] bg-black p-7 text-white shadow-lift sm:flex-row sm:items-end sm:p-9"
      >
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.16em] text-white/50 uppercase">
            <Sparkles className="size-3.5" />
            AI Hiring OS
          </p>
          <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Automate screening. Keep humans on decisions that matter.
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/60">
            Resume → AI profile, JD matching, voice interviews, WhatsApp follow-ups, and live dashboards for your team
            and clients.
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center text-sm font-medium">
          Explore AI Hiring OS <ArrowRight className="ml-1 size-4 transition group-hover:translate-x-0.5" />
        </span>
      </Link>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {features.map((item) => (
          <div key={item.title} className="rounded-[1.85rem] bg-white p-7 shadow-soft">
            <IconOrb icon={item.icon} />
            <h2 className="mt-5 font-heading text-xl font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="font-heading text-2xl font-semibold">A simple hiring loop</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Whether you self-serve or work with a consultant, the loop stays the same — clear brief, evidence-based
          shortlist, tracked interviews.
        </p>
        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {process.map((step, index) => (
            <li key={step.title} className="rounded-[1.85rem] bg-white p-6 shadow-soft">
              <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">Step {index + 1}</p>
              <h3 className="mt-2 font-heading text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        {extras.map((item) => (
          <div key={item.title} className="rounded-[1.85rem] bg-white p-6 shadow-soft">
            <IconOrb icon={item.icon} />
            <h3 className="mt-4 font-heading text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </section>

      <StickyBriefBar />
    </div>
  );
}
