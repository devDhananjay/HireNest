"use client";

import { useEffect, useState } from "react";
import { FileText, Plus, Trash2, UserRound } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDemo } from "@/lib/store";
import type { Education, Experience } from "@/lib/types";

function emptyEducation(): Education {
  return { id: `edu-${crypto.randomUUID().slice(0, 6)}`, school: "", degree: "", field: "", year: "" };
}

function emptyExperience(): Experience {
  return { id: `exp-${crypto.randomUUID().slice(0, 6)}`, company: "", title: "", start: "", end: "", summary: "" };
}

export default function CandidateProfilePage() {
  const { session, candidateByUserId, updateCandidate, uploadResume } = useDemo();
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
    resumeUrl: candidate?.resumeUrl ?? "",
    education: candidate?.education ?? [],
    experience: candidate?.experience ?? [],
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
      resumeUrl: candidate.resumeUrl ?? "",
      education: candidate.education,
      experience: candidate.experience,
    });
  }, [candidate]);

  if (!candidate) return <p className="text-muted-foreground">No candidate profile found.</p>;

  const skillList = form.skills.split(",").map((s) => s.trim()).filter(Boolean);

  async function readResume(file: File | undefined) {
    if (!file) return;
    setForm((prev) => ({ ...prev, resumeName: file.name }));
    try {
      await uploadResume(file);
    } catch {
      /* toast handled in store */
    }
  }

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
            <p className="mt-4 text-sm text-white/55">Education, experience and resume lift your score for recruiters.</p>
          </div>
          <div className="rounded-[1.85rem] bg-white p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <IconOrb icon={FileText} />
              <div>
                <p className="font-medium">Resume</p>
                <p className="text-sm text-muted-foreground">{form.resumeName || "No file yet"}</p>
              </div>
            </div>
            {form.resumeUrl ? (
              <a
                href={form.resumeUrl}
                download={form.resumeName || "resume"}
                className="mt-4 inline-flex text-sm font-medium hover:underline"
              >
                Download stored file
              </a>
            ) : null}
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
          className="space-y-6 rounded-[1.85rem] bg-white p-7 shadow-soft"
          onSubmit={(e) => {
            e.preventDefault();
            updateCandidate(candidate.id, {
              name: form.name,
              phone: form.phone,
              location: form.location,
              currentTitle: form.currentTitle,
              expectedSalary: Number(form.expectedSalary) || 0,
              noticePeriod: form.noticePeriod,
              linkedin: form.linkedin,
              skills: skillList,
              resumeName: form.resumeName,
              resumeUrl: form.resumeUrl || undefined,
              education: form.education.filter((row) => row.school || row.degree),
              experience: form.experience.filter((row) => row.company || row.title),
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
            <Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => void readResume(e.target.files?.[0])} />
            <p className="mt-2 text-xs text-muted-foreground">
              Stored privately on the server (or S3/R2 when configured). AI parsing remains a later capability.
            </p>
          </Field>

          <section className="space-y-3 border-t border-[#eef0f4] pt-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-heading text-lg font-semibold">Education</h2>
              <Button type="button" variant="outline" className="h-9 rounded-full" onClick={() => setForm({ ...form, education: [...form.education, emptyEducation()] })}>
                <Plus className="size-4" /> Add
              </Button>
            </div>
            {form.education.length ? (
              form.education.map((row, index) => (
                <div key={row.id} className="grid gap-3 rounded-2xl bg-[#f7f8fb] p-4 sm:grid-cols-2">
                  <Input placeholder="School / college" value={row.school} onChange={(e) => {
                    const education = [...form.education];
                    education[index] = { ...row, school: e.target.value };
                    setForm({ ...form, education });
                  }} />
                  <Input placeholder="Degree" value={row.degree} onChange={(e) => {
                    const education = [...form.education];
                    education[index] = { ...row, degree: e.target.value };
                    setForm({ ...form, education });
                  }} />
                  <Input placeholder="Field" value={row.field} onChange={(e) => {
                    const education = [...form.education];
                    education[index] = { ...row, field: e.target.value };
                    setForm({ ...form, education });
                  }} />
                  <div className="flex gap-2">
                    <Input placeholder="Year" value={row.year} onChange={(e) => {
                      const education = [...form.education];
                      education[index] = { ...row, year: e.target.value };
                      setForm({ ...form, education });
                    }} />
                    <Button type="button" variant="outline" className="h-11 shrink-0 rounded-full px-3" onClick={() => setForm({ ...form, education: form.education.filter((item) => item.id !== row.id) })}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Add at least one education entry to improve completeness.</p>
            )}
          </section>

          <section className="space-y-3 border-t border-[#eef0f4] pt-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-heading text-lg font-semibold">Experience</h2>
              <Button type="button" variant="outline" className="h-9 rounded-full" onClick={() => setForm({ ...form, experience: [...form.experience, emptyExperience()] })}>
                <Plus className="size-4" /> Add
              </Button>
            </div>
            {form.experience.length ? (
              form.experience.map((row, index) => (
                <div key={row.id} className="space-y-3 rounded-2xl bg-[#f7f8fb] p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input placeholder="Company" value={row.company} onChange={(e) => {
                      const experience = [...form.experience];
                      experience[index] = { ...row, company: e.target.value };
                      setForm({ ...form, experience });
                    }} />
                    <Input placeholder="Title" value={row.title} onChange={(e) => {
                      const experience = [...form.experience];
                      experience[index] = { ...row, title: e.target.value };
                      setForm({ ...form, experience });
                    }} />
                    <Input placeholder="Start (e.g. 2022)" value={row.start} onChange={(e) => {
                      const experience = [...form.experience];
                      experience[index] = { ...row, start: e.target.value };
                      setForm({ ...form, experience });
                    }} />
                    <div className="flex gap-2">
                      <Input placeholder="End (or Present)" value={row.end} onChange={(e) => {
                        const experience = [...form.experience];
                        experience[index] = { ...row, end: e.target.value };
                        setForm({ ...form, experience });
                      }} />
                      <Button type="button" variant="outline" className="h-11 shrink-0 rounded-full px-3" onClick={() => setForm({ ...form, experience: form.experience.filter((item) => item.id !== row.id) })}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <Textarea placeholder="Summary" value={row.summary} onChange={(e) => {
                    const experience = [...form.experience];
                    experience[index] = { ...row, summary: e.target.value };
                    setForm({ ...form, experience });
                  }} />
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Add experience so match scores use your background.</p>
            )}
          </section>

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
