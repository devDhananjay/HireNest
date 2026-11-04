"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { PIPELINE_STAGES } from "@/lib/constants";
import { useDemo } from "@/lib/store";
import type { PipelineStage } from "@/lib/types";

export default function PipelinePage() {
  const { pipeline, candidates, jobs, movePipeline } = useDemo();
  const [dragging, setDragging] = useState<string | null>(null);

  return (
    <div>
      <PageHeader title="Hiring pipeline" description="Drag cards between stages. Joined marks a successful placement." />
      <div className="flex gap-5 overflow-x-auto pb-4">
        {PIPELINE_STAGES.map((stage) => (
          <div
            key={stage.id}
            className="w-72 shrink-0 rounded-[1.85rem] bg-white p-4 shadow-soft"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragging) movePipeline(dragging, stage.id as PipelineStage);
              setDragging(null);
            }}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <p className="text-sm font-medium">{stage.label}</p>
              <span className="rounded-full bg-[#f4f5f8] px-2 py-0.5 text-xs text-muted-foreground">
                {pipeline.filter((item) => item.stage === stage.id).length}
              </span>
            </div>
            <div className="space-y-2">
              {pipeline
                .filter((item) => item.stage === stage.id)
                .map((item) => {
                  const candidate = candidates.find((c) => c.id === item.candidateId);
                  const job = jobs.find((j) => j.id === item.jobId);
                  return (
                    <article
                      key={item.id}
                      draggable
                      onDragStart={() => setDragging(item.id)}
                      className="cursor-grab rounded-2xl bg-[#f7f8fb] p-4"
                    >
                      <p className="text-sm font-medium">{candidate?.name}</p>
                      <p className="text-xs text-muted-foreground">{job?.title}</p>
                    </article>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
