export type UserRole = "candidate" | "employer" | "recruiter" | "admin";

export type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Internship";
export type WorkMode = "On-site" | "Hybrid" | "Remote";
export type JobStatus = "draft" | "pending" | "active" | "expired" | "rejected";

export type ApplicationStatus =
  | "Applied"
  | "Under Review"
  | "Shortlisted"
  | "Interview Scheduled"
  | "Selected"
  | "Rejected";

export type PipelineStage =
  | "new"
  | "screening"
  | "shortlisted"
  | "interview"
  | "selected"
  | "offered"
  | "joined";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId?: string;
};

export type Company = {
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

export type Job = {
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
  employmentType: EmploymentType;
  workMode: WorkMode;
  experienceMin: number;
  experienceMax: number;
  salaryMin: number;
  salaryMax: number;
  openings: number;
  deadline: string;
  postedAt: string;
  featured: boolean;
  status: JobStatus;
};

export type Education = {
  id: string;
  school: string;
  degree: string;
  field: string;
  year: string;
};

export type Experience = {
  id: string;
  company: string;
  title: string;
  start: string;
  end: string;
  summary: string;
};

export type Candidate = {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  photoInitials: string;
  location: string;
  currentTitle: string;
  expectedSalary: number;
  preferredLocations: string[];
  noticePeriod: string;
  linkedin: string;
  skills: string[];
  education: Education[];
  experience: Experience[];
  resumeName: string;
  resumeUrl?: string;
  completeness: number;
  tags: string[];
  duplicateOf?: string;
};

export type Application = {
  id: string;
  jobId: string;
  candidateId: string;
  status: ApplicationStatus;
  appliedAt: string;
  timeline: { status: ApplicationStatus | "Applied"; at: string; note: string }[];
};

export type Interview = {
  id: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  companyId: string;
  scheduledAt: string;
  mode: "Video" | "In-person" | "Phone";
  location: string;
  interviewer: string;
  status: "Scheduled" | "Completed" | "Cancelled";
};

export type Lead = {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  hiringNeed: string;
  roles: string;
  location: string;
  createdAt: string;
  status: "New" | "In Review" | "Assigned" | "Closed";
  source?: string;
  qualifyScore?: number | null;
  qualifyLabel?: "Hot" | "Warm" | "Cold" | string | null;
  qualifyNotes?: string | null;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  topic: string;
  message: string;
  source?: string;
  createdAt: string;
};

export type InterviewSlot = {
  id: string;
  jobId: string;
  companyId: string;
  applicationId?: string | null;
  candidateId?: string | null;
  startsAt: string;
  endsAt: string;
  mode: string;
  location: string;
  interviewer: string;
  status: "open" | "booked" | "cancelled" | string;
  jobTitle?: string;
};

export type Client = {
  id: string;
  companyId: string;
  accountOwner: string;
  openRoles: number;
  sla: string;
};

export type PipelineItem = {
  id: string;
  candidateId: string;
  jobId: string;
  stage: PipelineStage;
  recruiterId: string;
};

export type CandidateNote = {
  id: string;
  candidateId: string;
  author: string;
  body: string;
  createdAt: string;
};

export type NotificationItem = {
  id: string;
  userId: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  body: string[];
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  kind: "candidate" | "employer";
};
