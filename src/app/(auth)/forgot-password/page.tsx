"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
        toast.success("Demo: a reset link would be emailed.");
      }}
    >
      <h1 className="font-heading text-3xl font-semibold">Reset password</h1>
      <p className="text-sm leading-6 text-muted-foreground">Enter your email. Email delivery is simulated in this demo.</p>
      <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="h-12" />
      <Button type="submit" className="h-12 w-full rounded-full">Send reset link</Button>
      {sent ? <p className="text-sm text-green-700">If this were production, {email} would receive a reset email.</p> : null}
      <Link href="/login" className="inline-block text-sm hover:underline">Back to login</Link>
    </form>
  );
}
