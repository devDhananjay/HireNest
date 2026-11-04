"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { CompanyMark } from "@/components/jobs/company-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDemo } from "@/lib/store";

export default function RecruiterCandidatesPage() {
  const { candidates, notes, addNote } = useDemo();
  const [query, setQuery] = useState("");
  const [note, setNote] = useState("");
  const [active, setActive] = useState(candidates[0]?.id);
  const filtered = candidates.filter((c) => `${c.name} ${c.skills.join(" ")} ${c.location}`.toLowerCase().includes(query.toLowerCase()));
  const selected = candidates.find((c) => c.id === active);
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div>
        <PageHeader title="Candidate database" description="Possible duplicates are flagged for human review." />
        <div className="relative mb-5">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, skill, city" className="h-12 rounded-full pl-11" />
        </div>
        <div className="space-y-4">
          {filtered.map((candidate) => (
            <button
              key={candidate.id}
              type="button"
              onClick={() => setActive(candidate.id)}
              className={`w-full rounded-[1.85rem] bg-white p-5 text-left shadow-soft transition ${active === candidate.id ? "ring-1 ring-black/8" : "hover:-translate-y-px"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CompanyMark name={candidate.name} color="#111111" size="sm" className="ring-[#f3f4f8]" />
                  <div>
                    <p className="font-heading font-semibold">{candidate.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {candidate.currentTitle} · {candidate.location}
                    </p>
                  </div>
                </div>
                {candidate.duplicateOf ? <Badge variant="destructive">Possible duplicate</Badge> : null}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {candidate.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
      <aside className="h-fit rounded-[1.85rem] bg-white p-6 shadow-soft">
        {selected ? (
          <>
            <div className="flex items-center gap-3">
              <CompanyMark name={selected.name} color="#111111" className="ring-[#f3f4f8]" />
              <div>
                <h2 className="font-heading text-lg font-semibold">{selected.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {selected.email} · {selected.phone}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6">{selected.skills.join(", ")}</p>
            <p className="mt-2 text-xs text-muted-foreground">Resume: {selected.resumeName}</p>
            <div className="mt-4 space-y-2">
              {notes
                .filter((n) => n.candidateId === selected.id)
                .map((item) => (
                  <p key={item.id} className="rounded-2xl bg-[#f7f8fb] p-3 text-sm">
                    {item.body}
                  </p>
                ))}
            </div>
            <Textarea className="mt-4" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note" />
            <Button className="mt-3 h-11 rounded-full" onClick={() => { addNote(selected.id, note); setNote(""); }}>
              Save note
            </Button>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Select a candidate.</p>
        )}
      </aside>
    </div>
  );
}
