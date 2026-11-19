"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
import { toast } from "sonner";
import { IconOrb } from "@/components/brand/icon-orb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDemo } from "@/lib/store";

export default function PrivacyPage() {
  const { session } = useDemo();
  const [email, setEmail] = useState(session?.email ?? "");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/privacy/deletion-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, reason }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Could not submit request");
        return;
      }
      toast.success(data.message || "Deletion request recorded");
      setReason("");
    } catch {
      toast.error("Could not submit request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-shell max-w-3xl py-20">
      <IconOrb icon={Shield} size="lg" />
      <h1 className="mt-6 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Privacy policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated 19 November 2026 · DPDP Act aligned</p>

      <div className="mt-8 space-y-6 rounded-[1.85rem] bg-white p-8 text-sm leading-7 shadow-soft">
        <section className="space-y-2">
          <h2 className="font-heading text-lg font-semibold">What we collect</h2>
          <p>
            Account data (name, email, phone, role), candidate profiles (skills, education, experience, resume files),
            employer company details, job posts, applications, interview schedules, hiring leads, inquiries, payment
            invoice metadata, and product analytics needed to run the service.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-heading text-lg font-semibold">How we use data</h2>
          <p>
            We use personal data to operate recruitment workflows: matching, applications, interviews, notifications,
            verification, billing and support. Fit scores are generated from profile fields you provide. Optional OpenAI
            parsing may process resume text when an API key is configured; otherwise a local heuristic parser is used.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-heading text-lg font-semibold">Sharing</h2>
          <p>
            Employers and recruiters see candidate information required for an active hiring process. We do not sell
            personal data. Processors may include email (Resend), WhatsApp/SMS (Twilio), payments (Razorpay) and object
            storage (S3/R2) when those integrations are enabled.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-heading text-lg font-semibold">Retention and security</h2>
          <p>
            Resumes are stored privately (local uploads or S3/R2) and served only through authenticated download routes.
            Session cookies are httpOnly JWTs. We retain account and application records while your account is active
            and for a limited period afterward for dispute resolution and legal compliance, unless you request erasure.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-heading text-lg font-semibold">Your rights (DPDP)</h2>
          <p>
            You may request access or erasure of personal data. Submit the form below. An administrator fulfils
            deletion by anonymising the account and removing stored resumes. You may also write to hello@hireora.in.
          </p>
        </section>
      </div>

      <form onSubmit={submit} className="mt-8 space-y-4 rounded-[1.85rem] bg-white p-8 shadow-soft">
        <h2 className="font-heading text-xl font-semibold">Request data deletion</h2>
        <p className="text-sm text-muted-foreground">
          We will queue your request for admin fulfilment. You will receive confirmation once the account is anonymised
          and resume files are removed.
        </p>
        <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Account email" />
        <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Optional reason" />
        <Button type="submit" className="h-11 rounded-full" disabled={loading}>
          {loading ? "Submitting…" : "Submit deletion request"}
        </Button>
      </form>
    </div>
  );
}
