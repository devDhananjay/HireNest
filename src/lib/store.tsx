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
import {
  applications as seedApplications,
  articles,
  candidates as seedCandidates,
  clients,
  companies as seedCompanies,
  inquiries as seedInquiries,
  interviews as seedInterviews,
  jobs as seedJobs,
  leads as seedLeads,
  notes as seedNotes,
  notifications as seedNotifications,
  pipeline as seedPipeline,
  recentlyViewed as seedViewed,
  savedJobIds as seedSaved,
  testimonials,
  users as seedUsers,
} from "@/lib/demo/seed";
import { profileCompleteness } from "@/lib/matching";
import { readClientSession } from "@/lib/session";
import { slugify } from "@/lib/format";
import type {
  Application,
  ApplicationStatus,
  Candidate,
  CandidateNote,
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

const STORAGE_KEY = "hireora.demo.v1";

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
  savedJobIds: Record<string, string[]>;
  recentlyViewed: Record<string, string[]>;
};

const seedState: DemoState = {
  users: seedUsers,
  companies: seedCompanies,
  jobs: seedJobs,
  candidates: seedCandidates,
  applications: seedApplications,
  interviews: seedInterviews,
  leads: seedLeads,
  inquiries: seedInquiries,
  pipeline: seedPipeline,
  notes: seedNotes,
  notifications: seedNotifications,
  savedJobIds: seedSaved,
  recentlyViewed: seedViewed,
};

