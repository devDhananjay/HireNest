"use client";

import { DemoProvider } from "@/lib/store";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <DemoProvider>
        {children}
        <Toaster position="top-right" />
      </DemoProvider>
    </TooltipProvider>
  );
}
