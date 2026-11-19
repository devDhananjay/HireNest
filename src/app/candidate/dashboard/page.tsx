"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Building2, Clock, Sparkles, Upload, Wallet } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { EmptyState } from "@/components/dashboard/empty-state";
import { JobCard } from "@/components/jobs/job-card";
import { JobSearchBar } from "@/components/search/job-search-bar";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { CATEGORIES } from "@/lib/constants";
import { jobMatchesSearch, rankJobsForCandidate } from "@/lib/matching";
import { useDemo } from "@/lib/store";

export default function CandidateDashboard() {
  const router = useRouter();
  const { session, candidateByUserId, jobs, uploadResume } = useDemo();
  const candidate = session ? candidateByUserId(session.id) : undefined;
  const [search, setSearch] = useState({ q: "", location: "", experience: "", type: "" });
  const [industry, setIndustry] = useState("");
  const [mode, setMode] = useState("");
  const [salary, setSalary] = useState(5);
  const cvScore = candidate?.completeness ?? 0;
  const interviewScore = Math.max(42, Math.min(96, cvScore - 15));

  const recommended = useMemo(() => {
    const active = jobs.filter((job) => job.status === "active");
    const ranked = rankJobsForCandidate(active, candidate).map(({ job, match }) => ({
      job,
      score: match?.score ?? 0,
    }));
    return ranked
      .filter(({ job }) => jobMatchesSearch(job, search))
      .filter(({ job }) => !industry || job.category === industry)
      .filter(({ job }) => !mode || job.workMode === mode)
      .filter(({ job }) => salary <= 5 || job.salaryMax >= salary * 100000)
      .slice(0, 6);
  }, [candidate, industry, jobs, mode, salary, search]);

  const bestFit = recommended[0]?.score ?? null;

  return (
    <div className="pt-1 sm:pt-2">
      <h1 className="font-heading text-[1.75rem] font-semibold tracking-tight sm:text-[2.6rem]">
        Welcome back, {session?.name?.split(" ")[0] ?? "there"}
      </h1>
      <p className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-muted-foreground sm:mt-3 sm:text-sm">
        <span>
          {candidate?.currentTitle
            ? `Ranked for ${candidate.currentTitle}${candidate.location ? ` · ${candidate.location}` : ""}`
            : `${recommended.length} roles available — upload a CV to personalize.`}
        </span>
        <span className="hidden h-1 w-1 rounded-full bg-muted-foreground/40 sm:inline-block" />
        <span>
          Best fit{" "}
          <strong className="font-semibold text-foreground">
            {bestFit != null && candidate ? `${bestFit}%` : "—"}
          </strong>
        </span>
        <span className="hidden h-1 w-1 rounded-full bg-muted-foreground/40 sm:inline-block" />
        <span>
          CV Score <strong className="font-semibold text-foreground">{cvScore}/100</strong>
        </span>
        <span className="hidden h-1 w-1 rounded-full bg-muted-foreground/40 sm:inline-block" />
        <span>
          Interview preparedness <strong className="font-semibold text-foreground">{interviewScore}%</strong>
        </span>
      </p>
      <JobSearchBar
        className="mt-6 sm:mt-8"
        values={search}
        onChange={setSearch}
        onSubmit={() => {
          const params = new URLSearchParams();
          if (search.q) params.set("q", search.q);
          if (search.location) params.set("location", search.location);
          if (search.experience) params.set("experience", search.experience);
          if (search.type) params.set("category", search.type);
          router.push(params.size ? `/jobs?${params.toString()}` : "/jobs");
        }}
      />
      <div className="mt-10 grid items-start gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <div className="rounded-[1.85rem] bg-white p-6 shadow-soft">
            <div className="flex items-start gap-3">
              <IconOrb icon={Sparkles} />
              <div>
                <h2 className="font-heading text-lg font-semibold">Let AI find your ideal job</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Upload your CV — we parse title, skills and experience, then rank jobs by fit %.
                </p>
              </div>
            </div>
            {candidate && (candidate.currentTitle || candidate.skills.length > 0) ? (
              <div className="mt-4 rounded-2xl bg-[#f8f9fc] px-3.5 py-3 text-xs leading-5 text-muted-foreground">
                {candidate.currentTitle ? (
                  <p>
                    Profile: <span className="font-medium text-foreground">{candidate.currentTitle}</span>
                    {candidate.location ? ` · ${candidate.location}` : ""}
                  </p>
                ) : null}
                {candidate.skills.length ? (
                  <p className="mt-1 line-clamp-2">
                    Skills: {candidate.skills.slice(0, 8).join(", ")}
                    {candidate.skills.length > 8 ? "…" : ""}
                  </p>
                ) : null}
              </div>
            ) : null}
            <label className="mt-5 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#d9dde6] bg-[#f8f9fc] py-8 text-center transition hover:bg-[#f3f4f8]">
              <IconOrb icon={Upload} size="sm" />
              <span className="mt-3 text-xs text-muted-foreground">
                {candidate?.resumeName ?? "Click and paste anywhere in this box"}
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file || !candidate) return;
                  void uploadResume(file)
                    .then(() => {
                      document.getElementById("matches")?.scrollIntoView({ behavior: "smooth", block: "start" });
                    })
                    .catch((err: Error) => toast.error(err.message || "Upload failed"));
                }}
              />
            </label>
            <Button
              type="button"
              className="mt-5 h-11 w-full rounded-full"
              onClick={() => {
                if (!candidate?.resumeName) {
                  toast.message("Upload a CV first for tighter matches.");
                  return;
                }
                const top = recommended[0];
                toast.success(
                  top
                    ? `Top match: ${top.job.title} (${top.score}% fit)`
                    : "No roles under these filters — widen salary or industry.",
                );
                document.getElementById("matches")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              Get Matched
            </Button>
          </div>
          <div className="rounded-[1.85rem] bg-white p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <IconOrb icon={Building2} size="sm" />
              <p className="text-sm font-medium">Company / Industry</p>
            </div>
            <NativeSelect className="mt-3" value={industry} onChange={(e) => setIndustry(e.target.value)}>
              <option value="">All industries</option>
              {CATEGORIES.map((category) => (
                <option key={category.slug} value={category.name}>
                  {category.name}
                </option>
              ))}
            </NativeSelect>
            <div className="mt-6 flex items-center gap-3">
              <IconOrb icon={Clock} size="sm" />
              <p className="text-sm font-medium">Work mode</p>
            </div>
            <NativeSelect className="mt-3" value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="">Any work mode</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </NativeSelect>
            <div className="mt-6 flex items-center gap-3">
              <IconOrb icon={Wallet} size="sm" />
              <p className="text-sm font-medium">Salary Range</p>
            </div>
            <input
              type="range"
              min={5}
              max={40}
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="premium-range mt-5"
              style={{ background: `linear-gradient(to right, #111 ${(salary / 40) * 100}%, #e7e9ef ${(salary / 40) * 100}%)` }}
            />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>₹5L</span>
              <span>₹{salary}L+</span>
            </div>
          </div>
        </aside>
        <div id="matches">
          {recommended.length ? (
            <div className="grid gap-6 md:grid-cols-2">
              {recommended.map(({ job, score }, index) => (
                <JobCard
                  key={job.id}
                  job={job}
                  featured={index === 0 && Boolean(candidate)}
                  matchScore={candidate ? score : null}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No matches with these filters"
              description="Widen industry, work mode or salary to see more roles."
              action={
                <>
                  <Button
                    className="h-10 rounded-full px-4"
                    onClick={() => {
                      setIndustry("");
                      setMode("");
                      setSalary(5);
                    }}
                  >
                    Clear filters
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 rounded-full px-4"
                    onClick={() => router.push("/candidate/jobs")}
                  >
                    Browse all jobs
                  </Button>
                </>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
