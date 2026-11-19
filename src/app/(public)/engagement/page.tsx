import type { Metadata } from "next";
import Link from "next/link";
import { StickyBriefBar } from "@/components/marketing/sticky-action-bar";
import { btnOutline, btnPrimary } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Engagement & fees",
  description: "When to choose retained, contingent or RPO — and how HIREORA job packages fit beside consultancy mandates.",
};

const models = [
  {
    name: "Retained search",
    when: "Leadership, scarce specialists, or confidential replacements where the desk must stay quiet.",
    how: "Phased retainer against a defined scorecard. Shortlist and market map are the product — not CV spam.",
    typical: "Often 20–25% of annual CTC across stages, scoped per mandate.",
    cta: { href: "/contact", label: "Brief a retained search" },
  },
  {
    name: "Contingent / success",
    when: "Named roles with a clear JD where you want a specialist desk without a full retainer.",
    how: "Fee on successful join. Fit scoring and structured screens keep shortlists usable.",
    typical: "Commonly 8–15% of annual CTC depending on seniority and exclusivity.",
    cta: { href: "/contact", label: "Discuss a contingent role" },
  },
  {
    name: "RPO / bulk programmes",
    when: "Volume hiring, campus drives or multi-city ops where SLA and throughput matter.",
    how: "Shared dashboard, WhatsApp sequences and slot booking — consultants run the funnel against agreed gates.",
    typical: "Monthly programme fee or per-join hybrid; scoped after headcount and cities.",
    cta: { href: "/services/bulk-hiring", label: "Explore bulk hiring" },
  },
];

const packages = [
  {
    name: "Starter",
    price: "₹14,999",
    text: "Self-serve posting capacity for growing teams that still want HIREORA’s board and applicant desk.",
  },
  {
    name: "Growth",
    price: "₹39,999",
    text: "Higher volume, featured visibility and recruiter assist when your TA bench is thin.",
  },
  {
    name: "Enterprise",
    price: "Custom",
    text: "Retained capacity, RPO overlays and AI Hiring OS for agencies or multi-entity groups.",
  },
];

export default function EngagementPage() {
  return (
    <div className="relative overflow-hidden pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[22rem] bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.95),_transparent_55%),linear-gradient(180deg,#eceef3_0%,transparent_100%)]"
      />
      <div className="container-shell relative pt-14 sm:pt-16">
        <p className="text-[12px] font-medium tracking-[0.16em] text-muted-foreground uppercase">Commercial</p>
        <h1 className="mt-3 max-w-3xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Engagement models & fees
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
          Choose the commercial shape that matches the hire — not a one-size job pack. Figures below are typical Indian
          market bands; every mandate is scoped in writing.
        </p>

        <div className="mt-12 space-y-5">
          {models.map((model) => (
            <article
              key={model.name}
              className="grid gap-6 rounded-[1.85rem] bg-white p-7 shadow-soft lg:grid-cols-[1fr_1.1fr_0.9fr] lg:items-start lg:p-9"
            >
              <div>
                <h2 className="font-heading text-2xl font-semibold tracking-tight">{model.name}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  <span className="font-medium text-foreground">When: </span>
                  {model.when}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">How it runs</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{model.how}</p>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  <span className="font-medium text-foreground">Typical band: </span>
                  {model.typical}
                </p>
              </div>
              <div className="lg:justify-self-end">
                <Link href={model.cta.href} className={btnOutline}>
                  {model.cta.label}
                </Link>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-16">
          <h2 className="font-heading text-3xl font-semibold tracking-tight">Platform job packages</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            Product SKUs for teams that post and manage roles on HIREORA. Paid via Razorpay from the employer desk —
            separate from consultancy retainers.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {packages.map((pack) => (
              <div key={pack.name} className="rounded-[1.85rem] bg-white p-7 shadow-soft">
                <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">{pack.name}</p>
                <p className="mt-3 font-heading text-3xl font-semibold tracking-tight">{pack.price}</p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{pack.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register?role=employer" className={btnPrimary}>
              Create employer account
            </Link>
            <Link href="/trust" className={btnOutline}>
              Trust & confidentiality
            </Link>
          </div>
        </section>
      </div>
      <StickyBriefBar title="Not sure retained vs contingent?" primaryLabel="Talk to us" />
    </div>
  );
}