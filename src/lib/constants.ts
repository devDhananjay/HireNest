import type { PipelineStage, UserRole } from "./types";

export const BRAND = {
  name: "HIREORA",
  tagline: "Connecting Talent. Creating Possibilities.",
  email: "hello@hireora.in",
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
  address: "WeWork Galaxy, 43, Residency Road, Bengaluru, Karnataka 560025",
  siteUrl: (process.env.NEXT_PUBLIC_APP_URL || "https://hireora.in").replace(/\/$/, ""),
};

export const CATEGORIES = [
  { slug: "it-software", name: "IT & Software", jobs: 148 },
  { slug: "banking-finance", name: "Banking & Finance", jobs: 62 },
  { slug: "sales-marketing", name: "Sales & Marketing", jobs: 91 },
  { slug: "hr-administration", name: "HR & Administration", jobs: 34 },
  { slug: "engineering", name: "Engineering", jobs: 77 },
  { slug: "healthcare", name: "Healthcare", jobs: 41 },
  { slug: "customer-support", name: "Customer Support", jobs: 53 },
  { slug: "operations", name: "Operations", jobs: 46 },
] as const;

export const LOCATIONS = [
  "Bengaluru",
  "Mumbai",
  "Delhi NCR",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Ahmedabad",
  "Remote",
];

export const PIPELINE_STAGES: { id: PipelineStage; label: string }[] = [
  { id: "new", label: "New Candidates" },
  { id: "screening", label: "Screening" },
  { id: "shortlisted", label: "Shortlisted" },
  { id: "interview", label: "Interview" },
  { id: "selected", label: "Selected" },
  { id: "offered", label: "Offered" },
  { id: "joined", label: "Joined" },
];

export const APPLICATION_STATUSES = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview Scheduled",
  "Selected",
  "Rejected",
] as const;

export const ROLE_HOME: Record<UserRole, string> = {
  candidate: "/candidate/dashboard",
  employer: "/employer/dashboard",
  recruiter: "/recruiter/dashboard",
  admin: "/admin/dashboard",
};

export const DEMO_ACCOUNTS = [
  {
    email: "candidate@hireora.demo",
    role: "candidate" as const,
    name: "Ananya Sharma",
    label: "Candidate",
  },
  {
    email: "employer@hireora.demo",
    role: "employer" as const,
    name: "Rohan Mehta",
    label: "Employer",
  },
  {
    email: "recruiter@hireora.demo",
    role: "recruiter" as const,
    name: "Priya Nair",
    label: "Recruiter",
  },
  {
    email: "admin@hireora.demo",
    role: "admin" as const,
    name: "Aarav Kapoor",
    label: "Admin",
  },
];

export const DEMO_PASSWORD = "demo123";

export const NAV_PUBLIC = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Find Jobs" },
  { href: "/for-employers", label: "For Employers" },
  { href: "/recruitment-services", label: "Services" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];
