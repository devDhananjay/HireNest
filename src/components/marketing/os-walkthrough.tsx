"use client";

import { useState } from "react";
import { FileUp, MessageCircle, Radar, AudioLines } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: "parse",
    label: "Resume → profile",
    icon: FileUp,
    title: "Structured profile in seconds",
    copy: "Upload lands as title, skills, experience and years — ready for matching, not a PDF in a folder.",
    panel: {
      eyebrow: "Parsed profile",
      rows: [
        { k: "Title", v: "React Native Developer" },
        { k: "Location", v: "Delhi NCR" },
        { k: "Experience", v: "5.5 years" },
        { k: "Skills", v: "React Native · TypeScript · Redux · Firebase" },
      ],
      score: null as number | null,
    },
  },
  {
    id: "match",
    label: "JD match",
    icon: Radar,
    title: "Explainable fit scores",
    copy: "Roles rank by skills, title overlap, location and experience — with a % you can defend to a hiring manager.",
    panel: {
      eyebrow: "Ranked roles",
      rows: [
        { k: "React Native Developer · Delhi NCR", v: "93% fit" },
        { k: "Frontend Engineer · Bengaluru", v: "68% fit" },
        { k: "Senior Product Designer · Bengaluru", v: "51% fit" },
      ],
      score: 93,
    },
  },
  {
    id: "voice",
    label: "Voice screen",
    icon: AudioLines,
    title: "Async voice screening",
    copy: "Candidates record answers in-browser. Transcripts and scores land on the recruiter desk before a live round.",
    panel: {
      eyebrow: "Voice screen",
      rows: [
        { k: "Status", v: "Scored" },
        { k: "Clarity", v: "8.4 / 10" },
        { k: "Role fit", v: "Strong — mobile shipping evidence" },
        { k: "Next", v: "Offer interview slot" },
      ],
      score: null,
    },
  },
  {
    id: "follow",
    label: "Follow-ups",
    icon: MessageCircle,
    title: "WhatsApp + email sequences",
    copy: "Ack, nudge, interview reminder and no-show follow-ups queue automatically — recruiters stay on conversations that matter.",
    panel: {
      eyebrow: "Sequence",
      rows: [
        { k: "T+0", v: "Application received" },
        { k: "T+24h", v: "Screen nudge" },
        { k: "T−2h", v: "Interview reminder" },
        { k: "T+30m", v: "Missed-round check-in" },
      ],
      score: null,
    },
  },
];

export function OsWalkthrough() {
  const [active, setActive] = useState(0);
  const step = steps[active];

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-soft">
      <div className="border-b border-[#eef0f4] px-5 py-4 sm:px-7">
        <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">Product tour</p>
        <h2 className="mt-1 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          The hiring loop, end to end
        </h2>
      </div>
      <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col gap-2 border-b border-[#eef0f4] p-4 sm:p-5 lg:border-r lg:border-b-0">
          {steps.map((item, index) => {
            const Icon = item.icon;
            const on = index === active;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(index)}
                className={cn(
                  "flex items-start gap-3 rounded-2xl px-3.5 py-3.5 text-left transition",
                  on ? "bg-black text-white" : "hover:bg-[#f7f8fb]",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full",
                    on ? "bg-white/12" : "bg-[#f4f5f8]",
                  )}
                >
                  <Icon className={cn("size-4", on ? "text-white" : "text-muted-foreground")} />
                </span>
                <span>
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className={cn("mt-1 block text-xs leading-5", on ? "text-white/60" : "text-muted-foreground")}>
                    {item.title}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="p-6 sm:p-8">
          <h3 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">{step.title}</h3>
          <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">{step.copy}</p>
          <div className="mesh-dark mt-7 rounded-[1.5rem] p-5 text-white sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-medium tracking-[0.16em] text-white/45 uppercase">{step.panel.eyebrow}</p>
              {typeof step.panel.score === "number" ? (
                <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold">{step.panel.score}% fit</span>
              ) : null}
            </div>
            <dl className="mt-5 space-y-3">
              {step.panel.rows.map((row) => (
                <div key={row.k} className="flex items-start justify-between gap-4 border-b border-white/8 pb-3 last:border-0 last:pb-0">
                  <dt className="text-sm text-white/45">{row.k}</dt>
                  <dd className="max-w-[60%] text-right text-sm font-medium text-white">{row.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="mt-6 flex gap-2">
            <button
              type="button"
              className="h-10 rounded-full border border-border px-4 text-sm font-medium disabled:opacity-40"
              disabled={active === 0}
              onClick={() => setActive((v) => Math.max(0, v - 1))}
            >
              Back
            </button>
            <button
              type="button"
              className="h-10 rounded-full bg-black px-4 text-sm font-medium text-white disabled:opacity-40"
              disabled={active === steps.length - 1}
              onClick={() => setActive((v) => Math.min(steps.length - 1, v + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
