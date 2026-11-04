import Link from "next/link";
import { Users } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { btnPrimary } from "@/lib/ui";

export default function BulkHiringPage() {
  return (
    <div className="container-shell max-w-3xl py-16">
      <IconOrb icon={Users} />
      <p className="mt-5 text-[12px] font-medium tracking-[0.16em] text-muted-foreground uppercase">Recruitment services</p>
      <h1 className="mt-2 font-heading text-4xl font-semibold sm:text-5xl">Bulk hiring</h1>
      <p className="mt-4 text-lg leading-8 text-muted-foreground">
        High-volume hiring for operations, sales, customer support and graduate programmes without lowering the bar.
      </p>
      <ul className="mt-8 space-y-3 rounded-[1.85rem] bg-white p-6 text-sm leading-6 shadow-soft">
        <li>Campus, lateral and walk-in programmes with weekly SLAs</li>
        <li>Structured assessments so volume does not dilute quality</li>
        <li>On-ground and remote coordination across Indian cities</li>
      </ul>
      <Link href="/contact" className={`${btnPrimary} mt-8`}>
        Talk to a programme lead
      </Link>
    </div>
  );
}
