import Link from "next/link";
import { Briefcase, ClipboardList, Lock } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { btnOutline, btnPrimary } from "@/lib/ui";

const features = [
  { title: "Post & manage jobs", text: "Control live, pending and expired vacancies.", icon: Briefcase },
  { title: "Review applications", text: "Shortlist, reject and schedule interviews.", icon: ClipboardList },
  { title: "Confidential search", text: "No public listing required for leadership roles.", icon: Lock },
];

export default function ForEmployersPage() {
  return (
    <div className="container-shell py-16">
      <p className="text-[12px] font-medium tracking-[0.16em] text-muted-foreground uppercase">Employers</p>
      <h1 className="mt-3 max-w-3xl font-heading text-4xl font-semibold sm:text-5xl">
        Hire with the judgement of a consultancy and the speed of a product.
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
        Post jobs, search candidates, or hand the mandate to a HIREORA recruiter. Candidate registration stays free; employer packages can be introduced later.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/register?role=employer" className={btnPrimary}>
          Create employer account
        </Link>
        <Link href="/contact" className={btnOutline}>
          Request a recruiter
        </Link>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {features.map((item) => (
          <div key={item.title} className="rounded-[1.85rem] bg-white p-7 shadow-soft">
            <IconOrb icon={item.icon} />
            <h2 className="mt-5 font-heading text-xl font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
