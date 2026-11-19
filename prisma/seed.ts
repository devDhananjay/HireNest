import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type JobStatus, type PipelineStage } from "../src/generated/prisma/client";
import {
  applications,
  articles,
  candidates,
  clients,
  companies,
  inquiries,
  interviews,
  jobs,
  leads,
  notes,
  notifications,
  pipeline,
  savedJobIds,
  users,
} from "../src/lib/demo/seed";
import { DEMO_PASSWORD } from "../src/lib/constants";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  await prisma.article.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.candidateNote.deleteMany();
  await prisma.pipelineItem.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.application.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.savedJob.deleteMany();
  await prisma.recruitmentAssignment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.client.deleteMany();
  await prisma.job.deleteMany();
  await prisma.employerProfile.deleteMany();
  await prisma.candidateProfile.deleteMany();
  await prisma.recruiterProfile.deleteMany();
  await prisma.otpChallenge.deleteMany();
  await prisma.deletionRequest.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();
  await prisma.platformSettings.deleteMany();

  await prisma.platformSettings.create({
    data: { id: "default", emailUpdates: true, whatsappReminders: false },
  });

  for (const company of companies) {
    await prisma.company.create({
      data: {
        id: company.id,
        slug: company.slug,
        name: company.name,
        industry: company.industry,
        location: company.location,
        website: company.website,
        about: company.about,
        employees: company.employees,
        founded: company.founded,
        logoColor: company.logoColor,
        verified: company.verified,
        hiring: company.hiring,
      },
    });
  }

  const extraUsers = candidates
    .filter((c) => !users.some((u) => u.id === c.userId))
    .map((c) => ({
      id: c.userId,
      name: c.name,
      email: c.email,
      role: "candidate" as const,
    }));

  for (const user of [...users, ...extraUsers]) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email.toLowerCase(),
        name: user.name,
        role: user.role,
        passwordHash,
        phone: candidates.find((c) => c.userId === user.id)?.phone,
      },
    });

    if (user.role === "employer" && user.companyId) {
      await prisma.employerProfile.create({
        data: {
          userId: user.id,
          companyId: user.companyId,
        },
      });
    }
    if (user.role === "recruiter") {
      await prisma.recruiterProfile.create({ data: { userId: user.id } });
    }
  }

  for (const candidate of candidates) {
    await prisma.candidateProfile.create({
      data: {
        id: candidate.id,
        userId: candidate.userId,
        phone: candidate.phone,
        photoInitials: candidate.photoInitials,
        location: candidate.location,
        currentTitle: candidate.currentTitle,
        expectedSalary: candidate.expectedSalary,
        preferredLocations: candidate.preferredLocations,
        noticePeriod: candidate.noticePeriod,
        linkedin: candidate.linkedin,
        skills: candidate.skills,
        education: candidate.education,
        experience: candidate.experience,
        resumeName: candidate.resumeName,
        resumeUrl: candidate.resumeUrl,
        completeness: candidate.completeness,
        tags: candidate.tags,
        duplicateOfId: candidate.duplicateOf,
      },
    });
  }

  for (const job of jobs) {
    await prisma.job.create({
      data: {
        id: job.id,
        slug: job.slug,
        title: job.title,
        companyId: job.companyId,
        department: job.department,
        category: job.category,
        description: job.description,
        responsibilities: job.responsibilities,
        requirements: job.requirements,
        skills: job.skills,
        location: job.location,
        employmentType: job.employmentType,
        workMode: job.workMode,
        experienceMin: job.experienceMin,
        experienceMax: job.experienceMax,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        openings: job.openings,
        deadline: job.deadline ? new Date(job.deadline) : null,
        postedAt: new Date(job.postedAt),
        featured: job.featured,
        status: job.status as JobStatus,
      },
    });
  }

  for (const app of applications) {
    await prisma.application.create({
      data: {
        id: app.id,
        jobId: app.jobId,
        candidateId: app.candidateId,
        status: app.status,
        appliedAt: new Date(app.appliedAt),
        timeline: app.timeline,
      },
    });
  }

  for (const interview of interviews) {
    await prisma.interview.create({
      data: {
        id: interview.id,
        applicationId: interview.applicationId,
        jobId: interview.jobId,
        candidateId: interview.candidateId,
        companyId: interview.companyId,
        scheduledAt: new Date(interview.scheduledAt),
        mode: interview.mode,
        location: interview.location,
        interviewer: interview.interviewer,
        status: interview.status,
      },
    });
  }

  for (const item of pipeline) {
    await prisma.pipelineItem.create({
      data: {
        id: item.id,
        candidateId: item.candidateId,
        jobId: item.jobId,
        stage: item.stage as PipelineStage,
        recruiterId: item.recruiterId,
      },
    });
  }

  for (const note of notes) {
    await prisma.candidateNote.create({
      data: {
        id: note.id,
        candidateId: note.candidateId,
        author: note.author,
        body: note.body,
        createdAt: new Date(note.createdAt),
      },
    });
  }

  for (const lead of leads) {
    await prisma.lead.create({
      data: {
        id: lead.id,
        companyName: lead.companyName,
        contactName: lead.contactName,
        email: lead.email,
        phone: lead.phone,
        hiringNeed: lead.hiringNeed,
        roles: lead.roles,
        location: lead.location,
        status: lead.status,
        createdAt: new Date(lead.createdAt),
      },
    });
  }

  for (const inquiry of inquiries) {
    await prisma.inquiry.create({
      data: {
        id: inquiry.id,
        name: inquiry.name,
        email: inquiry.email,
        topic: inquiry.topic,
        message: inquiry.message,
        createdAt: new Date(inquiry.createdAt),
      },
    });
  }

  for (const client of clients) {
    await prisma.client.create({
      data: {
        id: client.id,
        companyId: client.companyId,
        accountOwner: client.accountOwner,
        openRoles: client.openRoles,
        sla: client.sla,
      },
    });
  }

  for (const note of notifications) {
    await prisma.notification.create({
      data: {
        id: note.id,
        userId: note.userId,
        title: note.title,
        body: note.body,
        read: note.read,
        createdAt: new Date(note.createdAt),
      },
    });
  }

  for (const [userId, jobIds] of Object.entries(savedJobIds)) {
    for (const jobId of jobIds) {
      await prisma.savedJob.create({ data: { userId, jobId } });
    }
  }

  for (const article of articles) {
    await prisma.article.create({
      data: {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        category: article.category,
        readTime: article.readTime,
        body: article.body,
        published: true,
        publishedAt: new Date(article.date),
      },
    });
  }

  console.log("HIREORA seed complete. Demo password:", DEMO_PASSWORD);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
