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
      <p className="mt-3 text-sm text-muted-foreground">Last updated 18 November 2026 · DPDP Act aligned workflows</p>
      <div className="mt-8 space-y-5 rounded-[1.85rem] bg-white p-8 text-sm leading-7 shadow-soft">
        <p>
          HIREORA collects account, profile, resume and application data to operate recruitment services. Resumes are
          treated as private documents and served only through authenticated download routes. Employers and recruiters
          only see candidate information required for a live hiring process.
        </p>
        <p>
          Email OTP and notifications use Resend when configured. WhatsApp reminders use Twilio when enabled in admin
          settings. Payments for employer packages use Razorpay. Object storage can use S3/R2; otherwise files stay on
          the application server under a private uploads directory.
        </p>
        <p>
          Under India&apos;s Digital Personal Data Protection Act, you may request erasure of personal data. Submit the
          form below. An administrator fulfils the request by anonymising the account and deleting stored resumes.
        </p>
      </div>

      <form onSubmit={submit} className="mt-8 space-y-4 rounded-[1.85rem] bg-white p-8 shadow-soft">
        <h2 className="font-heading text-xl font-semibold">Request data deletion</h2>
        <Input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Account email"
        />
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Optional reason"
        />
        <Button type="submit" className="h-11 rounded-full" disabled={loading}>
          {loading ? "Submitting…" : "Submit deletion request"}
        </Button>
      </form>
    </div>
  );
}
