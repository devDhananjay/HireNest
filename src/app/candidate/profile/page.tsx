"use client";

import { useEffect, useState } from "react";
import { FileText, UserRound } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDemo } from "@/lib/store";

export default function CandidateProfilePage() {
  const { session, candidateByUserId, updateCandidate } = useDemo();
  const candidate = session ? candidateByUserId(session.id) : undefined;
  const [form, setForm] = useState({
    name: candidate?.name ?? "",
    phone: candidate?.phone ?? "",
    location: candidate?.location ?? "",
    currentTitle: candidate?.currentTitle ?? "",
    expectedSalary: String(candidate?.expectedSalary ?? ""),
    noticePeriod: candidate?.noticePeriod ?? "",
    linkedin: candidate?.linkedin ?? "",
    skills: candidate?.skills.join(", ") ?? "",
    resumeName: candidate?.resumeName ?? "",
  });

  useEffect(() => {
    if (!candidate) return;
    setForm({
      name: candidate.name,
      phone: candidate.phone,
      location: candidate.location,
      currentTitle: candidate.currentTitle,
      expectedSalary: String(candidate.expectedSalary ?? ""),
      noticePeriod: candidate.noticePeriod,
      linkedin: candidate.linkedin,
      skills: candidate.skills.join(", "),
      resumeName: candidate.resumeName,
    });
  }, [candidate]);

  if (!candidate) return <p className="text-muted-foreground">No candidate profile found.</p>;

  const skillList = form.skills.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div>
      <PageHeader title="Your profile" description="Keep this current so matching stays useful. Resumes stay private in this demo." />
      <div className="grid items-start gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <div className="rounded-[1.85rem] bg-black p-7 text-white shadow-lift">
            <p className="text-sm text-white/55">Profile completeness</p>
            <p className="mt-3 font-heading text-5xl font-semibold tracking-tight">{candidate.completeness}%</p>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-white" style={{ width: `${candidate.completeness}%` }} />
            </div>
            <p className="mt-4 text-sm text-white/55">A complete profile is shown first to recruiters in this demo.</p>
          </div>
          <div className="rounded-[1.85rem] bg-white p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <IconOrb icon={FileText} />
              <div>
                <p className="font-medium">Resume</p>
                <p className="text-sm text-muted-foreground">{form.resumeName || "No file yet"}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {skillList.slice(0, 8).map((skill) => (
                <span key={skill} className="rounded-full bg-[#f4f5f8] px-3 py-1 text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </aside>
        <form
          className="space-y-4 rounded-[1.85rem] bg-white p-7 shadow-soft"
          onSubmit={(e) => {
            e.preventDefault();
            updateCandidate(candidate.id, {
              ...form,
              expectedSalary: Number(form.expectedSalary) || 0,
              skills: skillList,
            });
          }}
        >
          <div className="flex items-center gap-3">
            <IconOrb icon={UserRound} />
            <p className="text-sm text-muted-foreground">Personal and career details</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
            </Field>
            <Field label="Phone">
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
            </Field>
            <Field label="Location">
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Current location" />
            </Field>
            <Field label="Current title">
              <Input value={form.currentTitle} onChange={(e) => setForm({ ...form, currentTitle: e.target.value })} placeholder="Current designation" />
            </Field>
            <Field label="Expected CTC (INR)">
              <Input value={form.expectedSalary} onChange={(e) => setForm({ ...form, expectedSalary: e.target.value })} placeholder="Expected CTC (INR)" />
            </Field>
            <Field label="Notice period">
              <Input value={form.noticePeriod} onChange={(e) => setForm({ ...form, noticePeriod: e.target.value })} placeholder="Notice period" />
            </Field>
          </div>
          <Field label="LinkedIn">
            <Input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} placeholder="LinkedIn URL" />
          </Field>
          <Field label="Skills">
            <Textarea value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="Skills, comma separated" />
          </Field>
          <Field label="Resume (PDF/DOC/DOCX)">
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setForm({ ...form, resumeName: e.target.files?.[0]?.name ?? form.resumeName })}
            />
            <p className="mt-2 text-xs text-muted-foreground">Stored locally in this demo. Parsing is labelled as a future capability.</p>
          </Field>
          <Button type="submit" className="h-11 rounded-full">
            Save profile
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
