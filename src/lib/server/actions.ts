import { profileCompleteness } from "@/lib/matching";
import { requireSession } from "@/lib/server/auth";
import { notifyUser, sendWhatsAppReminder } from "@/lib/server/notify";
import { prisma } from "@/lib/server/prisma";
import { slugify } from "@/lib/server/slug";
import type {
  Application,
  ApplicationStatus,
  Candidate,
  Company,
  Interview,
  Job,
  Lead,
  PipelineStage,
} from "@/lib/types";
import type { JobStatus } from "@/generated/prisma/client";

function uid(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export async function runAction(action: string, payload: Record<string, unknown>) {
  switch (action) {
    case "applyToJob": {
      const auth = await requireSession(["candidate"]);
      if (auth.error) return auth.error;
      const jobId = String(payload.jobId);
      const candidate = await prisma.candidateProfile.findUnique({ where: { userId: auth.session.id } });
      if (!candidate) return Response.json({ error: "Complete your candidate profile first." }, { status: 400 });
      const job = await prisma.job.findUnique({ where: { id: jobId } });
      if (!job || job.status !== "active") {
        return Response.json({ error: "This role is not accepting applications." }, { status: 400 });
      }
      const existing = await prisma.application.findUnique({
        where: { jobId_candidateId: { jobId, candidateId: candidate.id } },
      });
      if (existing) return Response.json({ error: "Already applied", already: true }, { status: 409 });
      const application = await prisma.application.create({
        data: {
          jobId,
          candidateId: candidate.id,
          status: "Applied",
          timeline: [{ status: "Applied", at: new Date().toISOString(), note: "Application received" }],
        },
      });
      await notifyUser(auth.session.id, "Application submitted", `You applied for ${job.title}.`);
      return Response.json({ ok: true, application });
    }

    case "toggleSaveJob": {
      const auth = await requireSession(["candidate"]);
      if (auth.error) return auth.error;
      const jobId = String(payload.jobId);
      const existing = await prisma.savedJob.findUnique({
        where: { userId_jobId: { userId: auth.session.id, jobId } },
      });
      if (existing) {
        await prisma.savedJob.delete({ where: { id: existing.id } });
        return Response.json({ ok: true, saved: false });
      }
      await prisma.savedJob.create({ data: { userId: auth.session.id, jobId } });
      return Response.json({ ok: true, saved: true });
    }

    case "addLead": {
      const lead = await prisma.lead.create({
        data: {
          companyName: String(payload.companyName ?? ""),
          contactName: String(payload.contactName ?? ""),
          email: String(payload.email ?? ""),
          phone: String(payload.phone ?? ""),
          hiringNeed: String(payload.hiringNeed ?? ""),
          roles: String(payload.roles ?? ""),
          location: String(payload.location ?? ""),
        },
      });
      return Response.json({ ok: true, lead });
    }

    case "addInquiry": {
      const inquiry = await prisma.inquiry.create({
        data: {
          name: String(payload.name ?? ""),
          email: String(payload.email ?? ""),
          topic: String(payload.topic ?? ""),
          message: String(payload.message ?? ""),
        },
      });
      return Response.json({ ok: true, inquiry });
    }

    case "createJob": {
      const auth = await requireSession(["employer", "admin"]);
      if (auth.error) return auth.error;
      const input = payload as Partial<Job> & { companyId?: string };
      const companyId = input.companyId || auth.session.companyId;
      if (!companyId) return Response.json({ error: "Company required" }, { status: 400 });
      const job = await prisma.job.create({
        data: {
          id: uid("job"),
          slug: slugify(`${input.title}-${Date.now()}`),
          title: String(input.title),
          companyId,
          department: String(input.department ?? ""),
          category: String(input.category ?? "IT & Software"),
          description: String(input.description ?? ""),
          responsibilities: input.responsibilities ?? [],
          requirements: input.requirements ?? [],
          skills: input.skills ?? [],
          location: String(input.location ?? ""),
          employmentType: String(input.employmentType ?? "Full-time"),
          workMode: String(input.workMode ?? "Hybrid"),
          experienceMin: Number(input.experienceMin ?? 0),
          experienceMax: Number(input.experienceMax ?? 0),
          salaryMin: Number(input.salaryMin ?? 0),
          salaryMax: Number(input.salaryMax ?? 0),
          openings: Number(input.openings ?? 1),
          deadline: input.deadline ? new Date(String(input.deadline)) : null,
          status: (input.status as JobStatus) ?? "pending",
        },
      });
      return Response.json({ ok: true, job });
    }

    case "updateJob": {
      const auth = await requireSession(["employer", "admin", "recruiter"]);
      if (auth.error) return auth.error;
      const id = String(payload.id);
      const patch = { ...(payload.patch as Partial<Job>) };
      const job = await prisma.job.update({
        where: { id },
        data: {
          ...(patch.title !== undefined ? { title: patch.title } : {}),
          ...(patch.department !== undefined ? { department: patch.department } : {}),
          ...(patch.description !== undefined ? { description: patch.description } : {}),
          ...(patch.status !== undefined ? { status: patch.status as JobStatus } : {}),
          ...(patch.featured !== undefined ? { featured: patch.featured } : {}),
        },
      });
      return Response.json({ ok: true, job });
    }

    case "deleteJob": {
      const auth = await requireSession(["employer", "admin"]);
      if (auth.error) return auth.error;
      await prisma.job.delete({ where: { id: String(payload.id) } });
      return Response.json({ ok: true });
    }

    case "updateApplicationStatus": {
      const auth = await requireSession(["employer", "recruiter", "admin"]);
      if (auth.error) return auth.error;
      const id = String(payload.id);
      const status = String(payload.status) as ApplicationStatus;
      const note = payload.note ? String(payload.note) : `Status changed to ${status}`;
      const current = await prisma.application.findUnique({ where: { id } });
      if (!current) return Response.json({ error: "Not found" }, { status: 404 });
      const timeline = [
        ...((current.timeline as Application["timeline"]) ?? []),
        { status, at: new Date().toISOString(), note },
      ];
      const application = await prisma.application.update({
        where: { id },
        data: { status, timeline },
        include: { candidate: true },
      });
      await notifyUser(application.candidate.userId, "Application update", `Status is now ${status}.`);
      return Response.json({ ok: true, application });
    }

    case "scheduleInterview": {
      const auth = await requireSession(["employer", "recruiter", "admin"]);
      if (auth.error) return auth.error;
      const input = payload as Omit<Interview, "id" | "status">;
      const interview = await prisma.interview.create({
        data: {
          applicationId: input.applicationId || null,
          jobId: input.jobId,
          candidateId: input.candidateId,
          companyId: input.companyId,
          scheduledAt: new Date(input.scheduledAt),
          mode: input.mode,
          location: input.location,
          interviewer: input.interviewer,
          status: "Scheduled",
        },
      });
      if (input.applicationId) {
        const app = await prisma.application.findUnique({ where: { id: input.applicationId } });
        if (app) {
          const timeline = [
            ...((app.timeline as Application["timeline"]) ?? []),
            {
              status: "Interview Scheduled" as const,
              at: new Date().toISOString(),
              note: `Interview scheduled with ${input.interviewer}`,
            },
          ];
          await prisma.application.update({
            where: { id: app.id },
            data: { status: "Interview Scheduled", timeline },
          });
        }
      }
      const candidate = await prisma.candidateProfile.findUnique({
        where: { id: input.candidateId },
        include: { user: true },
      });
      if (candidate) {
        await notifyUser(
          candidate.userId,
          "Interview scheduled",
          `${input.mode} interview with ${input.interviewer}.`,
        );
        if (candidate.phone) {
          await sendWhatsAppReminder(
            candidate.phone.replace(/\s/g, ""),
            `HIREORA reminder: ${input.mode} interview with ${input.interviewer} at ${input.scheduledAt}`,
          );
        }
      }
      return Response.json({ ok: true, interview });
    }

    case "movePipeline": {
      const auth = await requireSession(["recruiter", "admin"]);
      if (auth.error) return auth.error;
      const item = await prisma.pipelineItem.update({
        where: { id: String(payload.id) },
        data: { stage: payload.stage as PipelineStage },
      });
      return Response.json({ ok: true, item });
    }

    case "addNote": {
      const auth = await requireSession(["recruiter", "employer", "admin"]);
      if (auth.error) return auth.error;
      const body = String(payload.body ?? "").trim();
      if (!body) return Response.json({ error: "Write a note first." }, { status: 400 });
      const note = await prisma.candidateNote.create({
        data: {
          candidateId: String(payload.candidateId),
          author: auth.session.name,
          body,
        },
      });
      return Response.json({ ok: true, note });
    }

    case "updateCandidate": {
      const auth = await requireSession(["candidate", "admin", "recruiter"]);
      if (auth.error) return auth.error;
      const id = String(payload.id);
      const patch = payload.patch as Partial<Candidate>;
      const current = await prisma.candidateProfile.findUnique({
        where: { id },
        include: { user: true },
      });
      if (!current) return Response.json({ error: "Not found" }, { status: 404 });
      if (auth.session.role === "candidate" && current.userId !== auth.session.id) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
      const next = {
        ...current,
        ...patch,
        education: patch.education ?? current.education,
        experience: patch.experience ?? current.experience,
        skills: patch.skills ?? current.skills,
      };
      const completeness = profileCompleteness({
        name: patch.name ?? current.user.name,
        phone: next.phone,
        location: next.location,
        currentTitle: next.currentTitle,
        expectedSalary: next.expectedSalary,
        skills: next.skills,
        education: next.education as Candidate["education"],
        experience: next.experience as Candidate["experience"],
        resumeName: next.resumeName,
        noticePeriod: next.noticePeriod,
      });
      if (patch.name) {
        await prisma.user.update({ where: { id: current.userId }, data: { name: patch.name } });
      }
      const candidate = await prisma.candidateProfile.update({
        where: { id },
        data: {
          phone: patch.phone ?? undefined,
          location: patch.location ?? undefined,
          currentTitle: patch.currentTitle ?? undefined,
          expectedSalary: patch.expectedSalary ?? undefined,
          preferredLocations: patch.preferredLocations ?? undefined,
          noticePeriod: patch.noticePeriod ?? undefined,
          linkedin: patch.linkedin ?? undefined,
          skills: patch.skills ?? undefined,
          education: patch.education ?? undefined,
          experience: patch.experience ?? undefined,
          resumeName: patch.resumeName ?? undefined,
          resumeUrl: patch.resumeUrl ?? undefined,
          tags: patch.tags ?? undefined,
          completeness,
        },
        include: { user: true },
      });
      return Response.json({ ok: true, candidate });
    }

    case "updateCompany": {
      const auth = await requireSession(["employer", "admin"]);
      if (auth.error) return auth.error;
      const id = String(payload.id);
      const patch = payload.patch as Partial<Company>;
      if (auth.session.role === "employer" && auth.session.companyId !== id) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
      const company = await prisma.company.update({
        where: { id },
        data: {
          name: patch.name,
          industry: patch.industry,
          location: patch.location,
          website: patch.website,
          about: patch.about,
          employees: patch.employees,
          logoColor: patch.logoColor,
        },
      });
      return Response.json({ ok: true, company });
    }

    case "approveJob": {
      const auth = await requireSession(["admin"]);
      if (auth.error) return auth.error;
      const job = await prisma.job.update({
        where: { id: String(payload.id) },
        data: { status: payload.approve ? "active" : "rejected" },
      });
      return Response.json({ ok: true, job });
    }

    case "approveCompany": {
      const auth = await requireSession(["admin"]);
      if (auth.error) return auth.error;
      const company = await prisma.company.update({
        where: { id: String(payload.id) },
        data: { verified: Boolean(payload.verified) },
      });
      return Response.json({ ok: true, company });
    }

    case "updateLeadStatus": {
      const auth = await requireSession(["admin", "recruiter"]);
      if (auth.error) return auth.error;
      const lead = await prisma.lead.update({
        where: { id: String(payload.id) },
        data: { status: String(payload.status) as Lead["status"] },
      });
      return Response.json({ ok: true, lead });
    }

    case "markNotificationRead": {
      const auth = await requireSession();
      if (auth.error) return auth.error;
      await prisma.notification.updateMany({
        where: { id: String(payload.id), userId: auth.session.id },
        data: { read: true },
      });
      return Response.json({ ok: true });
    }

    case "markAllNotificationsRead": {
      const auth = await requireSession();
      if (auth.error) return auth.error;
      await prisma.notification.updateMany({
        where: { userId: auth.session.id },
        data: { read: true },
      });
      return Response.json({ ok: true });
    }

    case "updateSettings": {
      const auth = await requireSession(["admin"]);
      if (auth.error) return auth.error;
      const settings = await prisma.platformSettings.upsert({
        where: { id: "default" },
        create: {
          id: "default",
          emailUpdates: Boolean(payload.emailUpdates ?? true),
          whatsappReminders: Boolean(payload.whatsappReminders ?? false),
        },
        update: {
          ...(payload.emailUpdates !== undefined ? { emailUpdates: Boolean(payload.emailUpdates) } : {}),
          ...(payload.whatsappReminders !== undefined
            ? { whatsappReminders: Boolean(payload.whatsappReminders) }
            : {}),
        },
      });
      return Response.json({ ok: true, settings });
    }

    case "setUserDisabled": {
      const auth = await requireSession(["admin"]);
      if (auth.error) return auth.error;
      const user = await prisma.user.update({
        where: { id: String(payload.id) },
        data: { disabled: Boolean(payload.disabled) },
      });
      return Response.json({ ok: true, user: { id: user.id, disabled: user.disabled } });
    }

    default:
      return Response.json({ error: `Unknown action: ${action}` }, { status: 400 });
  }
}
