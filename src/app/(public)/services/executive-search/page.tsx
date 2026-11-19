import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Crown } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { HOME_MEDIA } from "@/lib/home-media";
import { btnOnDark, btnOutline, btnPrimaryOnDark } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Executive search",
  description:
    "Confidential leadership hiring with market maps, referencing and dedicated search partners for CXO and VP mandates.",
};

const steps = [
  {
    title: "Confidential briefing",
    text: "Stakeholder scorecard, succession context and what “success in year one” looks like — no public listing required.",
  },
  {
    title: "Market map",
    text: "Peer companies and adjacent industries. Quiet conversations with operators who are not applying on boards.",
  },
  {
    title: "Referenced shortlist",
    text: "Evidence packs with compensation context, culture risk notes and reference protocol before panels.",
  },
  {
    title: "Close & join",
    text: "Offer architecture, notice-period choreography and joining support so fragile leadership hires stick.",
  },
];

const deliverables = [
  "Silent mandate option — never a social blast",
  "Market map and longlist rationale",
  "Shortlist packs with references and India CTC / ESOP context",
  "Closed workspace for employer and search partner only",
  "Stay-through joining, not handoff at verbal offer",
];

const seats = [
  { title: "CXO & business leadership", text: "CEO/COO successors, country heads and P&L owners." },
  { title: "Technology & product", text: "CTO, VP Engineering, CPO and platform leadership for scale-ups and GCCs." },
  { title: "Critical replacements", text: "Sensitive exits where discretion matters more than speed theatre." },
];

export default function ExecutiveSearchPage() {
  return (
    <div className="relative overflow-hidden pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[22rem] bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.95),_transparent_55%),linear-gradient(180deg,#eceef3_0%,transparent_100%)]"
      />
      <div className="container-shell relative pt-14 sm:pt-16">
        <div className="grid overflow-hidden rounded-[2rem] bg-black text-white shadow-lift lg:grid-cols-[1.15fr_0.85fr]">
          <div className="px-7 py-10 sm:px-10 sm:py-12">
            <IconOrb icon={Crown} tone="light" />
            <p className="mt-5 text-[12px] font-medium tracking-[0.16em] text-white/45 uppercase">Advisory services</p>
            <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Executive search</h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-white/65 sm:text-lg">
              Discreet leadership hiring with mapped markets, referencing and a dedicated search partner — for CXO, VP
              and critical replacement mandates.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className={btnPrimaryOnDark}>
                Start a confidential mandate
              </Link>
              <Link href="/trust" className={btnOnDark}>
                Trust & confidentiality
              </Link>
            </div>
          </div>
          <div className="relative min-h-[220px] lg:min-h-full">
            <Image
              src={HOME_MEDIA.services.executive}
              alt="Executive search discussion"
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
            <h2 className="font-heading text-2xl font-semibold text-foreground">Privacy and depth</h2>
            <p>
              Leadership searches are sold on discretion. We brief stakeholders, map peer companies, then approach
              candidates who are not actively applying. Progress stays inside a closed employer or recruiter workspace —
              never a public listing unless you ask for one.
            </p>
            <p>
              Deliverables include compensation guidance for India bands (fixed, variable, ESOPs) and stay-through
              joining so offers do not collapse in notice period.
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
          <h2 className="font-heading text-2xl font-semibold tracking-tight">Search stages</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-[1.5rem] bg-white p-6 shadow-soft">
                <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                  Stage {index + 1}
                </p>
                <h3 className="mt-2 font-heading text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">Seats we search</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {seats.map((item) => (
              <div key={item.title} className="rounded-[1.5rem] border border-[#eef0f4] bg-[#f7f8fb] p-6">
                <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-[1.85rem] bg-[#0c0c0e] px-7 py-8 text-white shadow-lift sm:px-10">
          <h2 className="font-heading text-2xl font-semibold">See how a silent mandate reads</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
            Read an anonymized VP Engineering dossier — shortlist speed, process and outcome without client names.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/placement-dossiers/fintech-vp-engineering"
              className="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-black"
            >
              View dossier
            </Link>
            <Link href="/engagement" className="inline-flex h-11 items-center rounded-full border border-white/15 px-5 text-sm font-medium">
              Retained fee guidance
            </Link>
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/services/permanent-staffing" className={btnOutline}>
            Permanent staffing
          </Link>
          <Link href="/services/bulk-hiring" className={btnOutline}>
            Bulk hiring
          </Link>
          <Link href="/for-employers" className={btnOutline}>
            Employer overview
          </Link>
        </div>
      </div>
    </div>
  );
}
