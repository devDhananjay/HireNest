"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell, FolderOpen, Quote } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { PageHeader } from "@/components/dashboard/page-header";
import { Switch } from "@/components/ui/switch";
import { CATEGORIES } from "@/lib/constants";
import { testimonials } from "@/lib/demo/seed";

type SettingsState = {
  emailUpdates: boolean;
  whatsappReminders: boolean;
  autoFollowUps: boolean;
  dailyDigest: boolean;
};

const defaults: SettingsState = {
  emailUpdates: true,
  whatsappReminders: false,
  autoFollowUps: true,
  dailyDigest: true,
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bootstrap")
      .then((res) => res.json())
      .then((data) => {
        setSettings({
          emailUpdates: Boolean(data.settings?.emailUpdates ?? true),
          whatsappReminders: Boolean(data.settings?.whatsappReminders ?? false),
          autoFollowUps: Boolean(data.settings?.autoFollowUps ?? true),
          dailyDigest: Boolean(data.settings?.dailyDigest ?? true),
        });
      })
      .finally(() => setLoading(false));
  }, []);

  async function update(patch: Partial<SettingsState>) {
    const next = { ...settings, ...patch };
    setSettings(next);
    const res = await fetch("/api/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "updateSettings", payload: next }),
    });
    if (!res.ok) {
      toast.error("Could not save settings");
      return;
    }
    toast.success("Settings saved");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Homepage content, categories, testimonials and notification flags." />
      <section className="rounded-[1.85rem] bg-white p-7 shadow-soft">
        <div className="flex items-center gap-3">
          <IconOrb icon={Bell} />
          <h2 className="font-heading font-semibold">Notifications</h2>
        </div>
        <div className="mt-5 space-y-4 text-sm">
          <label className="flex items-center justify-between gap-4 rounded-2xl bg-[#f7f8fb] px-4 py-3">
            Email application updates
            <Switch
              checked={settings.emailUpdates}
              disabled={loading}
              onCheckedChange={(emailUpdates) => void update({ emailUpdates })}
            />
          </label>
          <label className="flex items-center justify-between gap-4 rounded-2xl bg-[#f7f8fb] px-4 py-3">
            WhatsApp interview reminders
            <Switch
              checked={settings.whatsappReminders}
              disabled={loading}
              onCheckedChange={(whatsappReminders) => void update({ whatsappReminders })}
            />
          </label>
          <label className="flex items-center justify-between gap-4 rounded-2xl bg-[#f7f8fb] px-4 py-3">
            Auto follow-up sequences
            <Switch
              checked={settings.autoFollowUps}
              disabled={loading}
              onCheckedChange={(autoFollowUps) => void update({ autoFollowUps })}
            />
          </label>
          <label className="flex items-center justify-between gap-4 rounded-2xl bg-[#f7f8fb] px-4 py-3">
            Daily hiring digest
            <Switch
              checked={settings.dailyDigest}
              disabled={loading}
              onCheckedChange={(dailyDigest) => void update({ dailyDigest })}
            />
          </label>
          <p className="text-xs text-muted-foreground">
            Email uses Resend when configured; WhatsApp uses Meta Cloud API (or Twilio). Cron:{" "}
            <code className="rounded bg-[#eef0f4] px-1">POST /api/cron/followups</code> and{" "}
            <code className="rounded bg-[#eef0f4] px-1">POST /api/cron/daily-digest</code> with{" "}
            <code className="rounded bg-[#eef0f4] px-1">Authorization: Bearer CRON_SECRET</code>.
          </p>
        </div>
      </section>
      <section className="rounded-[1.85rem] bg-white p-7 shadow-soft">
        <div className="flex items-center gap-3">
          <IconOrb icon={FolderOpen} />
          <h2 className="font-heading font-semibold">Job categories</h2>
        </div>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {CATEGORIES.map((c) => (
            <li key={c.slug} className="rounded-2xl bg-[#f7f8fb] px-4 py-3 text-sm">
              {c.name}
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-[1.85rem] bg-white p-7 shadow-soft">
        <div className="flex items-center gap-3">
          <IconOrb icon={Quote} />
          <h2 className="font-heading font-semibold">Testimonials · demo</h2>
        </div>
        <ul className="mt-5 space-y-2 text-sm">
          {testimonials.map((t) => (
            <li key={t.id} className="rounded-2xl bg-[#f7f8fb] px-4 py-3">
              <p className="font-medium">{t.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t.role}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
