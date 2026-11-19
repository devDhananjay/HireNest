"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { articles, testimonials } from "@/lib/demo/seed";
import type {
  Application,
  ApplicationStatus,
  Candidate,
  CandidateNote,
  Client,
  Company,
  Inquiry,
  Interview,
  Job,
  Lead,
  NotificationItem,
  PipelineItem,
  PipelineStage,
  SessionUser,
} from "@/lib/types";

type DemoState = {
  users: SessionUser[];
  companies: Company[];
  jobs: Job[];
  candidates: Candidate[];
  applications: Application[];
  interviews: Interview[];
  leads: Lead[];
  inquiries: Inquiry[];
  pipeline: PipelineItem[];
  notes: CandidateNote[];
  notifications: NotificationItem[];
  clients: Client[];
  savedJobIds: Record<string, string[]>;
  recentlyViewed: Record<string, string[]>;
};

type DemoContextValue = DemoState & {
  ready: boolean;
  session: SessionUser | null;
  setSession: (user: SessionUser | null) => void;
  refresh: () => Promise<void>;
  companyById: (id: string) => Company | undefined;
  jobBySlug: (slug: string) => Job | undefined;
  candidateByUserId: (userId: string) => Candidate | undefined;
  applyToJob: (jobId: string) => void;
  toggleSaveJob: (jobId: string) => void;
  markJobViewed: (jobId: string) => void;
  addLead: (lead: Omit<Lead, "id" | "createdAt" | "status">) => void;
  addInquiry: (inquiry: Omit<Inquiry, "id" | "createdAt">) => void;
  createJob: (job: Omit<Job, "id" | "slug" | "postedAt" | "status" | "featured"> & { status?: Job["status"] }) => Job;
  updateJob: (id: string, patch: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  updateApplicationStatus: (id: string, status: ApplicationStatus, note?: string) => void;
  scheduleInterview: (input: Omit<Interview, "id" | "status">) => void;
  movePipeline: (id: string, stage: PipelineStage) => void;
  addNote: (candidateId: string, body: string) => void;
  updateCandidate: (id: string, patch: Partial<Candidate>) => void;
  updateCompany: (id: string, patch: Partial<Company>) => void;
  registerUser: (user: SessionUser, candidate?: Partial<Candidate>, company?: Partial<Company>, password?: string) => void;
  verifyPassword: (email: string, password: string) => boolean;
  approveJob: (id: string, approve: boolean) => void;
  approveCompany: (id: string, verified: boolean) => void;
  updateLeadStatus: (id: string, status: Lead["status"]) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  uploadResume: (file: File) => Promise<void>;
};

const emptyState: DemoState = {
  users: [],
  companies: [],
  jobs: [],
  candidates: [],
  applications: [],
  interviews: [],
  leads: [],
  inquiries: [],
  pipeline: [],
  notes: [],
  notifications: [],
  clients: [],
  savedJobIds: {},
  recentlyViewed: {},
};

const DemoContext = createContext<DemoContextValue | null>(null);

async function apiAction(action: string, payload: Record<string, unknown> = {}) {
  const res = await fetch("/api/actions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(emptyState);
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<SessionUser | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/bootstrap", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load workspace");
    const data = await res.json();
    setSession(data.session ?? null);
    setState({
      users: data.users ?? [],
      companies: data.companies ?? [],
      jobs: data.jobs ?? [],
      candidates: data.candidates ?? [],
      applications: data.applications ?? [],
      interviews: data.interviews ?? [],
      leads: data.leads ?? [],
      inquiries: data.inquiries ?? [],
      pipeline: data.pipeline ?? [],
      notes: data.notes ?? [],
      notifications: data.notifications ?? [],
      clients: data.clients ?? [],
      savedJobIds: data.savedJobIds ?? {},
      recentlyViewed: data.recentlyViewed ?? {},
    });
  }, []);

  useEffect(() => {
    refresh()
      .catch((error) => {
        console.error(error);
        toast.error("Could not load HIREORA data. Is the database running?");
      })
      .finally(() => setReady(true));
  }, [refresh]);

  const run = useCallback(
    async (action: string, payload: Record<string, unknown> = {}, success?: string) => {
      try {
        const data = await apiAction(action, payload);
        await refresh();
        if (success) toast.success(success);
        return data;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Something went wrong");
        throw error;
      }
    },
    [refresh],
  );

  const value = useMemo<DemoContextValue>(() => {
    return {
      ...state,
      ready,
      session,
      setSession,
      refresh,
      companyById: (id) => state.companies.find((c) => c.id === id),
      jobBySlug: (slug) => state.jobs.find((j) => j.slug === slug),
      candidateByUserId: (userId) => state.candidates.find((c) => c.userId === userId),
      applyToJob: (jobId) => {
        void run("applyToJob", { jobId }, "Application submitted");
      },
      toggleSaveJob: (jobId) => {
        void run("toggleSaveJob", { jobId }).then((data) => {
          toast.success(data.saved ? "Job saved" : "Removed from saved jobs");
        });
      },
      markJobViewed: (jobId) => {
        if (!session) return;
        setState((prev) => {
          const current = prev.recentlyViewed[session.id] ?? [];
          if (current[0] === jobId) return prev;
          return {
            ...prev,
            recentlyViewed: {
              ...prev.recentlyViewed,
              [session.id]: [jobId, ...current.filter((id) => id !== jobId)].slice(0, 8),
            },
          };
        });
      },
      addLead: (lead) => {
        void (async () => {
          const res = await fetch("/api/actions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "addLead", payload: lead }),
          });
          const data = await res.json().catch(() => ({}));
          await refresh();
          if (!res.ok) {
            toast.error(data.error || "Could not submit hiring request");
            return;
          }
          const label = data.qualify?.label ? ` · ${data.qualify.label} lead` : "";
          toast.success(`Hiring request received${label}. A consultant will follow up.`);
        })();
      },
      addInquiry: (inquiry) => {
        void run("addInquiry", inquiry, "Message sent. We will reply within one business day.");
      },
      createJob: (job) => {
        const optimistic: Job = {
          ...job,
          id: `tmp-${Date.now()}`,
          slug: `tmp-${Date.now()}`,
          postedAt: new Date().toISOString(),
          featured: false,
          status: job.status ?? "pending",
        };
        void run("createJob", job as unknown as Record<string, unknown>, "Job submitted for review.");
        return optimistic;
      },
      updateJob: (id, patch) => {
        void run("updateJob", { id, patch }, "Job updated.");
      },
      deleteJob: (id) => {
        void run("deleteJob", { id }, "Job removed.");
      },
      updateApplicationStatus: (id, status, note) => {
        void run("updateApplicationStatus", { id, status, note }, `Application marked ${status}`);
      },
      scheduleInterview: (input) => {
        void run("scheduleInterview", input as unknown as Record<string, unknown>, "Interview scheduled.");
      },
      movePipeline: (id, stage) => {
        void run("movePipeline", { id, stage }, "Pipeline updated");
      },
      addNote: (candidateId, body) => {
        void run("addNote", { candidateId, body }, "Note saved.");
      },
      updateCandidate: (id, patch) => {
        void run("updateCandidate", { id, patch }, "Profile saved.");
      },
      updateCompany: (id, patch) => {
        void run("updateCompany", { id, patch }, "Company profile saved.");
      },
      registerUser: () => {
        /* registration goes through /api/auth/register + verify-otp */
      },
      verifyPassword: () => true,
      approveJob: (id, approve) => {
        void run("approveJob", { id, approve }, approve ? "Job approved." : "Job rejected.");
      },
      approveCompany: (id, verified) => {
        void run("approveCompany", { id, verified }, verified ? "Company verified." : "Verification removed.");
      },
      updateLeadStatus: (id, status) => {
        void run("updateLeadStatus", { id, status }, `Lead marked ${status}`);
      },
      markNotificationRead: (id) => {
        void run("markNotificationRead", { id });
      },
      markAllNotificationsRead: () => {
        void run("markAllNotificationsRead", {});
      },
      uploadResume: async (file) => {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/resumes", { method: "POST", body: form });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Upload failed");
        await refresh();
        const provider = data.parsed?.provider === "openai" ? "AI" : "parser";
        const skills = data.parsed?.skills?.length ?? 0;
        const years = data.parsed?.yearsExperience;
        toast.success(
          `Resume uploaded · ${provider} extracted ${skills} skills${years ? ` · ${years}+ yrs` : ""}${
            data.parsed?.currentTitle ? ` · ${data.parsed.currentTitle}` : ""
          }`,
        );
      },
    };
  }, [ready, refresh, run, session, state]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}

export { articles, testimonials };
