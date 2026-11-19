"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"email" | "reset">("email");
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not send reset code");
        return;
      }
      setHint(data.message || "");
      setStep("reset");
      toast.success("Reset code ready");
    } catch {
      setError("Could not send reset code");
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not reset password");
        return;
      }
      toast.success("Password updated. You can sign in.");
      setStep("email");
      setOtp("");
      setPassword("");
    } catch {
      setError("Could not reset password");
    } finally {
      setLoading(false);
    }
  }

  if (step === "reset") {
    return (
      <form className="space-y-3" onSubmit={resetPassword}>
        <h1 className="font-heading text-3xl font-semibold">Choose a new password</h1>
        <p className="text-sm leading-6 text-muted-foreground">{hint}</p>
        <Input required value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="OTP code" className="h-12 tracking-[0.4em]" />
        <Input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          className="h-12"
        />
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" className="h-12 w-full rounded-full" disabled={loading}>
          {loading ? "Saving…" : "Update password"}
        </Button>
        <Link href="/login" className="inline-block text-sm hover:underline">
          Back to login
        </Link>
      </form>
    );
  }

  return (
    <form className="space-y-3" onSubmit={requestCode}>
      <h1 className="font-heading text-3xl font-semibold">Reset password</h1>
      <p className="text-sm leading-6 text-muted-foreground">
        Enter your email. We send an OTP via Resend when configured, otherwise a demo code is shown.
      </p>
      <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="h-12" />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" className="h-12 w-full rounded-full" disabled={loading}>
        {loading ? "Sending…" : "Send reset code"}
      </Button>
      <Link href="/login" className="inline-block text-sm hover:underline">
        Back to login
      </Link>
    </form>
  );
}
