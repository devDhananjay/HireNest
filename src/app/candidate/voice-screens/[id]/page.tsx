"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Mic, Square } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";

type Question = { prompt: string; focus: string };
type Answer = { questionIndex: number; transcript: string; score: number | null; feedback: string | null };
type ScreenDetail = {
  id: string;
  status: string;
  overallScore: number | null;
  summary: string | null;
  questions: Question[];
  job: { title: string; company: { name: string } };
  answers: Answer[];
};

export default function CandidateVoiceScreenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [screen, setScreen] = useState<ScreenDetail | null>(null);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function load() {
    const res = await fetch(`/api/voice-screens/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load");
    setScreen(data.screen);
    const next = (data.screen.questions as Question[]).findIndex(
      (_: Question, index: number) => !(data.screen.answers as Answer[]).some((a) => a.questionIndex === index),
    );
    setActiveIndex(next === -1 ? 0 : next);
  }

  useEffect(() => {
    load().catch((err: Error) => setError(err.message));
  }, [id]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        void uploadAnswer();
      };
      mediaRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      toast.error("Microphone permission needed");
    }
  }

  function stopRecording() {
    mediaRef.current?.stop();
    setRecording(false);
  }

  async function uploadAnswer() {
    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    if (!blob.size) {
      toast.error("Empty recording");
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("questionIndex", String(activeIndex));
      form.append("audio", blob, `answer-${activeIndex}.webm`);
      const res = await fetch(`/api/voice-screens/${id}/answers`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Upload failed");
        return;
      }
      toast.success(data.scored?.score != null ? `Scored ${data.scored.score}/100` : "Answer saved");
      await load();
    } finally {
      setUploading(false);
    }
  }

  if (error) {
    return (
      <EmptyState
        title="Voice screen unavailable"
        description={error}
        action={
          <Link href="/candidate/voice-screens" className="text-sm font-medium hover:underline">
            Back
          </Link>
        }
      />
    );
  }

  if (!screen) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const question = screen.questions[activeIndex];
  const done = screen.status === "scored" || screen.status === "submitted";

  return (
    <div>
      <Link href="/candidate/voice-screens" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> All screens
      </Link>
      <PageHeader
        title={screen.job.title}
        description={`${screen.job.company.name} · Question ${activeIndex + 1} of ${screen.questions.length}`}
      />

      {done ? (
        <div className="rounded-[1.85rem] bg-black p-7 text-white shadow-lift">
          <p className="text-[11px] tracking-[0.16em] text-white/45 uppercase">Completed</p>
          <p className="mt-2 font-heading text-3xl font-semibold">{screen.overallScore ?? "—"}/100</p>
          <p className="mt-3 text-sm leading-7 text-white/70">{screen.summary}</p>
        </div>
      ) : question ? (
        <div className="rounded-[1.85rem] bg-white p-7 shadow-soft">
          <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">{question.focus}</p>
          <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight">{question.prompt}</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Tap record, answer in 45–90 seconds, then stop. We transcribe and score automatically.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {!recording ? (
              <Button className="h-12 rounded-full" disabled={uploading} onClick={() => void startRecording()}>
                <Mic className="size-4" /> {uploading ? "Saving…" : "Record answer"}
              </Button>
            ) : (
              <Button variant="destructive" className="h-12 rounded-full" onClick={stopRecording}>
                <Square className="size-4" /> Stop
              </Button>
            )}
            <div className="flex flex-wrap gap-2">
              {screen.questions.map((_, index) => {
                const answered = screen.answers.some((a) => a.questionIndex === index);
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`size-10 rounded-full text-sm font-medium ${
                      index === activeIndex
                        ? "bg-black text-white"
                        : answered
                          ? "bg-[#e8f5e9] text-foreground"
                          : "bg-[#f4f5f8] text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
