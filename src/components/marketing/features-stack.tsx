"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  FileSearch,
  Layers,
  MessageSquare,
  Phone,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Feature = {
  title: string;
  text: string;
  icon: LucideIcon;
  visual: ReactNode;
};

const features: Feature[] = [
  {
    title: "AI Resume Screening",
    text: "Parse skills, titles and tenure from every CV, then rank applicants against your role scorecard so recruiters open the right profiles first — not the inbox order.",
    icon: FileSearch,
    visual: <ResumeScreenVisual />,
  },
  {
    title: "Fit scores against the JD",
    text: "Every shortlist shows why a profile scored high — skill overlap, title proximity, location and experience — so hiring managers can defend the panel.",
    icon: Target,
    visual: <FitScoreVisual />,
  },
  {
    title: "Async voice screening",
    text: "Send structured voice screens before live panels. Capture answers at scale, score consistently, and keep humans on the conversations that matter.",
    icon: Phone,
    visual: <VoiceVisual />,
  },
  {
    title: "WhatsApp follow-ups",
    text: "Automate nudges for applications, interview slots and joining — with AI first replies that stay on-brand and hand off to a consultant when needed.",
    icon: MessageSquare,
    visual: <WhatsAppVisual />,
  },
  {
    title: "Live recruiter & client desks",
    text: "Shared pipelines, authenticated resume access and weekly status your TA lead can open anytime — consultancy judgement with a live workspace.",
    icon: Layers,
    visual: <DeskVisual />,
  },
];

