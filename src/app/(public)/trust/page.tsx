import type { Metadata } from "next";
import Link from "next/link";
import { FileLock2, ShieldCheck, Trash2, UserCheck, EyeOff, Building2 } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { btnOnDark, btnOutline, btnPrimaryOnDark } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Trust & confidentiality",
  description: "How HIREORA handles NDAs, resume access, employer verification and DPDP-aligned deletion.",
};

const pillars = [
  {
    title: "NDA-first outreach",
    text: "Silent and retained searches stay off the public board. Peer outreach happens under confidentiality agreements — never as a social blast.",
    icon: EyeOff,
  },
  {
    title: "Resume access model",
    text: "Resumes are stored privately and served through authenticated download routes. Open attachment links are not part of the product.",
    icon: FileLock2,
  },
  {
    title: "Verified employers",
    text: "New employer accounts start unverified. Admin review sits between company signup and public hiring presence.",
    icon: Building2,
  },
  {
    title: "Role-based rooms",
    text: "Candidates, employers, recruiters and admins see only the pipeline, documents and decisions that belong to their role.",
    icon: UserCheck,
  },
  {
    title: "DPDP-aligned deletion",
    text: "Account holders can request deletion. We anonymise personal data and remove stored resumes through a tracked request flow.",
    icon: Trash2,
  },
  {
    title: "Audit-friendly settings",
    text: "WhatsApp nudges, auto follow-ups and digests are gated in Admin settings — so automation never runs darker than your policy.",
    icon: ShieldCheck,
  },
];

export default function TrustPage() {
  return (
    <div className="relative overflow-hidden pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[22rem] bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.95),_transparent_55%),linear-gradient(180deg,#eceef3_0%,transparent_100%)]"
      />
      <div className="container-shell relative pt-14 sm:pt-16">
        <p className="text-[12px] font-medium tracking-[0.16em] text-muted-foreground uppercase">Trust</p>
        <h1 className="mt-3 max-w-3xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Discretion is part of the product.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
          Premium hiring is quiet. HIREORA is built so confidentiality, verified employers and data rights are visible —
          not buried in fine print alone.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {pillars.map((item) => (
            <div key={item.title} className="rounded-[1.85rem] bg-white p-7 shadow-soft">
              <IconOrb icon={item.icon} />
              <h2 className="mt-5 font-heading text-xl font-semibold tracking-tight">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-6 rounded-[2rem] bg-black p-8 text-white shadow-lift lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
          <div>
            <h2 className="font-heading text-3xl font-semibold tracking-tight">Need a silent mandate?</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/60">
              Leadership replacements and sensitive searches never require a public listing. Brief a consultant; we map
              the market quietly.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/contact" className={btnPrimaryOnDark}>
                Request confidential search
              </Link>
              <Link href="/privacy-policy" className={btnOnDark}>
                Privacy policy
              </Link>
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 text-sm leading-7 text-white/65">
            <p className="font-medium text-white">What we never do</p>
            <ul className="mt-3 space-y-2">
              <li>Publish a confidential search without written consent</li>
              <li>Share resumes outside authenticated employer/recruiter rooms</li>
              <li>Sell candidate data to third-party marketers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
