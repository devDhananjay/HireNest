import { prisma } from "@/lib/server/prisma";
import {
  mapApplication,
  mapCandidate,
  mapClient,
  mapCompany,
  mapInquiry,
  mapInterview,
  mapJob,
  mapLead,
  mapNote,
  mapNotification,
  mapPipeline,
  mapSession,
} from "@/lib/server/mappers";
import type { SessionUser } from "@/lib/types";

export async function loadBootstrap(session: SessionUser | null) {
  const [
    companies,
    jobs,
    candidates,
    applications,
    interviews,
    leads,
    inquiries,
    pipeline,
    notes,
    notifications,
    clients,
    settings,
  ] = await Promise.all([
    prisma.company.findMany({ orderBy: { name: "asc" } }),
    prisma.job.findMany({ orderBy: { postedAt: "desc" } }),
    prisma.candidateProfile.findMany({ include: { user: true } }),
    prisma.application.findMany({ orderBy: { appliedAt: "desc" } }),
    prisma.interview.findMany({ orderBy: { scheduledAt: "desc" } }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.pipelineItem.findMany(),
    prisma.candidateNote.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.notification.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.client.findMany(),
    prisma.platformSettings.findUnique({ where: { id: "default" } }),
  ]);

  const users = await prisma.user.findMany({
    include: { employer: true },
    orderBy: { createdAt: "asc" },
  });

  const saved = session
    ? await prisma.savedJob.findMany({ where: { userId: session.id } })
    : [];

  const savedJobIds: Record<string, string[]> = {};
  for (const row of saved) {
    savedJobIds[row.userId] = [...(savedJobIds[row.userId] ?? []), row.jobId];
  }

  return {
    session,
    users: users.map(mapSession),
    companies: companies.map(mapCompany),
    jobs: jobs.map(mapJob),
    candidates: candidates.map(mapCandidate),
    applications: applications.map(mapApplication),
    interviews: interviews.map(mapInterview),
    leads: leads.map(mapLead),
    inquiries: inquiries.map(mapInquiry),
    pipeline: pipeline.map(mapPipeline),
    notes: notes.map(mapNote),
    notifications: notifications.map(mapNotification),
    clients: clients.map(mapClient),
    savedJobIds,
    recentlyViewed: {} as Record<string, string[]>,
    settings: settings ?? { emailUpdates: true, whatsappReminders: false },
  };
}
