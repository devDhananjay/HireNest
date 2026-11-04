import { Suspense } from "react";

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="container-shell py-20">Loading jobs…</div>}>{children}</Suspense>;
}
