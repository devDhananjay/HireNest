import type {
  Application,
  ApplicationStatus,
  Candidate,
  CandidateNote,
  Client,
  Company,
  Education,
  Experience,
  Inquiry,
  Interview,
  Job,
  JobStatus,
  Lead,
  NotificationItem,
  PipelineItem,
  PipelineStage,
  SessionUser,
} from "@/lib/types";

type DbUser = {
  id: string;
  name: string;
  email: string;
  role: SessionUser["role"];
  employer?: { companyId: string } | null;
};

type DbCompany = {
  id: string;
  slug: string;
  name: string;
  industry: string;
  location: string;
  website: string;
  about: string;
  employees: string;
  founded: string;
  logoColor: string;
  verified: boolean;
  hiring: boolean;
};

type DbJob = {
  id: string;
  slug: string;
  title: string;
  companyId: string;
  department: string;
  category: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  location: string;
  employmentType: string;
  workMode: string;
  experienceMin: number;
  experienceMax: number;
  salaryMin: number;
  salaryMax: number;
  openings: number;
  deadline: Date | null;
  postedAt: Date;
  featured: boolean;
  status: string;
};

type DbCandidate = {
  id: string;
  userId: string;
  phone: string;
  photoInitials: string;
  location: string;
  currentTitle: string;
  expectedSalary: number;
  preferredLocations: string[];
  noticePeriod: string;
  linkedin: string;
  skills: string[];
  education: unknown;
  experience: unknown;
  resumeName: string;
  resumeUrl: string | null;
  completeness: number;
  tags: string[];
  duplicateOfId: string | null;
  user?: { name: string; email: string };
};

export function mapSession(user: DbUser): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    companyId: user.employer?.companyId,
  };
}

export function mapCompany(company: DbCompany): Company {
  return { ...company };
}

export function mapJob(job: DbJob): Job {
  return {
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
    employmentType: job.employmentType as Job["employmentType"],
    workMode: job.workMode as Job["workMode"],
    experienceMin: job.experienceMin,
    experienceMax: job.experienceMax,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    openings: job.openings,
    deadline: job.deadline ? job.deadline.toISOString().slice(0, 10) : "",
    postedAt: job.postedAt.toISOString(),
    featured: job.featured,
    status: job.status as JobStatus,
  };
}

export function mapCandidate(candidate: DbCandidate): Candidate {
  return {
    id: candidate.id,
    userId: candidate.userId,
    name: candidate.user?.name ?? "",
    email: candidate.user?.email ?? "",
    phone: candidate.phone,
    photoInitials: candidate.photoInitials,
    location: candidate.location,
    currentTitle: candidate.currentTitle,
    expectedSalary: candidate.expectedSalary,
    preferredLocations: candidate.preferredLocations,
    noticePeriod: candidate.noticePeriod,
    linkedin: candidate.linkedin,
    skills: candidate.skills,
    education: (candidate.education as Education[]) ?? [],
    experience: (candidate.experience as Experience[]) ?? [],
    resumeName: candidate.resumeName,
    resumeUrl: candidate.resumeUrl ?? undefined,
    completeness: candidate.completeness,
    tags: candidate.tags,
    duplicateOf: candidate.duplicateOfId ?? undefined,
  };
}

export function mapApplication(app: {
  id: string;
  jobId: string;
  candidateId: string;
  status: string;
  appliedAt: Date;
  timeline: unknown;
}): Application {
  return {
    id: app.id,
    jobId: app.jobId,
    candidateId: app.candidateId,
    status: app.status as ApplicationStatus,
    appliedAt: app.appliedAt.toISOString(),
    timeline: (app.timeline as Application["timeline"]) ?? [],
  };
}

export function mapInterview(item: {
  id: string;
  applicationId: string | null;
  jobId: string;
  candidateId: string;
  companyId: string;
  scheduledAt: Date;
  mode: string;
  location: string;
  interviewer: string;
  status: string;
}): Interview {
  return {
    id: item.id,
    applicationId: item.applicationId ?? "",
    jobId: item.jobId,
    candidateId: item.candidateId,
    companyId: item.companyId,
    scheduledAt: item.scheduledAt.toISOString(),
    mode: item.mode as Interview["mode"],
    location: item.location,
    interviewer: item.interviewer,
    status: item.status as Interview["status"],
  };
}

export function mapLead(lead: {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  hiringNeed: string;
  roles: string;
  location: string;
  createdAt: Date;
  status: string;
}): Lead {
  return {
    id: lead.id,
    companyName: lead.companyName,
    contactName: lead.contactName,
    email: lead.email,
    phone: lead.phone,
    hiringNeed: lead.hiringNeed,
    roles: lead.roles,
    location: lead.location,
    createdAt: lead.createdAt.toISOString(),
    status: lead.status as Lead["status"],
  };
}

export function mapInquiry(inquiry: {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  createdAt: Date;
}): Inquiry {
  return {
    id: inquiry.id,
    name: inquiry.name,
    email: inquiry.email,
    topic: inquiry.topic,
    message: inquiry.message,
    createdAt: inquiry.createdAt.toISOString(),
  };
}

export function mapPipeline(item: {
  id: string;
  candidateId: string;
  jobId: string;
  stage: string;
  recruiterId: string;
}): PipelineItem {
  return {
    id: item.id,
    candidateId: item.candidateId,
    jobId: item.jobId,
    stage: item.stage as PipelineStage,
    recruiterId: item.recruiterId,
  };
}

export function mapNote(note: {
  id: string;
  candidateId: string;
  author: string;
  body: string;
  createdAt: Date;
}): CandidateNote {
  return {
    id: note.id,
    candidateId: note.candidateId,
    author: note.author,
    body: note.body,
    createdAt: note.createdAt.toISOString(),
  };
}

export function mapNotification(item: {
  id: string;
  userId: string;
  title: string;
  body: string;
  createdAt: Date;
  read: boolean;
}): NotificationItem {
  return {
    id: item.id,
    userId: item.userId,
    title: item.title,
    body: item.body,
    createdAt: item.createdAt.toISOString(),
    read: item.read,
  };
}

export function mapClient(client: {
  id: string;
  companyId: string;
  accountOwner: string;
  openRoles: number;
  sla: string;
}): Client {
  return { ...client };
}
