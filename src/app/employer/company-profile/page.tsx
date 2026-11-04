"use client";

import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { CompanyMark } from "@/components/jobs/company-mark";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDemo } from "@/lib/store";

export default function CompanyProfilePage() {
  const { session, companies, updateCompany } = useDemo();
  const company = companies.find((item) => item.id === session?.companyId) ?? companies[0];
  const [form, setForm] = useState({
    name: company?.name ?? "",
    industry: company?.industry ?? "",
    location: company?.location ?? "",
    website: company?.website ?? "",
    about: company?.about ?? "",
    employees: company?.employees ?? "",
  });

  useEffect(() => {
    if (!company) return;
    setForm({
      name: company.name,
      industry: company.industry,
      location: company.location,
      website: company.website,
      about: company.about,
      employees: company.employees,
    });
  }, [company]);

  if (!company) return <p className="text-muted-foreground">No company profile found.</p>;

  return (
    <div>
      <PageHeader title="Company profile" description="Verification is managed by HIREORA admin. Edits stay in this demo browser." />
      <div className="grid items-start gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <div className="rounded-[1.85rem] bg-black p-7 text-white shadow-lift">
            <CompanyMark name={form.name || company.name} color="#ffffff" size="lg" className="ring-white/10" />
            <h2 className="mt-5 font-heading text-2xl font-semibold">{form.name || company.name}</h2>
            <p className="mt-2 text-sm text-white/55">
              {form.industry} · {form.location}
            </p>
            <div className="mt-5">
              <Badge className="border-0 bg-white/12 text-white">{company.verified ? "Verified" : "Pending verification"}</Badge>
            </div>
          </div>
          <div className="rounded-[1.85rem] bg-white p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <IconOrb icon={Building2} />
              <div>
                <p className="font-medium">{form.employees || company.employees}</p>
                <p className="text-sm text-muted-foreground">Team size</p>
              </div>
            </div>
          </div>
        </aside>
        <form
          className="space-y-4 rounded-[1.85rem] bg-white p-7 shadow-soft"
          onSubmit={(e) => {
            e.preventDefault();
            updateCompany(company.id, form);
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company name">
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Industry">
              <Input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
            </Field>
            <Field label="Location">
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </Field>
            <Field label="Employees">
              <Input value={form.employees} onChange={(e) => setForm({ ...form, employees: e.target.value })} />
            </Field>
          </div>
          <Field label="Website">
            <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          </Field>
          <Field label="About">
            <Textarea value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} />
          </Field>
          <p className="text-xs text-muted-foreground">Logo upload is local-only in this demo. Production will use private object storage.</p>
          <Button type="submit" className="h-11 rounded-full">
            Save company profile
          </Button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-medium tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
