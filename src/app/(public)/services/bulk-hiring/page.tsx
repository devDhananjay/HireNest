import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Users } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { HOME_MEDIA } from "@/lib/home-media";
import { btnOnDark, btnOutline, btnPrimaryOnDark } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Bulk hiring",
  description:
    "High-volume hiring programmes across India with quality gates, WhatsApp sequences and shared joining dashboards.",
};

const steps = [
  {
    title: "Programme design",
    text: "Cities, volumes, assessment gates, shift or language rules, and a joining window your TA lead can defend.",
  },
  {
    title: "Funnel build",
    text: "Campus, lateral, walk-in and remote panels — each stage with a named owner and weekly shortlist SLA.",
  },
  {
    title: "Quality gates",
    text: "AI fit ranking and structured assessments so volume never becomes an inbox of unqualified CVs.",
  },
  {
    title: "Join & report",
    text: "Show-up, offer acceptance and day-30 joining on one dashboard for client and HIREORA leads.",
  },
];

const metrics = [
  { label: "Designed around", value: "Conversion", note: "Not applications received" },
  { label: "Typical review", value: "Weekly SLA", note: "Shared pipeline truth" },
  { label: "Channels", value: "Multi-city", note: "Campus · walk-in · remote" },
];

const programmes = [
  "Retail store clusters and customer experience associates",
  "Bilingual customer ops and support centres",
  "Fresher analyst / graduate cohorts",
  "Fulfilment, warehouse and field sales volume drives",
];

export default function BulkHiringPage() {
  return (
    <div className="relative overflow-hidden pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[22rem] bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.95),_transparent_55%),linear-gradient(180deg,#eceef3_0%,transparent_100%)]"
      />
      <div className="container-shell relative pt-14 sm:pt-16">
        <div className="grid overflow-hidden rounded-[2rem] bg-black text-white shadow-lift lg:grid-cols-[1.15fr_0.85fr]">
          <div className="px-7 py-10 sm:px-10 sm:py-12">
            <IconOrb icon={Users} tone="light" />
            <p className="mt-5 text-[12px] font-medium tracking-[0.16em] text-white/45 uppercase">Advisory services</p>
            <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Bulk hiring</h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-white/65 sm:text-lg">
              High-volume programmes for operations, sales, support and graduate hiring — without lowering the bar on
              screening quality or candidate experience.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className={btnPrimaryOnDark}>
                Talk to a programme lead
              </Link>
              <Link href="/engagement" className={btnOnDark}>
                RPO commercial models
              </Link>
            </div>
          </div>
          <div className="relative min-h-[220px] lg:min-h-full">
            <Image
              src={HOME_MEDIA.services.bulk}
              alt="Bulk hiring programme team"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover opacity-85"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-black/40 lg:to-black" />
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {metrics.map((item) => (
            <div key={item.label} className="rounded-[1.5rem] bg-white px-5 py-5 shadow-soft">
              <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">{item.label}</p>
              <p className="mt-2 font-heading text-xl font-semibold">{item.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
            </div>
          ))}
        </div>

        <section className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5 text-base leading-8 text-muted-foreground">
            <h2 className="font-heading text-2xl font-semibold text-foreground">Why bulk programmes stall</h2>
            <p>
              Most fail when the only KPI is applications received. Hiring managers then drown in unqualified CVs and
              walk-in no-shows. We design around conversion: show-up rates, assessment pass-through, offer acceptance and
              day-30 joining.
            </p>
            <p>
              Recruiters and client TA leads share the same pipeline view — weekly reviews stay factual. WhatsApp ack,
              interview-slot self-booking and fit gates keep volume usable.
            </p>
          </div>
          <div className="rounded-[1.85rem] bg-white p-6 shadow-soft sm:p-7">
            <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">Typical programmes</p>
            <ul className="mt-4 space-y-3">
              {programmes.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-foreground" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">Programme flow</h2>
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

        <section className="mt-14 rounded-[1.85rem] bg-[#0c0c0e] px-7 py-8 text-white shadow-lift sm:px-10">
          <h2 className="font-heading text-2xl font-semibold">What “quality at volume” means here</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
            Candidates only reach hiring managers above an agreed fit threshold. Voice screens and structured assessments
            sit before live panels. SLAs are written into the programme brief — not improvised mid-drive.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/services/ai-hiring-os" className="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-black">
              See AI Hiring OS
            </Link>
            <Link href="/placement-dossiers/retail-bulk-customer-ops" className="inline-flex h-11 items-center rounded-full border border-white/15 px-5 text-sm font-medium">
              Bulk dossier example
            </Link>
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/services/permanent-staffing" className={btnOutline}>
            Permanent staffing
          </Link>
          <Link href="/services/executive-search" className={btnOutline}>
            Executive search
          </Link>
          <Link href="/recruitment-services" className={btnOutline}>
            All services
          </Link>
        </div>
      </div>
    </div>
  );
}
