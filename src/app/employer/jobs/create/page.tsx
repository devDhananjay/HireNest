"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileText } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { CATEGORIES, LOCATIONS } from "@/lib/constants";
import { useDemo } from "@/lib/store";
import type { EmploymentType, WorkMode } from "@/lib/types";

export default function CreateJobPage() {
  const router = useRouter();
  const { session, companies, createJob } = useDemo();
  const companyId = session?.companyId ?? companies[0]?.id;
  const [form, setForm] = useState({
    title: "",
    department: "",
    category: "IT & Software",
    description: "",
    skills: "React, TypeScript",
    location: "Bengaluru",
    employmentType: "Full-time" as EmploymentType,
    workMode: "Hybrid" as WorkMode,
    experienceMin: 2,
    experienceMax: 5,
    salaryMin: 1000000,
    salaryMax: 1800000,
    openings: 1,
    deadline: "2026-12-31",
  });

  return (
    <div className="max-w-3xl">
      <PageHeader title="Post a job" description="New vacancies go to admin for approval in this demo." />
      <form
        className="space-y-5 rounded-[1.85rem] bg-white p-7 shadow-soft"
        onSubmit={(e) => {
          e.preventDefault();
          createJob({
            ...form,
            companyId,
            skills: form.skills.split(",").map((s) => s.trim()),
            responsibilities: ["To be refined with hiring manager"],
            requirements: ["See skills and experience range"],
          });
          router.push("/employer/jobs");
        }}
      >
        <div className="flex items-center gap-3">
          <IconOrb icon={FileText} />
          <p className="text-sm text-muted-foreground">Clear titles and ranges convert better.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Job title">
            <Input required placeholder="Senior Product Designer" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label="Department">
            <Input required placeholder="Design" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          </Field>
          <Field label="Category">
            <NativeSelect value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => (
                <option key={c.slug}>{c.name}</option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Location">
            <NativeSelect value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}>
              {LOCATIONS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </NativeSelect>
          </Field>
        </div>
        <Field label="Job description">
          <Textarea required placeholder="What this person will own" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>
        <Field label="Required skills">
          <Input placeholder="Required skills" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Employment type">
            <NativeSelect value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value as EmploymentType })}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </NativeSelect>
          </Field>
          <Field label="Work mode">
            <NativeSelect value={form.workMode} onChange={(e) => setForm({ ...form, workMode: e.target.value as WorkMode })}>
              <option>On-site</option>
              <option>Hybrid</option>
              <option>Remote</option>
            </NativeSelect>
          </Field>
          <Field label="Experience min (years)">
            <Input type="number" value={form.experienceMin} onChange={(e) => setForm({ ...form, experienceMin: Number(e.target.value) })} />
          </Field>
          <Field label="Experience max (years)">
            <Input type="number" value={form.experienceMax} onChange={(e) => setForm({ ...form, experienceMax: Number(e.target.value) })} />
          </Field>
          <Field label="Salary min (INR)">
            <Input type="number" value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: Number(e.target.value) })} />
          </Field>
          <Field label="Salary max (INR)">
            <Input type="number" value={form.salaryMax} onChange={(e) => setForm({ ...form, salaryMax: Number(e.target.value) })} />
          </Field>
          <Field label="Openings">
            <Input type="number" value={form.openings} onChange={(e) => setForm({ ...form, openings: Number(e.target.value) })} />
          </Field>
          <Field label="Deadline">
            <Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </Field>
        </div>
        <Button type="submit" className="h-11 rounded-full">
          Submit for review
        </Button>
      </form>
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
