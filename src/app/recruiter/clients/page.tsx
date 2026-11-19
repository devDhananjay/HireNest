"use client";

import { Building2, Inbox } from "lucide-react";
import { CompanyMark } from "@/components/jobs/company-mark";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { NativeSelect } from "@/components/ui/native-select";
import { useDemo } from "@/lib/store";

export default function RecruiterClientsPage() {
  const { companies, leads, clients, updateLeadStatus } = useDemo();
  const openLeads = leads.filter((lead) => lead.status !== "Closed").length;

  return (
    <div>
      <PageHeader title="Clients & leads" description="Hiring requirements captured without an employer account appear here." />
      <div className="mb-8 grid gap-5 sm:grid-cols-2">
        <StatCard label="Active clients" value={clients.length} icon={Building2} />
        <StatCard label="Open leads" value={openLeads} icon={Inbox} />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {clients.map((client) => {
          const company = companies.find((c) => c.id === client.companyId);
          return (
            <article key={client.id} className="rounded-[1.85rem] bg-white p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <CompanyMark name={company?.name ?? "Co"} color={company?.logoColor ?? "#111111"} className="ring-[#f3f4f8]" />
                <div>
                  <h2 className="font-heading font-semibold">{company?.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    Owner {client.accountOwner} · SLA {client.sla}
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                  <span>{client.openRoles} open roles</span>
                  <span>{company?.verified ? "Verified" : "Pending"}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#f4f5f8]">
                  <div className="h-full rounded-full bg-black" style={{ width: `${Math.min(100, client.openRoles * 18)}%` }} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <h2 className="mt-10 font-heading text-xl font-semibold">Inbound leads</h2>
      <div className="mt-5 space-y-4">
        {leads.map((lead) => (
          <article key={lead.id} className="rounded-[1.85rem] bg-white p-6 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <CompanyMark name={lead.companyName} color="#111111" className="ring-[#f3f4f8]" />
                <div>
                  <h3 className="font-heading font-semibold">{lead.companyName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {lead.roles} · {lead.location}
                  </p>
                </div>
              </div>
              <Badge>{lead.status}</Badge>
            </div>
            <p className="mt-4 text-sm leading-6">{lead.hiringNeed}</p>
            <NativeSelect
              className="mt-4 h-11 w-48 rounded-full"
              value={lead.status}
              onChange={(e) => updateLeadStatus(lead.id, e.target.value as typeof lead.status)}
            >
              <option>New</option>
              <option>In Review</option>
              <option>Assigned</option>
              <option>Closed</option>
            </NativeSelect>
          </article>
        ))}
      </div>
    </div>
  );
}
