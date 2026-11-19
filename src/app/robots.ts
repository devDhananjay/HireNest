import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/candidate", "/employer", "/recruiter", "/admin"] },
    sitemap: `${BRAND.siteUrl}/sitemap.xml`,
  };
}
