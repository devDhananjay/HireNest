"use client";

import { useEffect, useState } from "react";
import { Building2, Factory, Globe, MapPin, Users } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { CompanyMark } from "@/components/jobs/company-mark";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconField, IconTextarea } from "@/components/ui/icon-field";
import { useDemo } from "@/lib/store";

const LOGO_COLORS = ["#111111", "#101D35", "#3157D5", "#F4A340", "#0F766E", "#7C2D12"];

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
    logoColor: company?.logoColor ?? "#111111",
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
      logoColor: company.logoColor,
    });
  }, [company]);

  if (!company) return <p className="text-muted-foreground">No company profile found.</p>;

  return (
    <div>
      <PageHeader
        title="Company profile"
        description="Update how candidates see your company. Verification is managed by HIREORA admin before listings carry a verified badge."
      />
      <div className="grid items-start gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <div className="rounded-[1.85rem] bg-black p-7 text-white shadow-lift">
            <CompanyMark name={form.name || company.name} color={form.logoColor} size="lg" className="ring-white/10" />
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
              <IconField icon={Building2} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Industry">
              <IconField icon={Factory} value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
            </Field>
            <Field label="Location">
              <IconField icon={MapPin} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </Field>
            <Field label="Employees">
              <IconField icon={Users} value={form.employees} onChange={(e) => setForm({ ...form, employees: e.target.value })} />
            </Field>
          </div>
          <Field label="Website">
            <IconField icon={Globe} value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          </Field>
          <Field label="About">
            <IconTextarea icon={Building2} value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} />
          </Field>
          <Field label="Logo mark colour">
            <div className="flex flex-wrap items-center gap-2">
              {LOGO_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={`Use logo colour ${color}`}
                  onClick={() => setForm({ ...form, logoColor: color })}
                  className="size-9 rounded-full ring-2 ring-offset-2 transition"
                  style={{
                    background: color,
                    boxShadow: form.logoColor === color ? "0 0 0 2px #111" : undefined,
                  }}
                />
              ))}
              <Input
                type="color"
                value={form.logoColor}
                onChange={(e) => setForm({ ...form, logoColor: e.target.value })}
                className="h-11 w-16 cursor-pointer p-1"
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Brand mark colour for your company tile. Logo upload lands with private object storage.</p>
          </Field>
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