type DemoContextValue = DemoState & {
  ready: boolean;
  session: SessionUser | null;
  setSession: (user: SessionUser | null) => void;
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
  registerUser: (user: SessionUser, candidate?: Partial<Candidate>, company?: Partial<Company>) => void;
  approveJob: (id: string, approve: boolean) => void;
  approveCompany: (id: string, verified: boolean) => void;
  updateLeadStatus: (id: string, status: Lead["status"]) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(seedState);
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<SessionUser | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setState({ ...seedState, ...JSON.parse(raw) });
      } catch {
        setState(seedState);
      }
    }
    setSession(readClientSession());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || session) return;
    const cookie = readClientSession();
    if (cookie) setSession(cookie);
  }, [ready, session]);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);

  const notify = useCallback((userId: string, title: string, body: string) => {
    setState((prev) => ({
      ...prev,
      notifications: [
        {
          id: uid("n"),
          userId,
          title,
          body,
          createdAt: new Date().toISOString(),
          read: false,
        },
        ...prev.notifications,
      ],
    }));
    toast.message("Demo email queued", { description: `${title} — ${body}` });
  }, []);

  const value = useMemo<DemoContextValue>(() => {
    const companyById = (id: string) => state.companies.find((c) => c.id === id);
    const jobBySlug = (slug: string) => state.jobs.find((j) => j.slug === slug);
    const candidateByUserId = (userId: string) =>
      state.candidates.find((c) => c.userId === userId);

    return {
      ...state,
      ready,
      session,
      setSession,
      companyById,
      jobBySlug,
      candidateByUserId,
      applyToJob: (jobId) => {
        if (!session || session.role !== "candidate") {
          toast.error("Sign in as a candidate to apply.");
          return;
        }
        const candidate = candidateByUserId(session.id);
        if (!candidate) {
          toast.error("Complete your candidate profile first.");
          return;
        }
        if (state.applications.some((a) => a.jobId === jobId && a.candidateId === candidate.id)) {
          toast.message("You have already applied to this role.");
          return;
        }
        const job = state.jobs.find((j) => j.id === jobId);
        if (job && job.status !== "active") {
          toast.error("This role is not accepting applications.");
          return;
        }
        const application: Application = {
          id: uid("app"),
          jobId,
          candidateId: candidate.id,
          status: "Applied",
          appliedAt: new Date().toISOString(),
          timeline: [
            { status: "Applied", at: new Date().toISOString(), note: "Application received" },
          ],
        };
        setState((prev) => ({ ...prev, applications: [application, ...prev.applications] }));
        toast.success(`Applied to ${job?.title ?? "role"}`);
        if (job) notify(session.id, "Application submitted", `You applied for ${job.title}.`);
      },
      toggleSaveJob: (jobId) => {
        if (!session || session.role !== "candidate") {
          toast.error("Sign in as a candidate to save jobs.");
          return;
        }
        const current = state.savedJobIds[session.id] ?? [];
        const saving = !current.includes(jobId);
        setState((prev) => {
          const ids = prev.savedJobIds[session.id] ?? [];
          const next = ids.includes(jobId) ? ids.filter((id) => id !== jobId) : [jobId, ...ids];
          return { ...prev, savedJobIds: { ...prev.savedJobIds, [session.id]: next } };
        });
        toast.success(saving ? "Job saved" : "Removed from saved jobs");
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
        const item: Lead = {
          ...lead,
          id: uid("lead"),
          createdAt: new Date().toISOString(),
          status: "New",
        };
        setState((prev) => ({ ...prev, leads: [item, ...prev.leads] }));
        toast.success("Hiring request received. A consultant will follow up.");
      },
      addInquiry: (inquiry) => {
        setState((prev) => ({
          ...prev,
          inquiries: [
            { ...inquiry, id: uid("inq"), createdAt: new Date().toISOString() },
            ...prev.inquiries,
          ],
        }));
        toast.success("Message sent. We will reply within one business day.");
      },
      createJob: (input) => {
        const created: Job = {
          ...input,
          id: uid("job"),
          slug: slugify(`${input.title}-${Date.now()}`),
          postedAt: new Date().toISOString(),
          featured: false,
          status: input.status ?? "pending",
        };
        setState((prev) => ({ ...prev, jobs: [created, ...prev.jobs] }));
        toast.success("Job submitted for review.");
        return created;
      },
      updateJob: (id, patch) => {
        setState((prev) => ({
          ...prev,
          jobs: prev.jobs.map((job) => (job.id === id ? { ...job, ...patch } : job)),
        }));
        toast.success("Job updated.");
      },
      deleteJob: (id) => {
        setState((prev) => ({ ...prev, jobs: prev.jobs.filter((job) => job.id !== id) }));
        toast.success("Job removed.");
      },
      updateApplicationStatus: (id, status, note) => {
        setState((prev) => ({
          ...prev,
          applications: prev.applications.map((app) =>
            app.id === id
              ? {
                  ...app,
                  status,
                  timeline: [
                    ...app.timeline,
                    {
                      status,
                      at: new Date().toISOString(),
                      note: note ?? `Status changed to ${status}`,
                    },
                  ],
                }
              : app,
          ),
        }));
        const app = state.applications.find((a) => a.id === id);
        const candidate = state.candidates.find((c) => c.id === app?.candidateId);
        if (candidate) notify(candidate.userId, "Application update", `Status is now ${status}.`);
        toast.success(`Application marked ${status}`);
      },
      scheduleInterview: (input) => {
        const item: Interview = { ...input, id: uid("int"), status: "Scheduled" };
        setState((prev) => ({
          ...prev,
          interviews: [item, ...prev.interviews],
          applications: prev.applications.map((app) =>
            app.id === input.applicationId
              ? {
                  ...app,
                  status: "Interview Scheduled",
                  timeline: [
                    ...app.timeline,
                    {
                      status: "Interview Scheduled",
                      at: new Date().toISOString(),
                      note: `Interview scheduled with ${input.interviewer}`,
                    },
                  ],
                }
              : app,
          ),
        }));
        const candidate = state.candidates.find((c) => c.id === input.candidateId);
        if (candidate) {
          notify(candidate.userId, "Interview scheduled", `${input.mode} interview with ${input.interviewer}.`);
        }
        toast.success("Interview scheduled.");
      },
      movePipeline: (id, stage) => {
        setState((prev) => ({
          ...prev,
          pipeline: prev.pipeline.map((item) => (item.id === id ? { ...item, stage } : item)),
        }));
        toast.success("Pipeline updated");
      },
      addNote: (candidateId, body) => {
        if (!body.trim()) {
          toast.error("Write a note first.");
          return;
        }
        setState((prev) => ({
          ...prev,
          notes: [
            {
              id: uid("note"),
              candidateId,
              author: session?.name ?? "Recruiter",
              body,
              createdAt: new Date().toISOString(),
            },
            ...prev.notes,
          ],
        }));
        toast.success("Note saved.");
      },
      updateCandidate: (id, patch) => {
        setState((prev) => ({
          ...prev,
          candidates: prev.candidates.map((candidate) => {
            if (candidate.id !== id) return candidate;
            const next = { ...candidate, ...patch };
            return { ...next, completeness: profileCompleteness(next) };
          }),
        }));
        toast.success("Profile saved.");
      },
      updateCompany: (id, patch) => {
        setState((prev) => ({
          ...prev,
          companies: prev.companies.map((company) => (company.id === id ? { ...company, ...patch } : company)),
        }));
        toast.success("Company profile saved.");
      },
      registerUser: (user, candidate, company) => {
        if (user.role === "employer" && company?.name && !user.companyId) {
          user.companyId = uid("co");
        }
        setState((prev) => {
          const next: DemoState = {
            ...prev,
            users: [...prev.users.filter((u) => u.email !== user.email), user],
          };
          if (user.role === "candidate") {
            next.candidates = [
              {
                id: uid("cand"),
                userId: user.id,
                name: user.name,
                email: user.email,
                phone: candidate?.phone ?? "",
                photoInitials: user.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2),
                location: candidate?.location ?? "",
                currentTitle: candidate?.currentTitle ?? "",
                expectedSalary: candidate?.expectedSalary ?? 0,
                preferredLocations: candidate?.preferredLocations ?? [],
                noticePeriod: candidate?.noticePeriod ?? "",
                linkedin: "",
                skills: [],
                education: [],
                experience: [],
                resumeName: "",
                completeness: 20,
                tags: ["New"],
              },
              ...prev.candidates,
            ];
          }
          if (user.role === "employer" && company?.name && user.companyId) {
            next.companies = [
              {
                id: user.companyId,
                slug: slugify(company.name),
                name: company.name,
                industry: company.industry ?? "General",
                location: company.location ?? "India",
                website: company.website ?? "",
                about: company.about ?? "New employer on HIREORA.",
                employees: "1-50",
                founded: String(new Date().getFullYear()),
                logoColor: "#111111",
                verified: false,
                hiring: true,
              },
              ...prev.companies,
            ];
          }
          return next;
        });
      },
      approveJob: (id, approve) => {
        setState((prev) => ({
          ...prev,
          jobs: prev.jobs.map((job) =>
            job.id === id ? { ...job, status: approve ? "active" : "rejected" } : job,
          ),
        }));
        toast.success(approve ? "Job approved." : "Job rejected.");
      },
      approveCompany: (id, verified) => {
        setState((prev) => ({
          ...prev,
          companies: prev.companies.map((company) =>
            company.id === id ? { ...company, verified } : company,
          ),
        }));
        toast.success(verified ? "Company verified." : "Verification removed.");
      },
      updateLeadStatus: (id, status) => {
        setState((prev) => ({
          ...prev,
          leads: prev.leads.map((lead) => (lead.id === id ? { ...lead, status } : lead)),
        }));
        toast.success(`Lead marked ${status}`);
      },
      markNotificationRead: (id) => {
        setState((prev) => ({
          ...prev,
          notifications: prev.notifications.map((item) =>
            item.id === id ? { ...item, read: true } : item,
          ),
        }));
      },
      markAllNotificationsRead: () => {
        if (!session) return;
        setState((prev) => ({
          ...prev,
          notifications: prev.notifications.map((item) =>
            item.userId === session.id ? { ...item, read: true } : item,
          ),
        }));
      },
    };
  }, [notify, ready, session, state]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
