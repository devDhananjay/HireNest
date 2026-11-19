import type { Metadata } from "next";
import Link from "next/link";
import { LayoutDashboard, MapPin, Sparkles, Users } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { btnOutline, btnPrimary } from "@/lib/ui";

export const metadata: Metadata = { title: "About us" };

const pillars = [
  {
    title: "Specialist consultants",
    text: "Practitioners across IT, BFSI, healthcare, engineering, sales and operations who understand role scorecards, compensation bands and notice-period realities in India.",
    icon: Users,
  },
  {
    title: "Role-based workspaces",
    text: "Separate rooms for candidates, employers, recruiters and admins — so each person sees the pipeline, documents and decisions that belong to their job.",
    icon: LayoutDashboard,
  },
  {
    title: "Quiet by design",
    text: "Fewer spammy alerts, clearer shortlists, and matching scores that explain themselves. Built for hiring managers who want signal, not noise.",
    icon: Sparkles,
  },
];

const footprint = [
  { city: "Bengaluru", focus: "Product, engineering and GCC hiring" },
  { city: "Mumbai", focus: "BFSI, fintech and leadership search" },
  { city: "Delhi NCR", focus: "Retail, customer ops and growth roles" },
  { city: "Hyderabad & Pune", focus: "Healthcare, manufacturing and tech hubs" },
];

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[22rem] bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.95),_transparent_55%),linear-gradient(180deg,#eceef3_0%,transparent_100%)]"
      />
      <div className="container-shell relative pt-14 sm:pt-16">
        <div className="mesh-dark overflow-hidden rounded-[2rem] px-7 py-10 text-white shadow-lift sm:px-12 sm:py-14">
          <p className="text-[12px] font-medium tracking-[0.16em] text-white/50 uppercase">About HIREORA</p>
          <h1 className="mt-3 max-w-3xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            A recruitment firm built like a product company.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
            Consultancy judgement with a modern talent platform — from the first brief to offer and joining. Confidential
            when it must be; clear when candidates need signal.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/placement-dossiers" className="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-black">
              Placement dossiers
            </Link>
            <Link
              href="/trust"
              className="inline-flex h-11 items-center rounded-full border border-white/15 px-5 text-sm font-medium text-white"
            >
              Trust & confidentiality
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pillars.map((item) => (
            <div key={item.title} className="rounded-[1.85rem] bg-white p-7 shadow-soft">
              <IconOrb icon={item.icon} />
              <h2 className="mt-5 font-heading text-xl font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 max-w-3xl space-y-6 text-base leading-7 text-muted-foreground">
          <h2 className="font-heading text-2xl font-semibold text-foreground">How we work</h2>
          <p>
            Every mandate starts with a clear role scorecard: outcomes for the first six months, must-have skills,
            location or hybrid constraints, and a realistic compensation band. Our recruiters map the market, screen for
            evidence (not buzzwords), and bring shortlists that hiring managers can actually use.
          </p>
          <p>
            Employers can post jobs on the public board, run confidential searches without a listing, or hand the entire
            pipeline to a HIREORA consultant. Candidates keep profile, resume, applications and interviews in one
            workspace — with transparent fit scores that show why a role may or may not be a match.
          </p>
        </div>

        <div className="mt-14">
          <div className="flex items-center gap-3">
            <IconOrb icon={MapPin} />
            <h2 className="font-heading text-2xl font-semibold">Where we hire</h2>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {footprint.map((item) => (
              <div key={item.city} className="rounded-[1.5rem] bg-white px-5 py-4 shadow-soft">
                <p className="font-heading font-semibold">{item.city}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.focus}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-wrap gap-3">
          <Link href="/register?role=employer" className={btnPrimary}>
            Hire with HIREORA
          </Link>
          <Link href="/engagement" className={btnOutline}>
            Engagement & fees
          </Link>
          <Link href="/jobs" className={btnOutline}>
            Browse open roles
          </Link>
        </div>
      </div>
    </div>
  );
}
