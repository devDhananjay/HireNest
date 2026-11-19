"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEMO_ACCOUNTS, DEMO_PASSWORD, ROLE_HOME } from "@/lib/constants";
import { useDemo } from "@/lib/store";
import type { SessionUser } from "@/lib/types";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { setSession, refresh } = useDemo();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function enter(loginEmail: string, loginPassword: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = (await res.json()) as { user?: SessionUser; error?: string };
      if (!res.ok || !data.user) {
        setError(data.error || "Could not sign in.");
        setLoading(false);
        return;
      }
      setSession(data.user);
      await refresh();
      router.push(params.get("next") || ROLE_HOME[data.user.role]);
      router.refresh();
    } catch {
      setError("Could not sign in. Try again.");
      setLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) {
      setError("Enter your password.");
      return;
    }
    await enter(email, password);
  }

  return (
    <div>
      <p className="text-[12px] font-medium tracking-[0.16em] text-muted-foreground uppercase">Welcome back</p>
      <h1 className="mt-2 font-heading text-3xl font-semibold">Sign in to Hireora</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Role-based access backed by PostgreSQL. Seeded password is {DEMO_PASSWORD}.
      </p>
      <form className="mt-8 space-y-3" onSubmit={onSubmit}>
        <Input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12" />
        <Input
          required
          type="password"
          placeholder={`Password (${DEMO_PASSWORD})`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12"
        />
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" className="h-12 w-full rounded-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <div className="mt-6 grid gap-2">
        {DEMO_ACCOUNTS.map((account) => (
          <Button
            key={account.email}
            variant="outline"
            className="h-12 justify-between rounded-full px-4"
            disabled={loading}
            onClick={() => void enter(account.email, DEMO_PASSWORD)}
          >
            <span>{account.label}</span>
            <span className="text-xs text-muted-foreground">{account.email}</span>
          </Button>
        ))}
      </div>
      <div className="mt-6 flex justify-between text-sm">
        <Link href="/forgot-password" className="hover:underline">
          Forgot password
        </Link>
        <Link href="/register" className="hover:underline">
          Create account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading sign-in…</p>}>
      <LoginForm />
    </Suspense>
  );
}
