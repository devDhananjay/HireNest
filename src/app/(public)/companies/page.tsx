"use client";

import Link from "next/link";
import { CompanyMark } from "@/components/jobs/company-mark";
import { Badge } from "@/components/ui/badge";
import { useDemo } from "@/lib/store";

export default function CompaniesPage() {
  const { companies, jobs } = useDemo();
  return (
    <div className="container-shell py-12">
      <p className="text-[12px] font-medium tracking-[0.16em] text-muted-foreground uppercase">Network</p>
      <h1 className="mt-2 font-heading text-4xl font-semibold sm:text-5xl">Companies hiring on HIREORA</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Browse employers on the network. Open roles update as mandates go live.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {companies.map((company) => {
          const count = jobs.filter((job) => job.companyId === company.id && job.status === "active").length;
          return (
            <article key={company.id} className="group relative hover-lift rounded-[1.85rem] bg-white p-6 shadow-soft">
              <Link
                href={`/companies/${company.slug}`}
                className="absolute inset-0 z-0 rounded-[inherit]"
                aria-label={`View ${company.name}`}
              />
              <div className="relative z-10 pointer-events-none">
                <div className="flex items-start gap-4">
                  <CompanyMark name={company.name} color={company.logoColor} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-heading text-xl font-semibold">{company.name}</h2>
                      {company.verified ? <Badge>Verified</Badge> : <Badge variant="outline">Pending</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {company.industry} · {company.location} · {company.employees}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{company.about}</p>
                <span className="mt-4 inline-block text-sm font-medium">{count} open roles</span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
