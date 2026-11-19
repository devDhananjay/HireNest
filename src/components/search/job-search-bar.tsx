"use client";

import type { ReactNode } from "react";
import { BriefcaseBusiness, ChevronDown, Layers3, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES, LOCATIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export type JobSearchValues = {
  q: string;
  location: string;
  experience: string;
  type: string;
};

function FieldShell({
  icon: Icon,
  label,
  className,
  children,
}: {
  icon: typeof Search;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label
      className={cn(
        "group relative flex min-w-0 cursor-text items-center gap-3 rounded-[1.25rem] px-3.5 py-3 transition duration-300",
        "hover:bg-[#f6f7fa] focus-within:bg-[#f6f7fa] focus-within:ring-2 focus-within:ring-black/[0.06]",
        className,
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f3f4f8] text-foreground transition group-hover:bg-white group-hover:shadow-soft group-focus-within:bg-black group-focus-within:text-white">
        <Icon className="size-3.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          {label}
        </span>
        {children}
      </span>
    </label>
  );
}

function SelectField({
  icon,
  label,
  value,
  onChange,
  children,
  className,
}: {
  icon: typeof Search;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <FieldShell icon={icon} label={label} className={className}>
      <span className="relative mt-1 block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-full cursor-pointer appearance-none bg-transparent pr-6 text-[15px] font-medium tracking-tight text-foreground outline-none sm:h-7 sm:text-sm"
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-0 size-3.5 -translate-y-1/2 text-muted-foreground/80" />
      </span>
    </FieldShell>
  );
}

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
        "job-search-bar grid gap-1.5 rounded-[1.75rem] border border-white/70 bg-white/95 p-2 shadow-lift backdrop-blur-xl sm:gap-0 sm:rounded-[2rem] sm:p-2.5",
        "lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.95fr)_minmax(0,0.95fr)_minmax(0,1.05fr)_auto] lg:items-center",
        className,
      )}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <FieldShell icon={Search} label="Role / keywords" className="lg:pr-2">
        <input
          value={values.q}
          onChange={(e) => onChange({ ...values, q: e.target.value })}
          placeholder="e.g. Product Designer"
          className="mt-1 h-8 w-full bg-transparent text-[15px] font-medium tracking-tight text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground/65 sm:h-7 sm:text-sm"
        />
      </FieldShell>

      <div className="grid grid-cols-2 gap-1.5 sm:gap-0 lg:contents">
        <SelectField
          icon={MapPin}
          label="Location"
          value={values.location}
          onChange={(location) => onChange({ ...values, location })}
          className="lg:border-l lg:border-[#eef0f5] lg:pl-2"
        >
          <option value="">City, India</option>
          {LOCATIONS.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </SelectField>

        <SelectField
          icon={BriefcaseBusiness}
          label="Experience"
          value={values.experience}
          onChange={(experience) => onChange({ ...values, experience })}
          className="lg:border-l lg:border-[#eef0f5] lg:pl-2"
        >
          <option value="">Any</option>
          <option value="0-1">Fresher</option>
          <option value="1-3">1–3 years</option>
          <option value="3-6">3–6 years</option>
          <option value="6-10">6+ years</option>
        </SelectField>
      </div>

      <SelectField
        icon={Layers3}
        label="Category"
        value={values.type}
        onChange={(type) => onChange({ ...values, type })}
        className="lg:border-l lg:border-[#eef0f5] lg:pl-2"
      >
        <option value="">All categories</option>
        {CATEGORIES.map((category) => (
          <option key={category.slug} value={category.name}>
            {category.name}
          </option>
        ))}
      </SelectField>

      <div className="p-1 sm:p-1.5 lg:pl-2">
        <Button
          type="submit"
          className="h-12 w-full rounded-full px-6 text-[14px] font-medium shadow-[0_12px_28px_rgba(17,17,17,0.22)] transition duration-300 hover:-translate-y-px sm:h-[3.35rem] lg:min-w-[9.25rem]"
        >
          <Search className="size-4" />
          Search roles
        </Button>
      </div>
    </form>
  );
}
