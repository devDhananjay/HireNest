"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Bell, Mail, Sparkles } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { btnOutline, btnPrimary } from "@/lib/ui";

const STORAGE_KEY = "hireora.talent-community";

type Membership = {
  email: string;
  alerts: boolean;
  joinedAt: string;
};

export default function TalentCommunityPage() {
  const [email, setEmail] = useState("");
  const [member, setMember] = useState<Membership | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setMember(JSON.parse(raw) as Membership);
    } catch {
      /* ignore */
    }
  }, []);

  function persist(next: Membership | null) {
    setMember(next);
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else localStorage.removeItem(STORAGE_KEY);
  }

  function join(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!value.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }
    const next = { email: value, alerts: true, joinedAt: new Date().toISOString() };
    persist(next);
    toast.success("You’re on the list — we’ll ping matching roles quietly");
    setEmail("");
  }

  return (
    <div className="container-shell py-14 sm:py-16">
      <p className="text-[12px] font-medium tracking-[0.16em] text-muted-foreground uppercase">Candidates</p>
      <h1 className="mt-3 max-w-3xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
        Talent community
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
        Save roles you like, then opt into quiet alerts when something similar opens — Ashby/Lever-style polish without
        inbox noise. Discretion first; unsubscribe anytime.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[1.85rem] bg-white p-7 shadow-soft sm:p-9">
          {member ? (
            <div>
              <IconOrb icon={Bell} />
              <h2 className="mt-5 font-heading text-2xl font-semibold tracking-tight">You’re subscribed</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                Alerts go to <span className="font-medium text-foreground">{member.email}</span> for saved-job matches
                and new mandates in your interest areas.
              </p>
              <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-[1.25rem] bg-[#f7f8fb] px-4 py-3 text-sm">
                <input
                  type="checkbox"
                  checked={member.alerts}
                  onChange={(e) => {
                    const next = { ...member, alerts: e.target.checked };
                    persist(next);
                    toast.success(e.target.checked ? "Alerts on" : "Alerts paused");
                  }}
                  className="size-4 rounded border-border"
                />
                Email me when a saved-style role opens
              </label>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link href="/candidate/saved-jobs" className={btnPrimary}>
                  Open saved jobs
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 rounded-full px-6"
                  onClick={() => {
                    persist(null);
                    toast.message("Left the talent community");
                  }}
                >
                  Leave community
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={join}>
              <IconOrb icon={Mail} />
              <h2 className="mt-5 font-heading text-2xl font-semibold tracking-tight">Join quietly</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                One email for role matches — no blast newsletters. Pair this with bookmarks on Saved jobs.
              </p>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="mt-6 h-12 rounded-full bg-[#f7f8fb] px-5"
              />
              <Button type="submit" className="mt-3 h-12 w-full rounded-full sm:w-auto sm:px-8">
                Join talent community
              </Button>
            </form>
          )}
        </section>

        <aside className="space-y-4">
          {[
            {
              icon: Sparkles,
              title: "Saved-job alerts",
              text: "Bookmark roles while browsing. When similar mandates open, we can nudge you — not every new listing on the board.",
            },
            {
              icon: Bell,
              title: "Low volume by design",
              text: "Designed for specialists who hate daily digests. Expect sparseness; turn alerts off in one click.",
            },
            {
              icon: Mail,
              title: "Works with your profile",
              text: "Signed-in candidates can also manage preferences from Saved jobs after joining.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-[1.85rem] bg-white p-6 shadow-soft">
              <IconOrb icon={item.icon} size="sm" />
              <h3 className="mt-4 font-heading text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </div>
          ))}
          <Link href="/for-candidates" className={btnOutline}>
            Candidate path
          </Link>
        </aside>
      </div>
    </div>
  );
}
