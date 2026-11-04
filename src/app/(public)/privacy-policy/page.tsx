import { Shield } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";

export default function PrivacyPage() {
  return (
    <div className="container-shell max-w-3xl py-20">
      <IconOrb icon={Shield} size="lg" />
      <h1 className="mt-6 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Privacy policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated 4 November 2026 · Draft for DPDP Act planning</p>
      <div className="mt-8 space-y-5 rounded-[1.85rem] bg-white p-8 text-sm leading-7 shadow-soft">
        <p>
          HIREORA collects account, profile, resume and application data to operate recruitment services. Resumes are treated as private documents. Employers and recruiters only see candidate information required for a live hiring process.
        </p>
        <p>
          You may request access or deletion of personal data. OTP, payment and production storage providers will be listed here when those integrations go live.
        </p>
      </div>
    </div>
  );
}