function ResumeScreenVisual() {
  return (
    <div className="space-y-3 rounded-2xl bg-white/80 p-4 shadow-soft sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Senior Product Designer</p>
        <span className="rounded-full bg-[#0c0c0e] px-2.5 py-1 text-[10px] font-medium text-white">146 CVs</span>
      </div>
      {[
        { name: "Ananya S.", score: 94 },
        { name: "Kabir J.", score: 88 },
        { name: "Meera I.", score: 81 },
      ].map((row) => (
        <div key={row.name} className="rounded-xl bg-[#f4f5f8] px-3 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">{row.name}</p>
            <p className="font-heading text-sm font-semibold tabular-nums">{row.score}%</p>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/8">
            <div className="h-full rounded-full bg-[#0c0c0e]" style={{ width: `${row.score}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function FitScoreVisual() {
  return (
    <div className="rounded-2xl bg-white/80 p-5 shadow-soft">
      <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Match breakdown</p>
      <p className="mt-2 font-heading text-4xl font-semibold tracking-tight">92%</p>
      <ul className="mt-5 space-y-3">
        {[
          { label: "Skills", value: 96 },
          { label: "Title", value: 90 },
          { label: "Experience", value: 88 },
          { label: "Location", value: 84 },
        ].map((row) => (
          <li key={row.label}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-medium tabular-nums">{row.value}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-black/8">
              <div className="h-full rounded-full bg-[#0c0c0e]" style={{ width: `${row.value}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VoiceVisual() {
  return (
    <div className="rounded-2xl bg-white/80 p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-full bg-[#0c0c0e] text-white">
          <Phone className="size-4" />
        </span>
        <div>
          <p className="text-sm font-medium">Voice screen · Round 1</p>
          <p className="text-xs text-muted-foreground">4 questions · ~6 min</p>
        </div>
      </div>
      <div className="mt-5 flex h-16 items-end gap-1.5 px-1">
        {[40, 70, 45, 85, 55, 90, 60, 75, 50, 80, 65, 95, 55, 70, 48].map((h, i) => (
          <span key={i} className="flex-1 rounded-full bg-[#0c0c0e]/80" style={{ height: `${h}%` }} />
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        Transcript + competency scores land in the recruiter desk before the live panel.
      </p>
    </div>
  );
}

function WhatsAppVisual() {
  return (
    <div className="space-y-2.5 rounded-2xl bg-white/80 p-4 shadow-soft sm:p-5">
      {[
        { side: "out", text: "Hi Ananya — interview slot for Thu 4pm is open. Reply YES to confirm." },
        { side: "in", text: "YES, I can join." },
        { side: "out", text: "Locked. Calendar invite + brief attached." },
      ].map((msg, i) => (
        <div
          key={i}
          className={cn(
            "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-5",
            msg.side === "out" ? "ml-auto bg-[#0c0c0e] text-white" : "bg-[#f4f5f8] text-foreground",
          )}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
}

function DeskVisual() {
  return (
    <div className="rounded-2xl bg-white/80 p-4 shadow-soft sm:p-5">
      <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Pipeline</p>
      <div className="mt-3 space-y-2">
        {[
          { stage: "Applied", n: 46 },
          { stage: "Screened", n: 18 },
          { stage: "Shortlist", n: 7 },
          { stage: "Interview", n: 3 },
        ].map((row) => (
          <div key={row.stage} className="flex items-center gap-3 rounded-xl bg-[#f4f5f8] px-3 py-2.5">
            <span className="flex-1 text-sm font-medium">{row.stage}</span>
            <span className="font-heading text-sm font-semibold tabular-nums">{row.n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Sticky stack — same scroll math as Hirenex Features: scale + zIndex by distance from viewport midpoint */
export function FeaturesStack() {
  const listRef = useRef<HTMLUListElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const ticking = useRef(false);

  useEffect(() => {
    const animateCards = () => {
      const vh = window.innerHeight;
      const mid = vh / 2;
      const range = vh * 0.7;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const top = card.getBoundingClientRect().top;
        const dist = top - mid;
        const abs = Math.abs(dist);

        let scale = 0.95;
        if (dist < 0 && abs < range) {
          scale = 0.95 + (1.05 - 0.95) * ((range - abs) / range);
        } else if (dist >= 0 && dist < range) {
          scale = 0.95 + (1.05 - 0.95) * ((range - dist) / range);
        }

        // Later cards always sit above earlier ones when sticky tops meet
        card.style.transform = `scale(${scale})`;
        card.style.zIndex = String(Math.max(1, Math.round(1000 - abs)) + index * 20);
      });
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(() => {
        animateCards();
        ticking.current = false;
      });
    };

    animateCards();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", animateCards);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", animateCards);
    };
  }, []);

  return (
    <section className="pb-16 sm:pb-24">
      <div className="container-shell mb-8 flex flex-col items-center gap-5 text-center sm:mb-10 sm:gap-6">
        <p className="inline-flex max-w-fit items-center rounded-full border border-black/10 bg-black/[0.04] px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-foreground/75 uppercase shadow-soft sm:text-xs">
          <Sparkles className="mr-2 size-4 text-foreground/55" />
          Features
        </p>
        <h2 className="max-w-3xl font-heading text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.65rem]">
          Smarter Recruitment, Powered by AI.
        </h2>
      </div>

      <div className="mx-auto mt-3 max-w-6xl px-4 shadow-sm md:mt-[40px]">
        <ul ref={listRef} className="space-y-20">
          {features.map((feature, index) => (
            <li
              key={feature.title}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              className="sticky top-24 min-h-[50vh] rounded-3xl bg-[#e9edf3] p-7 transition-all duration-700 ease-out sm:p-10 md:top-28"
              style={{
                transformOrigin: "center center",
                willChange: "transform, z-index",
              }}
            >
              <div className="flex h-full flex-col items-center gap-8 lg:flex-row lg:gap-10">
                <div className="flex w-full flex-col items-start lg:w-1/2">
                  <feature.icon className="mb-4 size-14 stroke-[1.25] text-[#0c0c0e] sm:size-16 lg:ml-6" />
                  <div className="mb-3 inline-flex items-center rounded-xl bg-white px-3 py-1.5 font-semibold shadow-soft">
                    <h3 className="text-left text-lg font-semibold tracking-tight sm:text-xl">{feature.title}</h3>
                  </div>
                  <p className="max-w-xl text-left text-base leading-relaxed text-foreground/70 sm:text-lg">
                    {feature.text}
                  </p>
                </div>
                <div className="w-full lg:w-1/2">{feature.visual}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
