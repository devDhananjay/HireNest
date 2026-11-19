"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { ROLE_HOME } from "@/lib/constants";
import { useDemo } from "@/lib/store";
import type { SessionUser, UserRole } from "@/lib/types";

function RegisterForm() {
  const params = useSearchParams();
  const router = useRouter();
  const { setSession, refresh } = useDemo();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: (params.get("role") as UserRole) || "candidate",
    companyName: "",
  });

  async function next(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not start registration");
        setLoading(false);
        return;
      }
      setHint(data.message || "");
      setStep("otp");
    } catch {
      setError("Could not start registration");
    } finally {
      setLoading(false);
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp }),
      });
      const data = (await res.json()) as { user?: SessionUser; error?: string };
      if (!res.ok || !data.user) {
        setError(data.error || "Invalid OTP");
        setLoading(false);
        return;
      }
      setSession(data.user);
      await refresh();
      router.push(ROLE_HOME[data.user.role]);
      router.refresh();
    } catch {
      setError("Verification failed");
      setLoading(false);
    }
  }

  if (step === "otp") {
    return (
      <form onSubmit={verify} className="space-y-3">
        <h1 className="font-heading text-3xl font-semibold">Verify OTP</h1>
        <p className="text-sm text-muted-foreground">{hint || "Enter the OTP sent to your email."}</p>
        <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit OTP" className="h-12 tracking-[0.4em]" />
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" className="h-12 w-full rounded-full" disabled={loading}>
          {loading ? "Verifying…" : "Verify & continue"}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={next} className="space-y-3">
      <h1 className="font-heading text-3xl font-semibold">Create your account</h1>
      <p className="text-sm leading-6 text-muted-foreground">
        Candidate accounts are free. Employer verification happens after signup.
      </p>
      <NativeSelect className="h-12" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}>
        <option value="candidate">I am a candidate</option>
        <option value="employer">I am hiring</option>
      </NativeSelect>
      <Input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-12" />
      <Input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-12" />
      <Input required placeholder="Mobile number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-12" />
      {form.role === "employer" ? (
        <Input
          required
          placeholder="Company name"
          value={form.companyName}
          onChange={(e) => setForm({ ...form, companyName: e.target.value })}
          className="h-12"
        />
      ) : null}
      <Input
        required
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="h-12"
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" className="h-12 w-full rounded-full" disabled={loading}>
        {loading ? "Sending OTP…" : "Send OTP"}
      </Button>
      <p className="text-sm">
        Already registered?{" "}
        <Link href="/login" className="hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading registration…</p>}>
      <RegisterForm />
    </Suspense>
  );
}
