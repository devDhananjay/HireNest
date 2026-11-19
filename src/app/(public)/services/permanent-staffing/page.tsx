import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, UserCheck } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { HOME_MEDIA } from "@/lib/home-media";
import { btnOnDark, btnOutline, btnPrimaryOnDark } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Permanent staffing",
  description:
    "Full-time specialist and mid-management hiring across India — scorecards, market maps and a shared pipeline desk.",
};

const steps = [
  {
    title: "Role intake",
    text: "Outcomes for the first six months, must-have skills, location or hybrid rules, and a realistic CTC band.",
  },
  {
    title: "Market map & longlist",
    text: "Evidence notes from peer companies and adjacent industries — not a keyword dump from job boards alone.",
  },
  {
    title: "Structured screens",
    text: "Scorecards shared with hiring managers before panels so every interviewer asks for the same proof.",
  },
  {
    title: "Offer & joining",
    text: "Notice-period planning, counter-offer coaching and replacement cover on agreed commercial terms.",
  },
];

const deliverables = [
  "Written role scorecard your panel can reuse",
  "Weekly pipeline status inside the employer workspace",
  "Shortlist packs with skills, compensation context and risk notes",
  "Authenticated resume access — no open attachment links",
  "Fit scores that explain skill, location and experience overlap",
];

const fits = [
  { title: "Product & engineering", text: "IC to manager layers across Bengaluru, Hyderabad, Pune and remote-first teams." },
  { title: "Finance & operations", text: "Controllers, credit, FP&A and ops leads for BFSI and growth-stage companies." },
  { title: "Healthcare & sales", text: "Clinical ops, field sales and customer leadership with India-market notice realities." },
];

export default function PermanentStaffingPage() {
  return (
    <div className="relative overflow-hidden pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[22rem] bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.95),_transparent_55%),linear-gradient(180deg,#eceef3_0%,transparent_100%)]"
      />
      <div className="container-shell relative pt-14 sm:pt-16">
        <div className="grid overflow-hidden rounded-[2rem] bg-black text-white shadow-lift lg:grid-cols-[1.15fr_0.85fr]">
          <div className="px-7 py-10 sm:px-10 sm:py-12">
            <IconOrb icon={UserCheck} tone="light" />
            <p className="mt-5 text-[12px] font-medium tracking-[0.16em] text-white/45 uppercase">Advisory services</p>
            <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Permanent staffing</h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-white/65 sm:text-lg">
              Full-time hiring for specialists and mid-management. Consultancy judgement with a live desk your TA team
              can open anytime.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className={btnPrimaryOnDark}>
                Request this service
              </Link>
              <Link href="/engagement" className={btnOnDark}>
                Contingent vs retained
              </Link>
            </div>
          </div>
          <div className="relative min-h-[220px] lg:min-h-full">
            <Image
              src={HOME_MEDIA.services.permanent}
              alt="Permanent staffing collaboration"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover opacity-85"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-black/40 lg:to-black" />
          </div>
        </div>

        <section className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5 text-base leading-8 text-muted-foreground">
            <h2 className="font-heading text-2xl font-semibold text-foreground">When permanent staffing fits</h2>
            <p>
              Use this lane when the hire is full-time, the brief can be scored, and you want a specialist desk — not a
              CV flood. Contingent works for named roles with a clear JD; retained suits scarce or sensitive seats.
            </p>
            <p>
              We translate your six-month outcomes into a scorecard, then source from the live board, our candidate pool
              and targeted outreach. Every shortlist carries evidence hiring managers can defend.
            </p>
          </div>
          <div className="rounded-[1.85rem] bg-white p-6 shadow-soft sm:p-7">
            <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">You receive</p>
            <ul className="mt-4 space-y-3">
              {deliverables.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-foreground" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">How the engagement runs</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-[1.5rem] bg-white p-6 shadow-soft">
                <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                  Step {index + 1}
                </p>
                <h3 className="mt-2 font-heading text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">Deepest lanes</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {fits.map((item) => (
              <div key={item.title} className="rounded-[1.5rem] border border-[#eef0f4] bg-[#f7f8fb] p-6">
                <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-14 flex flex-wrap gap-3">
          <Link href="/placement-dossiers" className={btnOutline}>
            Placement dossiers
          </Link>
          <Link href="/services/bulk-hiring" className={btnOutline}>
            Bulk hiring
          </Link>
          <Link href="/services/executive-search" className={btnOutline}>
            Executive search
          </Link>
        </div>
      </div>
    </div>
  );
}
