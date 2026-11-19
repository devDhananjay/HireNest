import Link from "next/link";
import { ArrowRight, Crown, Sparkles, UserCheck, Users } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { btnPrimary } from "@/lib/ui";

const services = [
  {
    href: "/services/permanent-staffing",
    title: "Permanent staffing",
    text: "Retained and contingency hiring for specialists and mid-management. From role intake and market mapping to structured interviews and offer close.",
    detail: "Best for: product, engineering, finance, healthcare ops and sales leadership.",
    icon: UserCheck,
  },
  {
    href: "/services/bulk-hiring",
    title: "Bulk hiring",
    text: "Campus, lateral and high-volume programmes with clear SLAs — shortlist turnaround, interview panels and joining dashboards for TA leaders.",
    detail: "Best for: retail networks, customer ops, fresher analyst cohorts and multi-city rollouts.",
    icon: Users,
  },
  {
    href: "/services/executive-search",
    title: "Executive search",
    text: "Confidential leadership mandates with market mapping, discreet outreach and board-ready candidate packs — without a public job post.",
    detail: "Best for: CXO, VP and critical replacement searches.",
    icon: Crown,
  },
];

export default function ServicesPage() {
  return (
    <div className="container-shell py-16">
      <p className="text-[12px] font-medium tracking-[0.16em] text-muted-foreground uppercase">Services</p>
      <h1 className="mt-2 font-heading text-4xl font-semibold sm:text-5xl">Recruitment services</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
        HIREORA supports both a public job marketplace and a consultancy operating model. Use the platform yourself, or
        bring in our recruiters when you need coverage, confidentiality or speed across India.
      </p>

      <Link
        href="/services/ai-hiring-os"
        className="group mt-10 block overflow-hidden rounded-[2rem] bg-black p-8 text-white shadow-lift sm:p-10"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.16em] text-white/50 uppercase">
              <Sparkles className="size-3.5" />
              Featured product
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">AI Hiring OS</h2>
            <p className="mt-2 text-sm text-white/50">Recruitment Automation Platform</p>
            <p className="mt-4 text-base leading-7 text-white/65">
              Resume upload builds AI profiles, JD matching ranks candidates, voice interviews screen early, WhatsApp
              keeps follow-ups warm, and clients see a live dashboard — built for agencies, HR teams and placement
              consultancies.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-sm font-medium transition group-hover:bg-white/10">
            Explore <ArrowRight className="ml-1 size-4 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {services.map((service) => (
          <Link key={service.href} href={service.href} className="hover-lift rounded-[1.85rem] bg-white p-7 shadow-soft">
            <IconOrb icon={service.icon} />
            <h2 className="mt-5 font-heading text-xl font-semibold">{service.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{service.text}</p>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">{service.detail}</p>
            <p className="mt-5 inline-flex items-center text-sm font-medium">
              Learn more <ArrowRight className="ml-1 size-4" />
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-16 max-w-3xl space-y-4 text-sm leading-7 text-muted-foreground">
        <h2 className="font-heading text-2xl font-semibold text-foreground">What engagement looks like</h2>
        <p>
          We agree a scorecard, communication cadence and success metrics up front. Weekly updates cover pipeline
          stages, drop-off reasons and compensation feedback from the market. For employer accounts on the platform,
          status history and interview scheduling stay visible to your team in real time.
        </p>
        <p>
          Packages can be scoped as contingency, retained search, or a hybrid. Enterprise retainers cover multi-role
          programmes with a dedicated account owner and SLA — available as Razorpay job packages from the employer desk.
        </p>
      </section>

      <Link href="/contact" className={`${btnPrimary} mt-10`}>
        Talk to a consultant
      </Link>
    </div>
  );
}
