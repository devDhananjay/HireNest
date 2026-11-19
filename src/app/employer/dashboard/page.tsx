"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Briefcase, Users, Calendar, LineChart, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { CompanyMark } from "@/components/jobs/company-mark";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { btnPrimary } from "@/lib/ui";
import { useDemo } from "@/lib/store";

type Invoice = {
  id: string;
  amount: number;
  status: string;
  packageName: string;
  razorpayOrderId: string | null;
  issuedAt: string;
};

export default function EmployerDashboard() {
  const { session, jobs, applications, interviews, companies, candidates } = useDemo();
  const companyId = session?.companyId ?? companies[0]?.id;
  const mine = jobs.filter((job) => job.companyId === companyId);
  const apps = applications.filter((app) => mine.some((job) => job.id === app.jobId));
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  async function loadInvoices() {
    const res = await fetch("/api/payments/invoices");
    if (!res.ok) return;
    const data = await res.json();
    setInvoices(data.invoices ?? []);
  }

  useEffect(() => {
    void loadInvoices();
  }, []);

  async function buyPackage(packageId: string) {
    const res = await fetch("/api/payments/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packageId, companyId }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Could not create order");
      return;
    }
    toast.success(data.mock ? "Mock Razorpay order created" : "Razorpay order created");
    await loadInvoices();
  }

  return (
    <div>
      <PageHeader
        title="Hiring desk"
        description="Post roles, review applicants and request a recruiter when you need support."
        actions={
          <Link href="/employer/jobs/create" className={btnPrimary}>
            Post a job
          </Link>
        }
      />
      <div className="grid gap-6 md:grid-cols-4">
        <StatCard label="Active jobs" value={mine.filter((j) => j.status === "active").length} icon={Briefcase} />
        <StatCard label="Applications" value={apps.length} icon={Users} tone="royal" />
        <StatCard label="Interviews" value={interviews.filter((i) => i.companyId === companyId).length} icon={Calendar} tone="orange" />
        <StatCard label="Pending approval" value={mine.filter((j) => j.status === "pending").length} icon={LineChart} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[1.85rem] bg-white p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">Live roles</h2>
            <Link href="/employer/jobs" className="text-sm text-muted-foreground hover:text-foreground">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {mine.slice(0, 4).map((job) => (
              <div key={job.id} className="flex items-center justify-between rounded-2xl bg-[#f7f8fb] px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{job.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {job.location} · {job.openings} openings
                  </p>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {job.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[1.85rem] bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">Recent applicants</h2>
            <Link href="/employer/applications" className="text-sm text-muted-foreground hover:text-foreground">
              Pipeline
            </Link>
          </div>
          <div className="space-y-3">
            {apps.slice(0, 4).map((app) => {
              const candidate = candidates.find((item) => item.id === app.candidateId);
              const job = jobs.find((item) => item.id === app.jobId);
              return (
                <div key={app.id} className="flex items-center gap-3 rounded-2xl bg-[#f7f8fb] px-4 py-3">
                  <CompanyMark name={candidate?.name ?? "C"} color="#111111" size="sm" className="ring-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{candidate?.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{job?.title}</p>
                  </div>
                  <Badge variant="outline">{app.status}</Badge>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-[1.85rem] bg-white p-6 shadow-soft">
        <div className="mb-4 flex items-center gap-3">
          <CreditCard className="size-4" />
          <h2 className="font-heading text-lg font-semibold">Job packages · Razorpay</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button className="h-11 rounded-full" onClick={() => void buyPackage("starter")}>
            Starter · ₹14,999
          </Button>
          <Button variant="outline" className="h-11 rounded-full" onClick={() => void buyPackage("growth")}>
            Growth · ₹49,999
          </Button>
          <Button variant="outline" className="h-11 rounded-full" onClick={() => void buyPackage("enterprise")}>
            Enterprise · ₹1,49,999
          </Button>
        </div>
        <div className="mt-5 space-y-2">
          {invoices.slice(0, 4).map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between rounded-2xl bg-[#f7f8fb] px-4 py-3 text-sm">
              <span>
                {invoice.packageName} · ₹{(invoice.amount / 100).toLocaleString("en-IN")}
              </span>
              <Badge variant="outline">{invoice.status}</Badge>
            </div>
          ))}
          {!invoices.length ? <p className="text-sm text-muted-foreground">No invoices yet.</p> : null}
        </div>
      </div>
    </div>
  );
}
