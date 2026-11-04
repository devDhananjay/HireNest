import { DashboardShell } from "@/components/dashboard/shell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role="recruiter">{children}</DashboardShell>;
}
