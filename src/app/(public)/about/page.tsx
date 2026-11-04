import type { Metadata } from "next";
import { LayoutDashboard, Sparkles, Users } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";

export const metadata: Metadata = { title: "About us" };

const pillars = [
  { title: "Consultants", text: "Specialists across IT, BFSI, healthcare, engineering, sales and operations.", icon: Users },
  { title: "Workspaces", text: "Candidate, employer, recruiter and admin rooms — each with a distinct job to do.", icon: LayoutDashboard },
  { title: "Quiet by design", text: "Less noise than a job board. More judgement than a marketplace.", icon: Sparkles },
];

export default function AboutPage() {
  return (
    <div className="container-shell py-16">
      <p className="text-[12px] font-medium tracking-[0.16em] text-muted-foreground uppercase">About HIREORA</p>
      <h1 className="mt-3 max-w-3xl font-heading text-4xl font-semibold sm:text-5xl">
        A recruitment firm built like a product company.
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
        HIREORA helps Indian organisations hire with more signal and helps professionals find roles that
        match their skills, not just their keyword trail. We combine consultancy judgement with a modern
        talent platform.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {pillars.map((item) => (
          <div key={item.title} className="rounded-[1.85rem] bg-white p-7 shadow-soft">
            <IconOrb icon={item.icon} />
            <h2 className="mt-5 font-heading text-xl font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 max-w-3xl space-y-6 text-base leading-7">
        <p>
          Our consultants work across IT, BFSI, healthcare, engineering, sales and operations. Employers can
          post jobs, request a recruiter, or run confidential searches. Candidates keep applications, interviews
          and profile documents in one place.
        </p>
        <p>
          The product is designed around role-based workspaces: a simple candidate home, an employer hiring
          desk, a recruiter CRM, and an admin control room.
        </p>
      </div>
    </div>
  );
}
