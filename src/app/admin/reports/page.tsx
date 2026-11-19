"use client";

import { useMemo } from "react";
import { Download, LineChart, Mail, Users } from "lucide-react";
import { Line, LineChart as Chart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { IconOrb } from "@/components/brand/icon-orb";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/store";

export default function AdminReportsPage() {
  const { applications, leads, inquiries, pipeline } = useDemo();
  const joined = pipeline.filter((item) => item.stage === "joined").length;

  const conversion = useMemo(() => {
    const count = (statuses: string[]) =>
      applications.filter((app) => statuses.includes(app.status)).length;
    return [
      { stage: "Applied", value: applications.length },
      { stage: "Review", value: count(["Under Review", "Shortlisted", "Interview Scheduled", "Selected", "Rejected"]) },
      { stage: "Interview", value: count(["Interview Scheduled", "Selected"]) + pipeline.filter((item) => item.stage === "interview").length },
      { stage: "Offer", value: count(["Selected"]) + pipeline.filter((item) => item.stage === "offered" || item.stage === "selected").length },
      { stage: "Joined", value: joined },
    ];
  }, [applications, joined, pipeline]);

  function exportCsv() {
    const rows = ["stage,value", ...conversion.map((row) => `${row.stage},${row.value}`)].join("\n");
    const blob = new Blob([rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hireora-conversion-demo.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Demo CSV downloaded");
  }

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Conversion funnel from live applications and pipeline. Employer packages bill via Razorpay."
        actions={
          <Button className="h-11 rounded-full" onClick={exportCsv}>
            <Download className="size-4" /> Export CSV
          </Button>
        }
      />
      <div className="mb-8 grid gap-5 md:grid-cols-3">
        <StatCard label="Applications" value={applications.length} icon={Users} />
        <StatCard label="Open leads" value={leads.filter((lead) => lead.status !== "Closed").length} icon={LineChart} />
        <StatCard label="Inbox inquiries" value={inquiries.length} icon={Mail} />
      </div>
      <div className="rounded-[1.85rem] bg-white p-7 shadow-soft">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <IconOrb icon={LineChart} />
            <p className="text-sm font-medium">Hiring conversion · live demo data</p>
          </div>
          <p className="text-sm text-muted-foreground">{joined} joined in pipeline</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <Chart data={conversion}>
              <XAxis dataKey="stage" tick={{ fill: "#8a8f9c", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#8a8f9c", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 16, border: "none", boxShadow: "0 12px 32px rgba(17,17,17,0.08)" }} />
              <Line type="monotone" dataKey="value" stroke="#111111" strokeWidth={3} dot={{ r: 4, fill: "#111111" }} />
            </Chart>
          </ResponsiveContainer>
        </div>
        <p className="mt-5 text-sm text-muted-foreground">
          CSV export is local-only in this demo. Invoices and audit logs will connect to PostgreSQL later.
        </p>
      </div>
    </div>
  );
}
