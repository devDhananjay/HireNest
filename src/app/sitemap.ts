import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/constants";
import { prisma } from "@/lib/server/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = BRAND.siteUrl;
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

  const [companies, jobs, articleRows] = await Promise.all([
    prisma.company.findMany({ select: { slug: true } }),
    prisma.job.findMany({ where: { status: "active" }, select: { slug: true, postedAt: true } }),
    prisma.article.findMany({ where: { published: true }, select: { slug: true, publishedAt: true } }),
  ]);

  return [
    ...staticRoutes.map((route) => ({ url: `${base}${route}`, lastModified: new Date() })),
    ...companies.map((company) => ({ url: `${base}/companies/${company.slug}`, lastModified: new Date() })),
    ...articleRows.map((article) => ({
      url: `${base}/career-resources/${article.slug}`,
      lastModified: article.publishedAt,
    })),
    ...jobs.map((job) => ({ url: `${base}/jobs/${job.slug}`, lastModified: job.postedAt })),
  ];
}
