"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { IconField, IconTextarea } from "@/components/ui/icon-field";
import { Phone, User } from "lucide-react";

type MessageRow = {
  id: string;
  toPhone: string;
  body: string;
  status: string;
  provider: string;
  createdAt: string;
  error?: string | null;
};

export default function AdminWhatsAppPage() {
  const [provider, setProvider] = useState("console");
  const [ready, setReady] = useState(false);
  const [recent, setRecent] = useState<MessageRow[]>([]);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("HIREORA test: WhatsApp channel is connected.");
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/whatsapp/send");
    const data = await res.json();
    setProvider(data.provider ?? "console");
    setReady(Boolean(data.ready));
    setRecent(data.recent ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function sendTest() {
    if (!phone.trim() || !message.trim()) {
      toast.error("Phone and message required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, message }),
      });
      const data = await res.json();
      if (data.ok) toast.success(`Sent via ${data.provider}`);
      else if (data.skipped) toast.message("Skipped — turn on WhatsApp reminders in Settings");
      else toast.error(data.error || "Failed");
      await load();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="WhatsApp"
        description="Meta Cloud API channel for interview reminders and voice-screen invites. Falls back to console when keys are missing."
      />

      <div className="mb-6 rounded-[1.85rem] bg-white p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <MessageCircle className="size-5" />
          <div>
            <p className="font-heading text-lg font-semibold">Provider: {provider}</p>
            <p className="text-sm text-muted-foreground">
              {ready
                ? "Live credentials detected."
                : "Add WHATSAPP_TOKEN + WHATSAPP_PHONE_NUMBER_ID to .env, then restart."}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Webhook URL for Meta: <code className="rounded bg-[#f4f5f8] px-1.5 py-0.5">/api/whatsapp/webhook</code>
          {" · "}
          Verify token: <code className="rounded bg-[#f4f5f8] px-1.5 py-0.5">WHATSAPP_VERIFY_TOKEN</code>
        </p>
      </div>

      <div className="mb-8 space-y-3 rounded-[1.85rem] bg-white p-6 shadow-soft">
        <h2 className="font-heading text-lg font-semibold">Send test message</h2>
        <IconField icon={Phone} placeholder="+91XXXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <IconTextarea icon={User} value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button className="h-11 rounded-full" disabled={loading} onClick={() => void sendTest()}>
          {loading ? "Sending…" : "Send"}
        </Button>
      </div>

      <div className="space-y-3">
        <h2 className="font-heading text-lg font-semibold">Recent messages</h2>
        {recent.map((row) => (
          <div key={row.id} className="rounded-[1.35rem] bg-white px-5 py-4 text-sm shadow-soft">
            <div className="flex flex-wrap justify-between gap-2">
              <span className="font-medium">{row.toPhone}</span>
              <span className="text-muted-foreground">
                {row.provider} · {row.status}
              </span>
            </div>
            <p className="mt-1 text-muted-foreground">{row.body}</p>
            {row.error ? <p className="mt-1 text-destructive">{row.error}</p> : null}
          </div>
        ))}
        {!recent.length ? <p className="text-sm text-muted-foreground">No messages logged yet.</p> : null}
      </div>
    </div>
  );
}
