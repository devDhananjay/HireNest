"use client";

import { Building2 } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/store";

export default function AdminCompaniesPage() {
  const { companies, approveCompany } = useDemo();
  return (
    <div>
      <PageHeader title="Companies" description="Verify employer accounts before they post live roles." />
      <div className="space-y-4">
        {companies.map((company) => (
          <article key={company.id} className="flex flex-wrap items-center justify-between gap-4 rounded-[1.85rem] bg-white p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <IconOrb icon={Building2} />
              <div>
                <h2 className="font-heading font-semibold">{company.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {company.industry} · {company.location}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={company.verified ? "default" : "outline"}>{company.verified ? "Verified" : "Pending"}</Badge>
              <Button size="sm" className="rounded-full" onClick={() => approveCompany(company.id, !company.verified)}>
                {company.verified ? "Unverify" : "Verify"}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
