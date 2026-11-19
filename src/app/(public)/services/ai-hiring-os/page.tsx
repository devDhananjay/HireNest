import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { OsWalkthrough } from "@/components/marketing/os-walkthrough";

export const metadata: Metadata = {
  title: "AI Hiring OS",
  description: "Resume parse, JD matching, voice screens, WhatsApp follow-ups and live desks — HIREORA’s recruitment automation platform.",
};

const customers = [
  {
    title: "Recruitment agencies",
    text: "Automate parsing, screening and follow-ups so consultants spend time on placements that close.",
  },
  {
    title: "HR teams",
    text: "A hiring OS beside your ATS — faster screens, clearer shortlists, quieter inboxes.",
  },
  {
    title: "Placement consultancies",
    text: "Shared dashboards your clients can open — campus and lateral programmes at once.",
  },
];

export default function AiHiringOsPage() {
  return (
    <div className="relative overflow-hidden pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.95),_transparent_60%),linear-gradient(180deg,#eceef3_0%,transparent_100%)]"
      />

      <div className="container-shell relative pt-14 sm:pt-16">
        <div className="mesh-dark animate-fade-up overflow-hidden rounded-[2rem] px-7 py-10 text-white shadow-lift sm:rounded-[2.35rem] sm:px-12 sm:py-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3.5 py-1.5 text-[11px] font-medium tracking-[0.16em] text-white/70 uppercase">
            <Sparkles className="size-3.5" />
            Product
          </div>
          <h1 className="mt-5 max-w-3xl font-heading text-[2.35rem] leading-[1.08] font-semibold tracking-tight sm:text-5xl lg:text-[3.4rem]">
            AI Hiring OS
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/55 sm:text-xl">Recruitment automation with humans in control</p>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
            Resume in → profile built → matched to JD → voice screened → WhatsApp followed up → live on the client
            dashboard.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Book a walkthrough
            </Link>
            <Link
              href="/engagement"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Engagement & fees
            </Link>
          </div>
        </div>

        <section className="mt-12 sm:mt-14">
          <OsWalkthrough />
        </section>

        <section className="mt-16 sm:mt-20">
          <div className="rounded-[2rem] bg-white p-8 shadow-soft sm:p-10">
            <p className="text-[12px] font-medium tracking-[0.16em] text-muted-foreground uppercase">Built for</p>
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight">Who runs on AI Hiring OS</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {customers.map((item) => (
                <div key={item.title} className="rounded-[1.5rem] border border-[#eef0f4] bg-[#f7f8fb] p-6">
                  <h3 className="font-heading text-lg font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16 overflow-hidden rounded-[2rem] bg-black px-8 py-10 text-white shadow-lift sm:px-12 sm:py-12">
          <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            See a live mandate on the desk.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/60">
            We will walk your team through parse, match, voice and follow-ups on a sample role — then map it to retained,
            contingent or RPO.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Talk to us
            </Link>
            <Link
              href="/placement-dossiers"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Placement dossiers
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
