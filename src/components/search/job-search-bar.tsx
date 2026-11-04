"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES, LOCATIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export type JobSearchValues = {
  q: string;
  location: string;
  experience: string;
  type: string;
};

export function JobSearchBar({
  values,
  onChange,
  onSubmit,
  className,
}: {
  values: JobSearchValues;
  onChange: (values: JobSearchValues) => void;
  onSubmit: () => void;
  className?: string;
}) {
  return (
    <form
      className={cn(
        "grid gap-2 rounded-[1.6rem] bg-white p-2.5 shadow-lift sm:gap-3 sm:rounded-[1.85rem] sm:p-3",
        "lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_auto]",
        className,
      )}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <label className="rounded-2xl px-3.5 py-2.5 transition hover:bg-[#f7f8fb] sm:px-4">
        <span className="block text-[11px] font-medium tracking-wide text-muted-foreground">Role / keywords</span>
        <input
          value={values.q}
          onChange={(e) => onChange({ ...values, q: e.target.value })}
          placeholder="e.g. Product Designer"
          className="mt-0.5 h-9 w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground/70 sm:h-8 sm:text-sm"
        />
      </label>

      <div className="grid grid-cols-2 gap-2 lg:contents">
        <label className="rounded-2xl px-3.5 py-2.5 transition hover:bg-[#f7f8fb] sm:px-4 lg:border-l lg:border-[#eef0f5]">
          <span className="block text-[11px] font-medium tracking-wide text-muted-foreground">Location</span>
          <select
            value={values.location}
            onChange={(e) => onChange({ ...values, location: e.target.value })}
            className="mt-0.5 h-9 w-full bg-transparent text-[15px] outline-none sm:h-8 sm:text-sm"
          >
            <option value="">City, India</option>
            {LOCATIONS.map((location) => (
              <option key={location}>{location}</option>
            ))}
          </select>
        </label>
        <label className="rounded-2xl px-3.5 py-2.5 transition hover:bg-[#f7f8fb] sm:px-4 lg:border-l lg:border-[#eef0f5]">
          <span className="block text-[11px] font-medium tracking-wide text-muted-foreground">Experience</span>
          <select
            value={values.experience}
            onChange={(e) => onChange({ ...values, experience: e.target.value })}
            className="mt-0.5 h-9 w-full bg-transparent text-[15px] outline-none sm:h-8 sm:text-sm"
          >
            <option value="">Any</option>
            <option value="0-1">Fresher</option>
            <option value="1-3">1–3 years</option>
            <option value="3-6">3–6 years</option>
            <option value="6-10">6+ years</option>
          </select>
        </label>
      </div>

      <label className="rounded-2xl px-3.5 py-2.5 transition hover:bg-[#f7f8fb] sm:px-4 lg:border-l lg:border-[#eef0f5]">
        <span className="block text-[11px] font-medium tracking-wide text-muted-foreground">Category</span>
        <select
          value={values.type}
          onChange={(e) => onChange({ ...values, type: e.target.value })}
          className="mt-0.5 h-9 w-full bg-transparent text-[15px] outline-none sm:h-8 sm:text-sm"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((category) => (
            <option key={category.slug}>{category.name}</option>
          ))}
        </select>
      </label>

      <Button type="submit" className="h-12 w-full rounded-full px-6 text-[15px] sm:h-14 lg:min-w-[8.5rem]">
        <Search className="size-4" />
        Search roles
      </Button>
    </form>
  );
}
