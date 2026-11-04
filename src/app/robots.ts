import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/candidate", "/employer", "/recruiter", "/admin"] },
    sitemap: "https://hireora.example/sitemap.xml",
  };
}
