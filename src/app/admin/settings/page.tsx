"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell, FolderOpen, Quote } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { PageHeader } from "@/components/dashboard/page-header";
import { Switch } from "@/components/ui/switch";
import { CATEGORIES } from "@/lib/constants";
import { testimonials } from "@/lib/demo/seed";

const SETTINGS_KEY = "hireora.admin.settings.v1";

type SettingsState = {
  emailUpdates: boolean;
  whatsappReminders: boolean;
};

const defaults: SettingsState = {
  emailUpdates: true,
  whatsappReminders: false,
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(defaults);

  useEffect(() => {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return;
    try {
      setSettings({ ...defaults, ...JSON.parse(raw) });
    } catch {
      setSettings(defaults);
    }
  }, []);

  function update(patch: Partial<SettingsState>) {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      toast.success("Settings saved in this browser");
      return next;
    });
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
            <Switch checked={settings.emailUpdates} onCheckedChange={(emailUpdates) => update({ emailUpdates })} />
          </label>
          <label className="flex items-center justify-between gap-4 rounded-2xl bg-[#f7f8fb] px-4 py-3">
            WhatsApp interview reminders
            <Switch checked={settings.whatsappReminders} onCheckedChange={(whatsappReminders) => update({ whatsappReminders })} />
          </label>
          <p className="text-xs text-muted-foreground">Providers are not connected. Toggles persist in this browser only.</p>
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
