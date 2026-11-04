import type { MetadataRoute } from "next";
import { jobs } from "@/lib/demo/seed";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://hireora.example";
  const staticRoutes = [
    "",
    "/jobs",
    "/companies",
    "/about",
    "/contact",
    "/for-employers",
    "/for-candidates",
    "/recruitment-services",
    "/services/permanent-staffing",
    "/services/bulk-hiring",
    "/services/executive-search",
    "/career-resources",
    "/privacy-policy",
    "/terms",
  ];
  return [
    ...staticRoutes.map((route) => ({ url: `${base}${route}`, lastModified: new Date() })),
    ...jobs
      .filter((job) => job.status === "active")
      .map((job) => ({ url: `${base}/jobs/${job.slug}`, lastModified: new Date(job.postedAt) })),
  ];
}
