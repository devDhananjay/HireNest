"use client";

import { use } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { CompanyMark } from "@/components/jobs/company-mark";
import { JobCard } from "@/components/jobs/job-card";
import { Badge } from "@/components/ui/badge";
import { btnPrimary } from "@/lib/ui";
import { useDemo } from "@/lib/store";

export default function CompanyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { companies, jobs } = useDemo();
  const company = companies.find((item) => item.slug === slug);
  const openJobs = company
    ? jobs.filter((job) => job.companyId === company.id && job.status === "active")
    : [];

  if (!company) {
    return (
      <div className="container-shell py-20">
        <EmptyState
          title="Company not found"
          description="That employer page is unavailable or the link is outdated."
          action={
            <Link href="/companies" className={btnPrimary}>
              Browse companies
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-shell py-12">
      <div className="rounded-[2rem] bg-white p-8 shadow-soft sm:p-10">
        <div className="flex flex-wrap items-start gap-5">
          <CompanyMark name={company.name} color={company.logoColor} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-3xl font-semibold sm:text-4xl">{company.name}</h1>
              {company.verified ? <Badge>Verified</Badge> : <Badge variant="outline">Pending</Badge>}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {company.industry} · {company.employees} · Founded {company.founded}
            </p>
            <p className="mt-3 inline-flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-4" /> {company.location}
            </p>
            {company.website ? (
              <a href={company.website} target="_blank" rel="noreferrer" className="mt-2 block text-sm font-medium hover:underline">
                {company.website.replace(/^https?:\/\//, "")}
              </a>
            ) : null}
          </div>
        </div>
        <p className="mt-8 max-w-3xl text-base leading-7 text-muted-foreground">{company.about}</p>
      </div>

      <div className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-semibold">Open roles</h2>
            <p className="mt-1 text-sm text-muted-foreground">{openJobs.length} live vacancies on HIREORA</p>
          </div>
          <Link href="/jobs" className="text-sm font-medium hover:underline">
            All jobs
          </Link>
        </div>
        {openJobs.length ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {openJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState title="No open roles right now" description="Check back soon or browse the full job board." />
          </div>
        )}
      </div>
    </div>
  );
}
