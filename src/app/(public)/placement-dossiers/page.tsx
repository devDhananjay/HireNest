import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { placementDossiers } from "@/lib/content/placement-dossiers";
import { btnPrimaryOnDark } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Placement dossiers",
  description: "Anonymized HIREORA mandates — how briefs become shortlists and offers, with confidentiality intact.",
};

export default function PlacementDossiersPage() {
  return (
    <div className="relative overflow-hidden pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[22rem] bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.95),_transparent_55%),linear-gradient(180deg,#eceef3_0%,transparent_100%)]"
      />
      <div className="container-shell relative pt-14 sm:pt-16">
        <p className="text-[12px] font-medium tracking-[0.16em] text-muted-foreground uppercase">Proof</p>
        <h1 className="mt-3 max-w-3xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Placement dossiers
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
          Anonymized mandates — industry, process and outcomes. Names stay private; the craft does not.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {placementDossiers.map((item) => (
            <Link
              key={item.slug}
              href={`/placement-dossiers/${item.slug}`}
              className="group flex flex-col rounded-[1.85rem] bg-white p-7 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                  {item.mandateType} · {item.industry}
                </p>
                <ArrowUpRight className="size-4 text-muted-foreground transition group-hover:text-foreground" />
              </div>
              <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight">{item.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{item.location}</p>
              <p className="mt-4 line-clamp-3 text-sm leading-7 text-muted-foreground">{item.challenge}</p>
              <div className="mt-6 flex flex-wrap gap-4 border-t border-[#eef0f4] pt-5 text-xs text-muted-foreground">
                <span>
                  Shortlist <strong className="text-foreground">{item.daysToShortlist}d</strong>
                </span>
                <span>
                  Offer <strong className="text-foreground">{item.daysToOffer}d</strong>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-3 rounded-[1.85rem] bg-black px-7 py-8 text-white shadow-lift sm:px-10">
          <div className="min-w-0 flex-1">
            <h2 className="font-heading text-2xl font-semibold">Have a mandate that needs this level of care?</h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-white/60">
              Brief a consultant — confidential by default.
            </p>
          </div>
          <Link href="/contact" className={btnPrimaryOnDark}>
            Request a recruiter
          </Link>
        </div>
      </div>
    </div>
  );
}
