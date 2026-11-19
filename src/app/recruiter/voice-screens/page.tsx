"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AudioLines, MessageCircle, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { IconSelect } from "@/components/ui/icon-field";
import { useDemo } from "@/lib/store";

type ScreenRow = {
  id: string;
  status: string;
  overallScore: number | null;
  summary: string | null;
  createdAt: string;
  job: { title: string; company: { name: string } };
  candidate: { id: string; user: { name: string }; phone: string };
  answers: unknown[];
};

export default function RecruiterVoiceScreensPage() {
  const { jobs, candidates, pipeline } = useDemo();
  const [screens, setScreens] = useState<ScreenRow[]>([]);
  const [jobId, setJobId] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState("console");

  const liveJobs = useMemo(() => jobs.filter((job) => job.status === "active" || job.status === "pending"), [jobs]);
  const mappedCandidates = useMemo(() => {
    if (!jobId) return candidates;
    const ids = new Set(pipeline.filter((p) => p.jobId === jobId).map((p) => p.candidateId));
    const filtered = candidates.filter((c) => ids.has(c.id));
    return filtered.length ? filtered : candidates;
  }, [candidates, pipeline, jobId]);

  async function load() {
    const [voiceRes, waRes] = await Promise.all([fetch("/api/voice-screens"), fetch("/api/whatsapp/send")]);
    const voiceData = await voiceRes.json();
    const waData = await waRes.json();
    setScreens(voiceData.screens ?? []);
    setProvider(waData.provider ?? "console");
    if (!jobId && liveJobs[0]) setJobId(liveJobs[0].id);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createScreen() {
    if (!jobId || !candidateId) {
      toast.error("Pick a job and candidate");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/voice-screens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, candidateId, notifyWhatsApp: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Could not create voice screen");
        return;
      }
      toast.success("Voice screen created — WhatsApp invite attempted");
      await load();
    } finally {
      setLoading(false);
    }
  }

  async function nudge(screen: ScreenRow) {
    if (!screen.candidate.phone) {
      toast.error("Candidate has no phone on profile");
      return;
    }
    const res = await fetch("/api/whatsapp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        candidateId: screen.candidate.id,
        message: `HIREORA reminder: please complete your voice screen for ${screen.job.title}.`,
        relatedType: "voice_screen",
        relatedId: screen.id,
      }),
    });
    const data = await res.json();
    if (data.ok) toast.success(`WhatsApp sent via ${data.provider}`);
    else if (data.skipped) toast.message("WhatsApp skipped — enable reminders in admin settings");
    else toast.error(data.error || "Send failed");
  }

  return (
    <div>
      <PageHeader
        title="Voice screens"
        description="Async AI voice interviews — record answers, auto-transcribe and score. WhatsApp invite uses Meta Cloud API when configured."
      />

      <div id="create" className="mb-6 rounded-[1.85rem] bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="size-4" />
          WhatsApp provider: <strong className="text-foreground">{provider}</strong>
          {provider === "console" ? " (dev fallback — add WHATSAPP_TOKEN to go live)" : null}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <IconSelect icon={AudioLines} value={jobId} onChange={(e) => setJobId(e.target.value)}>
            <option value="">Select job</option>
            {liveJobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </IconSelect>
          <IconSelect icon={MessageCircle} value={candidateId} onChange={(e) => setCandidateId(e.target.value)}>
            <option value="">Select candidate</option>
            {mappedCandidates.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name}
              </option>
            ))}
          </IconSelect>
        </div>
        <Button className="mt-4 h-12 rounded-full" disabled={loading} onClick={() => void createScreen()}>
          {loading ? "Creating…" : "Create voice screen + WhatsApp invite"}
        </Button>
      </div>

      {screens.length ? (
        <div className="space-y-4">
          {screens.map((screen) => (
            <article key={screen.id} className="rounded-[1.85rem] bg-white p-6 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{screen.job.company.name}</p>
                  <h2 className="font-heading text-xl font-semibold">{screen.job.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {screen.candidate.user.name} · {screen.status}
                    {screen.overallScore != null ? ` · score ${screen.overallScore}` : ""}
                  </p>
                  {screen.summary ? <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{screen.summary}</p> : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="rounded-full" onClick={() => void nudge(screen)}>
                    <MessageCircle className="size-4" /> WhatsApp nudge
                  </Button>
                  <Link href={`/recruiter/voice-screens/${screen.id}`} className="inline-flex h-10 items-center rounded-full bg-black px-4 text-sm text-white">
                    Open
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No voice screens yet"
          description="Invite a pipeline candidate to record answers — scores land here before live rounds."
          action={
            <a href="#create" className="inline-flex h-10 items-center rounded-full bg-black px-4 text-sm font-medium text-white">
              Create a voice screen
            </a>
          }
        />
      )}
    </div>
  );
}
