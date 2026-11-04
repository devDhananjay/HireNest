import Link from "next/link";
import { Crown } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { btnPrimary } from "@/lib/ui";

export default function ExecutiveSearchPage() {
  return (
    <div className="container-shell max-w-3xl py-16">
      <IconOrb icon={Crown} />
      <p className="mt-5 text-[12px] font-medium tracking-[0.16em] text-muted-foreground uppercase">Recruitment services</p>
      <h1 className="mt-2 font-heading text-4xl font-semibold sm:text-5xl">Executive search</h1>
      <p className="mt-4 text-lg leading-8 text-muted-foreground">
        Discreet leadership hiring with mapped markets, referencing and a dedicated search partner.
      </p>
      <ul className="mt-8 space-y-3 rounded-[1.85rem] bg-white p-6 text-sm leading-6 shadow-soft">
        <li>Confidential CXO and VP mandates</li>
        <li>Market mapping, longlists and referenced shortlists</li>
        <li>Offer close support without a public job listing</li>
      </ul>
      <Link href="/contact" className={`${btnPrimary} mt-8`}>
        Start a confidential mandate
      </Link>
    </div>
  );
}
