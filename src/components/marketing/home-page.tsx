"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ComponentProps, type ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  ClipboardList,
  Clock,
  Compass,
  Crown,
  FileSearch,
  FileUp,
  Fingerprint,
  Globe2,
  Handshake,
  Layers,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Radar,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Upload,
  User,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { CompanyMark } from "@/components/jobs/company-mark";
import { JobCard } from "@/components/jobs/job-card";
import { Reveal } from "@/components/motion/reveal";
import { JobSearchBar } from "@/components/search/job-search-bar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BRAND, CATEGORIES } from "@/lib/constants";
import { stats, testimonials, articles } from "@/lib/demo/seed";
import { HOME_MEDIA } from "@/lib/home-media";
import { useDemo } from "@/lib/store";
import { cn } from "@/lib/utils";

function useCount(target: number) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 1400, 1);
      setValue(Math.round(target * progress));
      if (progress < 1) requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [target]);
  return value;
}

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const n = useCount(value);
  return (
    <span>
      {n.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p
      className={cn(
        "text-[11px] font-medium tracking-[0.22em] uppercase sm:text-[12px]",
        light ? "text-white/45" : "text-muted-foreground",
      )}
    >
      {children}
    </p>
  );
}

function SectionHeading({
  title,
  subtitle,
  action,
  light = false,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  light?: boolean;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 max-w-2xl">
        <h2
          className={cn(
            "font-heading text-[1.75rem] font-semibold tracking-tight sm:text-[2.35rem]",
            light && "text-white",
          )}
        >
          {title}
        </h2>
        {subtitle ? (
          <p className={cn("mt-3 text-sm leading-7 sm:text-[15px]", light ? "text-white/55" : "text-muted-foreground")}>
            {subtitle}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

function IconField({
  icon: Icon,
  className,
  ...props
}: ComponentProps<"input"> & { icon: (props: { className?: string }) => ReactNode }) {
  return (
    <div className={cn("relative", className)}>
      <Icon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground/70" />
      <Input className="pl-10" {...props} />
    </div>
  );
}

export function HomePage() {
  const router = useRouter();
  const { jobs, companies, addLead } = useDemo();
  const featured = jobs.filter((job) => job.featured && job.status === "active").slice(0, 3);
  const [search, setSearch] = useState({ q: "", location: "", experience: "", type: "" });
  const [lead, setLead] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    hiringNeed: "",
    roles: "",
    location: "",
  });
  const [journey, setJourney] = useState<"candidate" | "employer">("candidate");

  const journeys = {
    candidate: {
      label: "For candidates",
      eyebrow: "Candidate journey",
      title: "From profile to signed offer — without the noise.",
      image: HOME_MEDIA.candidatePath,
      href: "/register?role=candidate",
      cta: "Create candidate profile",
      steps: [
        { icon: UserPlus, title: "Build your profile", text: "Skills, preferences and career chapter in one place." },
        { icon: FileUp, title: "Upload your resume", text: "Parsed once — reused across every mandate." },
        { icon: Search, title: "Explore opportunities", text: "Roles matched to your craft, not keyword spam." },
        { icon: MessageSquare, title: "Interview with clarity", text: "Briefs, calendars and feedback that respect you." },
        { icon: Handshake, title: "Accept with confidence", text: "Offer support through the final handshake." },
      ],
    },
    employer: {
      label: "For employers",
      eyebrow: "Employer journey",
      title: "A search practice that moves on your calendar.",
      image: HOME_MEDIA.employerPath,
      href: "/for-employers",
      cta: "Brief a consultant",
      steps: [
        { icon: ClipboardList, title: "Brief the mandate", text: "Scorecard, culture markers and bands locked early." },
        { icon: Target, title: "Align on scorecard", text: "Must-haves calibrated with your hiring panel." },
        { icon: FileSearch, title: "Review shortlists", text: "Narrative notes — never a resume dump." },
        { icon: Users, title: "Run interviews", text: "Structured loops with velocity and discretion." },
        { icon: BadgeCheck, title: "Close the hire", text: "Offer choreography through day-thirty stickiness." },
      ],
    },
  } as const;

  const activeJourney = journeys[journey];

  function onSearch(e?: React.FormEvent) {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (search.q) params.set("q", search.q);
    if (search.location) params.set("location", search.location);
    if (search.experience) params.set("experience", search.experience);
    if (search.type) params.set("category", search.type);
    router.push(`/jobs?${params.toString()}`);
  }

  return (
    <div className="-mt-16 overflow-x-hidden sm:-mt-[4.35rem]">
      {/* Hero */}
      <section className="relative isolate min-h-[100svh] overflow-hidden bg-[#070709]">
        <Image
          src={HOME_MEDIA.hero}
          alt="Premium consulting workspace"
          fill
          priority
          sizes="100vw"
          className="hero-media object-cover object-[60%_30%] sm:object-center"
        />
        <div className="hero-veil absolute inset-0" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/45 to-transparent" />
        <div className="container-shell relative flex min-h-[100svh] flex-col justify-end pb-28 pt-28 sm:pb-32 lg:pb-36">
          <p className="hero-rise font-heading text-[clamp(2.85rem,13.5vw,8rem)] leading-[0.86] font-semibold tracking-[-0.07em] text-white">
            {BRAND.name}
          </p>
          <h1 className="hero-rise hero-rise-delay-1 mt-5 max-w-[18rem] font-heading text-[1.25rem] leading-[1.25] font-medium tracking-[-0.035em] text-white/92 sm:mt-6 sm:max-w-xl sm:text-[1.85rem] md:text-[2.15rem]">
            {BRAND.tagline}
          </h1>
          <p className="hero-rise hero-rise-delay-2 mt-4 max-w-md text-[14px] leading-6 text-white/58 sm:text-[15px] sm:leading-7">
            An executive search and staffing practice for leaders, specialists and high-growth teams across India.
          </p>
          <div className="hero-rise hero-rise-delay-3 mt-8 flex w-full flex-col gap-2.5 sm:mt-10 sm:w-auto sm:flex-row sm:gap-3">
            <Link
              href="/jobs"
              className={cn(
                buttonVariants(),
                "h-12 w-full justify-center rounded-full bg-white px-7 text-black hover:bg-white/92 sm:w-auto",
              )}
            >
              Explore roles
            </Link>
            <Link
              href="/for-employers"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-12 w-full justify-center rounded-full border-white/25 bg-transparent px-7 text-white hover:bg-white/10 hover:text-white sm:w-auto",
              )}
            >
              Brief our consultants
            </Link>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="container-shell relative z-10 -mt-14 pb-14 sm:-mt-16 sm:pb-20">
        <Reveal>
          <JobSearchBar values={search} onChange={setSearch} onSubmit={() => onSearch()} />
        </Reveal>
      </section>

      {/* Practice editorial */}
      <section className="container-shell pb-16 sm:pb-24">
        <div className="grid overflow-hidden rounded-[1.6rem] bg-[#0c0c0e] text-white sm:rounded-[2rem] lg:grid-cols-2">
          <div className="relative min-h-[280px] sm:min-h-[420px] lg:min-h-[520px]">
            <Image
              src={HOME_MEDIA.practice}
              alt="Consulting team in discussion"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/20" />
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
            <Eyebrow light>The practice</Eyebrow>
            <h2 className="mt-4 font-heading text-[1.85rem] font-semibold tracking-tight sm:text-[2.5rem]">
              Quiet rooms.
              <br />
              Exact shortlists.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/60 sm:text-[15px]">
              HIREORA operates like a modern search firm — confidential mandates, calibrated judgement, and a product layer that keeps every search moving.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-white/10 pt-7">
              {[
                { value: stats.candidatesPlaced, label: "Placements", suffix: "" },
                { value: stats.successfulPlacements, label: "Success rate", suffix: "%" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                    <Counter value={item.value} suffix={item.suffix} />
                  </p>
                  <p className="mt-1 text-xs tracking-[0.16em] text-white/40 uppercase">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="container-shell pb-16 sm:pb-20">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {[
            { label: "Live mandates", value: stats.jobsAvailable, icon: Briefcase },
            { label: "Hiring organisations", value: stats.companiesHiring, icon: Building2 },
            { label: "Professionals placed", value: stats.candidatesPlaced, icon: Users },
            { label: "Offer acceptance", value: stats.successfulPlacements, suffix: "%", icon: Trophy },
          ].map((item, index) => (
            <Reveal key={item.label} delay={index * 0.05}>
              <div className="rounded-[1.4rem] border border-black/[0.04] bg-white p-5 sm:rounded-[1.7rem] sm:p-6">
                <item.icon className="size-4 text-muted-foreground" />
                <p className="mt-5 font-heading text-3xl font-semibold tracking-tight sm:text-[2.5rem]">
                  <Counter value={item.value} suffix={item.suffix} />
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{item.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Categories with images */}
      <section className="container-shell pb-16 sm:pb-24">
        <SectionHeading
          title="Where we place talent"
          subtitle="Sector desks across technology, finance, healthcare and operations."
          action={
            <Link href="/jobs" className="inline-flex items-center text-sm font-medium">
              View all roles <ArrowRight className="ml-1 size-4" />
            </Link>
          }
        />
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/jobs?category=${encodeURIComponent(category.name)}`}
              className="group relative isolate min-h-[210px] overflow-hidden rounded-[1.4rem] sm:min-h-[240px] sm:rounded-[1.7rem]"
            >
              <Image
                src={HOME_MEDIA.categories[category.slug] ?? HOME_MEDIA.practice}
                alt={category.name}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition duration-700 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-heading text-lg font-semibold text-white">{category.name}</p>
                <p className="mt-1 text-sm text-white/55">{category.jobs} open roles</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured jobs */}
      <section className="container-shell pb-16 sm:pb-24">
        <SectionHeading
          title="Featured mandates"
          subtitle="A curated slice of live opportunities from our network."
          action={
            <Link href="/jobs" className="inline-flex text-sm font-medium">
              Open marketplace
            </Link>
          }
        />
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((job, index) => (
            <JobCard key={job.id} job={job} featured={index === 1} />
          ))}
        </div>
      </section>

      {/* Why / judgement editorial */}
      <section className="container-shell pb-16 sm:pb-24">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] sm:aspect-[5/6] sm:rounded-[2rem]">
              <Image
                src={HOME_MEDIA.judgement}
                alt="Leadership conversation"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute right-4 bottom-4 left-4 rounded-2xl bg-white/92 p-4 backdrop-blur sm:right-6 sm:bottom-6 sm:left-6 sm:p-5">
                <p className="font-heading text-lg font-semibold tracking-tight">Search with discretion</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Leadership mandates stay confidential until the shortlist is ready.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <Eyebrow>Why HIREORA</Eyebrow>
            <h2 className="mt-4 font-heading text-[1.85rem] font-semibold tracking-tight sm:text-[2.6rem]">
              Consultancy judgement.
              <br />
              Product cadence.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground sm:text-[15px]">
              We combine senior recruiter craft with a precise operating system — so employers move faster, and candidates feel the difference.
            </p>
            <div className="mt-8 space-y-5">
              {[
                { icon: ShieldCheck, title: "Verified mandates", text: "Every live role is reviewed before it reaches candidates." },
                { icon: Users, title: "Specialist desks", text: "Consultants who live inside one function, not every function." },
                { icon: Clock, title: "Interview velocity", text: "Structured shortlists and calendars that respect everyone's time." },
                { icon: Sparkles, title: "Explainable matching", text: "Scores you can defend — never a black-box ranking." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 border-t border-black/[0.06] pt-5 first:border-t-0 first:pt-0">
                  <item.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className="container-shell pb-16 sm:pb-24">
        <div className="overflow-hidden rounded-[1.7rem] bg-[#0c0c0e] text-white sm:rounded-[2.25rem]">
          <div className="border-b border-white/8 px-6 pt-8 pb-6 sm:px-10 sm:pt-10 sm:pb-8 lg:px-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <Eyebrow light>How it works</Eyebrow>
                <h2 className="mt-4 font-heading text-[1.85rem] font-semibold tracking-tight sm:text-[2.55rem]">
                  One practice.
                  <br />
                  Two exact journeys.
                </h2>
              </div>
              <div className="inline-flex w-full rounded-full border border-white/12 bg-white/[0.04] p-1.5 sm:w-auto">
                {(
                  [
                    { id: "candidate" as const, label: "Candidates" },
                    { id: "employer" as const, label: "Employers" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setJourney(tab.id)}
                    className={cn(
                      "h-11 flex-1 rounded-full px-6 text-sm font-medium transition sm:flex-none",
                      journey === tab.id ? "bg-white text-black" : "text-white/55 hover:text-white",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative min-h-[280px] overflow-hidden sm:min-h-[420px]">
              <Image
                key={activeJourney.image}
                src={activeJourney.image}
                alt={activeJourney.label}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
                <p className="text-[11px] tracking-[0.2em] text-white/45 uppercase">{activeJourney.eyebrow}</p>
                <p className="mt-3 max-w-sm font-heading text-2xl font-semibold tracking-tight sm:text-[1.85rem]">
                  {activeJourney.title}
                </p>
                <Link
                  href={activeJourney.href}
                  className={cn(
                    buttonVariants(),
                    "mt-6 h-11 rounded-full bg-white px-5 text-black hover:bg-white/92",
                  )}
                >
                  {activeJourney.cta} <ArrowRight className="ml-1 size-4" />
                </Link>
              </div>
            </div>

            <div className="relative p-6 sm:p-8 lg:p-10 lg:pl-8">
              <div className="absolute top-10 bottom-10 left-[2.35rem] hidden w-px bg-gradient-to-b from-white/25 via-white/10 to-transparent sm:left-[2.85rem] lg:block" />
              <ol className="space-y-4 sm:space-y-5">
                {activeJourney.steps.map((step, index) => (
                  <li
                    key={`${journey}-${step.title}`}
                    className="group relative flex gap-4 rounded-[1.25rem] border border-white/[0.06] bg-white/[0.03] p-4 transition duration-300 hover:border-white/15 hover:bg-white/[0.06] sm:gap-5 sm:rounded-[1.4rem] sm:p-5"
                  >
                    <span className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-black sm:size-12">
                      <step.icon className="size-4" />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <div className="flex items-baseline gap-3">
                        <span className="font-heading text-sm font-semibold text-white/30 tabular-nums">
                          0{index + 1}
                        </span>
                        <h3 className="font-heading text-base font-semibold tracking-tight sm:text-lg">
                          {step.title}
                        </h3>
                      </div>
                      <p className="mt-1.5 text-sm leading-6 text-white/50">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Services image cards */}
      <section className="container-shell pb-16 sm:pb-24">
        <SectionHeading
          title="Advisory services"
          subtitle="From permanent desks to confidential executive search."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              href: "/services/permanent-staffing",
              title: "Permanent staffing",
              text: "End-to-end hiring for specialist and mid-senior full-time roles.",
              image: HOME_MEDIA.services.permanent,
              icon: UserCheck,
            },
            {
              href: "/services/bulk-hiring",
              title: "Bulk hiring",
              text: "High-volume programmes with quality gates and clear SLAs.",
              image: HOME_MEDIA.services.bulk,
              icon: Users,
            },
            {
              href: "/services/executive-search",
              title: "Executive search",
              text: "Discreet leadership mandates with market mapping.",
              image: HOME_MEDIA.services.executive,
              icon: Crown,
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative isolate min-h-[320px] overflow-hidden rounded-[1.55rem] sm:min-h-[380px] sm:rounded-[1.9rem]"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <item.icon className="size-5 text-white/70" />
                <h3 className="mt-4 font-heading text-xl font-semibold text-white sm:text-2xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">{item.text}</p>
                <p className="mt-5 inline-flex items-center text-sm font-medium text-white">
                  Learn more <ArrowRight className="ml-1 size-4 transition group-hover:translate-x-0.5" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Search methodology */}
      <section className="container-shell pb-16 sm:pb-24">
        <div className="overflow-hidden rounded-[1.7rem] bg-[#0c0c0e] text-white sm:rounded-[2.2rem]">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-[240px] sm:min-h-[360px] lg:min-h-full">
              <Image
                src={HOME_MEDIA.methodology}
                alt="Search methodology workshop"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-[#0c0c0e]/40 lg:to-[#0c0c0e]" />
              <div className="absolute right-6 bottom-6 left-6 lg:right-auto lg:bottom-10 lg:left-10">
                <Eyebrow light>Search methodology</Eyebrow>
                <p className="mt-3 max-w-sm font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                  How a mandate moves from brief to signed offer.
                </p>
              </div>
            </div>
            <div className="relative p-6 sm:p-10 lg:py-14 lg:pr-12 lg:pl-4">
              <div className="absolute top-10 bottom-10 left-[2.15rem] hidden w-px bg-white/10 sm:left-[2.9rem] lg:block" />
              <ol className="space-y-6 sm:space-y-8">
                {[
                  {
                    icon: ClipboardList,
                    title: "Discovery brief",
                    text: "Role scorecard, culture markers, compensation bands and must-haves — locked with the hiring manager.",
                  },
                  {
                    icon: Radar,
                    title: "Market map",
                    text: "Competitor desks, adjacent talent pools and passive candidates mapped before outreach begins.",
                  },
                  {
                    icon: FileSearch,
                    title: "Calibrated shortlist",
                    text: "Three to five profiles with narrative notes — not a resume dump.",
                  },
                  {
                    icon: Handshake,
                    title: "Close & onboarding",
                    text: "Offer choreography, counter handling and a 30-day stickiness check.",
                  },
                ].map((step, index) => (
                  <li key={step.title} className="relative flex gap-4 sm:gap-5">
                    <span className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-[#0c0c0e] sm:size-12">
                      <step.icon className="size-4 text-white/80" />
                    </span>
                    <div className="pt-1.5">
                      <p className="text-[11px] tracking-[0.18em] text-white/35 uppercase">
                        Stage 0{index + 1}
                      </p>
                      <h3 className="mt-1 font-heading text-lg font-semibold tracking-tight sm:text-xl">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-white/55">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Engagement models */}
      <section className="container-shell pb-16 sm:pb-24">
        <SectionHeading
          title="Engagement models"
          subtitle="Choose the commercial structure that fits the urgency and confidentiality of the hire."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Lock,
              title: "Retained search",
              badge: "Leadership",
              text: "Exclusive mandate with dedicated consultants, weekly market intel and a guaranteed shortlist cadence.",
              points: ["CXO & VP desks", "NDA-first outreach", "Dedicated partner"],
            },
            {
              icon: Scale,
              title: "Contingent",
              badge: "Specialist",
              text: "Pay on success for mid-senior specialist roles when speed and breadth of coverage matter most.",
              points: ["No retainers", "Multi-channel sourcing", "SLA on first shortlist"],
            },
            {
              icon: Layers,
              title: "RPO & programmes",
              badge: "Scale",
              text: "Embedded recruiters for campus, bulk and seasonal hiring with shared scorecards and dashboards.",
              points: ["Onsite or remote", "Weekly funnel reports", "Quality gates"],
            },
          ].map((model) => (
            <div
              key={model.title}
              className="group flex flex-col rounded-[1.55rem] border border-black/[0.05] bg-white p-6 transition duration-300 hover:-translate-y-0.5 hover:shadow-soft sm:rounded-[1.85rem] sm:p-7"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-[#0c0c0e] text-white">
                  <model.icon className="size-4" />
                </span>
                <span className="rounded-full bg-[#f4f5f8] px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                  {model.badge}
                </span>
              </div>
              <h3 className="mt-6 font-heading text-xl font-semibold tracking-tight">{model.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{model.text}</p>
              <ul className="mt-6 space-y-2.5 border-t border-black/[0.06] pt-5">
                {model.points.map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-sm">
                    <BadgeCheck className="size-3.5 shrink-0 text-muted-foreground" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Talent intelligence */}
      <section className="container-shell pb-16 sm:pb-24">
        <div className="grid overflow-hidden rounded-[1.7rem] bg-white shadow-soft sm:rounded-[2.1rem] lg:grid-cols-2">
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
            <Eyebrow>Talent intelligence</Eyebrow>
            <h2 className="mt-4 font-heading text-[1.85rem] font-semibold tracking-tight sm:text-[2.4rem]">
              A living map of India’s specialist talent.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground sm:text-[15px]">
              Every desk maintains market notes — compensation bands, competitor moves, and passive candidates ready for the right brief.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5">
              {[
                { icon: Globe2, label: "Cities covered", value: "28+" },
                { icon: Target, label: "Active pipelines", value: "140" },
                { icon: Fingerprint, label: "Verified profiles", value: "18k" },
                { icon: Compass, label: "Avg. time-to-shortlist", value: "9d" },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.2rem] bg-[#f4f5f8] p-4 sm:rounded-[1.35rem] sm:p-5">
                  <item.icon className="size-4 text-muted-foreground" />
                  <p className="mt-4 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">{item.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[280px] sm:min-h-[400px]">
            <Image
              src={HOME_MEDIA.network}
              alt="Talent network collaboration"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute right-5 bottom-5 left-5 rounded-2xl bg-white/95 p-4 backdrop-blur sm:right-8 sm:bottom-8 sm:left-8 sm:p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-black text-white">
                  <Search className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">Live search pulse</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">12 retained mandates · 4 closing this week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stories with portraits */}
      <section className="bg-[#0c0c0e] py-14 text-white sm:py-20">
        <div className="container-shell">
          <SectionHeading
            light
            title="Voices from the network"
            subtitle="Demo stories from candidates and hiring leaders."
          />
          <div className="grid gap-4 md:grid-cols-3 md:gap-6">
            {testimonials.map((item, index) => (
              <blockquote
                key={item.id}
                className="overflow-hidden rounded-[1.55rem] border border-white/8 bg-white/[0.03] sm:rounded-[1.85rem]"
              >
                <div className="relative h-48 sm:h-56">
                  <Image
                    src={HOME_MEDIA.portraits[index] ?? HOME_MEDIA.portraits[0]}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent" />
                </div>
                <div className="p-6 sm:p-7">
                  <p className="text-[15px] leading-7 text-white/80">“{item.quote}”</p>
                  <footer className="mt-6">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="mt-1 text-xs text-white/40">{item.role}</p>
                  </footer>
                </div>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Resources with covers */}
      <section className="container-shell py-14 sm:py-20">
        <SectionHeading
          title="Insights & career notes"
          action={
            <Link href="/career-resources" className="text-sm font-medium">
              Browse all
            </Link>
          }
        />
        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {articles.map((article, index) => (
            <Link
              key={article.slug}
              href={`/career-resources/${article.slug}`}
              className="group overflow-hidden rounded-[1.55rem] bg-white shadow-soft sm:rounded-[1.85rem]"
            >
              <div className="relative h-44 overflow-hidden sm:h-52">
                <Image
                  src={HOME_MEDIA.articles[index] ?? HOME_MEDIA.articles[0]}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                  {article.category}
                </p>
                <h3 className="mt-3 font-heading text-lg font-semibold tracking-tight">{article.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{article.excerpt}</p>
                <p className="mt-5 text-xs text-muted-foreground">
                  {article.readTime} · {article.date}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Hiring CTA with image */}
      <section className="container-shell pb-12 sm:pb-16">
        <div className="relative isolate overflow-hidden rounded-[1.7rem] text-white sm:rounded-[2.2rem]">
          <Image
            src={HOME_MEDIA.hiringDesk}
            alt="Corporate headquarters"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#070709]/78" />
          <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:gap-12 lg:p-14">
            <div className="flex flex-col justify-center">
              <Eyebrow light>For hiring teams</Eyebrow>
              <h2 className="mt-4 font-heading text-[1.9rem] font-semibold tracking-tight sm:text-4xl">
                Looking for exceptional talent?
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-white/60 sm:text-[15px]">
                Submit a hiring requirement without creating an account. A HIREORA consultant will respond personally.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1.5 text-xs text-white/75 sm:text-sm">
                  <BadgeCheck className="size-4" /> Confidential by default
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1.5 text-xs text-white/75 sm:text-sm">
                  <Briefcase className="size-4" /> No public listing required
                </span>
              </div>
            </div>
            <form
              className="grid gap-2.5 rounded-[1.35rem] bg-white p-4 text-foreground sm:gap-3 sm:rounded-[1.75rem] sm:p-5"
              onSubmit={(e) => {
                e.preventDefault();
                addLead(lead);
                setLead({
                  companyName: "",
                  contactName: "",
                  email: "",
                  phone: "",
                  hiringNeed: "",
                  roles: "",
                  location: "",
                });
              }}
            >
              <IconField
                icon={Building2}
                required
                placeholder="Company name"
                value={lead.companyName}
                onChange={(e) => setLead({ ...lead, companyName: e.target.value })}
              />
              <IconField
                icon={User}
                required
                placeholder="Your name"
                value={lead.contactName}
                onChange={(e) => setLead({ ...lead, contactName: e.target.value })}
              />
              <IconField
                icon={Mail}
                required
                type="email"
                placeholder="Work email"
                value={lead.email}
                onChange={(e) => setLead({ ...lead, email: e.target.value })}
              />
              <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                <IconField
                  icon={Phone}
                  required
                  placeholder="Phone"
                  value={lead.phone}
                  onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                />
                <IconField
                  icon={MapPin}
                  placeholder="Location"
                  value={lead.location}
                  onChange={(e) => setLead({ ...lead, location: e.target.value })}
                />
              </div>
              <IconField
                icon={Briefcase}
                placeholder="Roles to hire"
                value={lead.roles}
                onChange={(e) => setLead({ ...lead, roles: e.target.value })}
              />
              <IconField
                icon={ClipboardList}
                required
                placeholder="Hiring need"
                value={lead.hiringNeed}
                onChange={(e) => setLead({ ...lead, hiringNeed: e.target.value })}
              />
              <Button type="submit" className="mt-1 h-12 w-full rounded-full">
                Request a consultant
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-shell pb-12 sm:pb-16">
        <div className="flex flex-col items-stretch gap-5 overflow-hidden rounded-[1.6rem] bg-white shadow-soft sm:flex-row sm:items-center sm:rounded-[2rem]">
          <div className="relative hidden h-full min-h-[160px] w-full sm:block sm:w-[42%] sm:min-h-[180px]">
            <Image
              src={HOME_MEDIA.candidatePath}
              alt="Professional portrait"
              fill
              sizes="40vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h3 className="font-heading text-xl font-semibold sm:text-2xl">Ready for your next chapter?</h3>
              <p className="mt-1 text-sm text-muted-foreground">Create a free profile and let the right search find you.</p>
            </div>
            <Link
              href="/register?role=candidate"
              className={cn(buttonVariants(), "h-12 w-full shrink-0 justify-center rounded-full px-6 sm:w-auto")}
            >
              <Upload className="mr-2 size-4" /> Upload resume
            </Link>
          </div>
        </div>
      </section>

      {/* Trusted by — bottom */}
      <section className="pb-16 sm:pb-24">
        <div className="container-shell">
          <div className="overflow-hidden rounded-[1.7rem] bg-[#0c0c0e] text-white sm:rounded-[2.25rem]">
            <div className="border-b border-white/8 px-6 pt-9 pb-8 sm:px-10 sm:pt-12 sm:pb-10 lg:px-12">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <Eyebrow light>Trusted by</Eyebrow>
                  <h2 className="mt-4 font-heading text-[clamp(2rem,5.5vw,3.6rem)] leading-[1.05] font-semibold tracking-tight">
                    Organisations that trust HIREORA with their hardest hires.
                  </h2>
                  <p className="mt-4 max-w-lg text-sm leading-7 text-white/50 sm:text-[15px]">
                    From product-led startups to national enterprises — confidential mandates across technology, finance, healthcare and operations.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:text-right">
                  <div>
                    <p className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                      <Counter value={stats.companiesHiring} />
                    </p>
                    <p className="mt-1 text-[11px] tracking-[0.16em] text-white/35 uppercase">Hiring partners</p>
                  </div>
                  <div>
                    <p className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                      <Counter value={stats.successfulPlacements} suffix="%" />
                    </p>
                    <p className="mt-1 text-[11px] tracking-[0.16em] text-white/35 uppercase">Offer acceptance</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-px bg-white/8 sm:grid-cols-2 lg:grid-cols-4">
              {companies.slice(0, 8).map((company) => (
                <Link
                  key={company.id}
                  href={`/companies`}
                  className="group flex min-h-[148px] flex-col justify-between bg-[#0c0c0e] p-5 transition hover:bg-white/[0.04] sm:min-h-[168px] sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <CompanyMark
                      name={company.name}
                      color={company.logoColor}
                      size="md"
                      className="ring-0 ring-offset-0"
                    />
                    {company.verified ? (
                      <span className="inline-flex items-center gap-1 text-[10px] tracking-[0.14em] text-white/35 uppercase">
                        <BadgeCheck className="size-3.5" /> Verified
                      </span>
                    ) : null}
                  </div>
                  <div>
                    <p className="font-heading text-base font-semibold tracking-tight transition group-hover:text-white sm:text-lg">
                      {company.name}
                    </p>
                    <p className="mt-1 text-xs text-white/40 sm:text-sm">
                      {company.industry} · {company.location}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="overflow-hidden border-t border-white/8 py-5">
              <div className="trust-marquee gap-10 px-6 sm:gap-14 sm:px-10">
                {[...companies, ...companies].map((company, index) => (
                  <span
                    key={`${company.id}-${index}`}
                    className="inline-flex shrink-0 items-center gap-3 text-sm whitespace-nowrap text-white/35"
                  >
                    <span
                      className="size-1.5 rounded-full"
                      style={{ background: company.logoColor }}
                    />
                    {company.name}
                    <span className="text-white/15">/</span>
                    {company.employees} team
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
