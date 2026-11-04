import Link from "next/link";
import { UserCheck } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { btnPrimary } from "@/lib/ui";

export default function PermanentStaffingPage() {
  return (
    <div className="container-shell max-w-3xl py-16">
      <IconOrb icon={UserCheck} />
      <p className="mt-5 text-[12px] font-medium tracking-[0.16em] text-muted-foreground uppercase">Recruitment services</p>
      <h1 className="mt-2 font-heading text-4xl font-semibold sm:text-5xl">Permanent staffing</h1>
      <p className="mt-4 text-lg leading-8 text-muted-foreground">
        We run role intake, market mapping, structured interviews and offer management for full-time hires across India.
      </p>
      <ul className="mt-8 space-y-3 rounded-[1.85rem] bg-white p-6 text-sm leading-6 shadow-soft">
        <li>Specialist and mid-management searches</li>
        <li>Skill, experience and location matching with recruiter review</li>
        <li>Replacement support on agreed terms</li>
      </ul>
      <Link href="/contact" className={`${btnPrimary} mt-8`}>
        Request this service
      </Link>
    </div>
  );
}
