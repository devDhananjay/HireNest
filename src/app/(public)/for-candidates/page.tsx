import Link from "next/link";
import { BadgeCheck, Calendar, FileUp, Search, UserRound } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { btnOutline, btnPrimary } from "@/lib/ui";

const steps = [
  { label: "Profile", icon: UserRound },
  { label: "Resume", icon: FileUp },
  { label: "Explore", icon: Search },
  { label: "Interview", icon: Calendar },
  { label: "Offer", icon: BadgeCheck },
];

export default function ForCandidatesPage() {
  return (
    <div className="container-shell py-16">
      <p className="text-[12px] font-medium tracking-[0.16em] text-muted-foreground uppercase">Candidates</p>
      <h1 className="mt-3 max-w-3xl font-heading text-4xl font-semibold sm:text-5xl">A calmer way to find work that fits.</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
        Create a profile, upload your resume, track every application, and see interviews in one place. Basic job applications are free.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/register?role=candidate" className={btnPrimary}>
          Create free profile
        </Link>
        <Link href="/jobs" className={btnOutline}>
          Browse jobs
        </Link>
      </div>
      <ol className="mt-14 grid gap-6 md:grid-cols-5">
        {steps.map((step, i) => (
          <li key={step.label} className="rounded-[1.85rem] bg-white p-6 text-center shadow-soft">
            <div className="flex justify-center">
              <IconOrb icon={step.icon} />
            </div>
            <p className="mt-4 text-xs tracking-[0.16em] text-muted-foreground uppercase">Step {i + 1}</p>
            <p className="mt-2 font-heading font-semibold">{step.label}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
