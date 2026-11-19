import { NextResponse } from "next/server";
import { requireSession } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { slugify } from "@/lib/server/slug";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const includeDrafts = url.searchParams.get("all") === "1";
  let where: { published?: boolean } = { published: true };
  if (includeDrafts) {
    const auth = await requireSession(["admin"]);
    if (auth.error) return auth.error;
    where = {};
  }
  const articles = await prisma.article.findMany({
    where,
    orderBy: { publishedAt: "desc" },
  });
  return NextResponse.json({
    articles: articles.map((article) => ({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      readTime: article.readTime,
      date: article.publishedAt.toISOString().slice(0, 10),
      body: article.body,
      published: article.published,
    })),
  });
}

export async function POST(request: Request) {
  const auth = await requireSession(["admin"]);
  if (auth.error) return auth.error;

  const body = (await request.json()) as {
    title?: string;
    excerpt?: string;
    category?: string;
    readTime?: string;
    body?: string[] | string;
    published?: boolean;
    slug?: string;
  };

  if (!body.title?.trim() || !body.excerpt?.trim()) {
    return NextResponse.json({ error: "Title and excerpt are required" }, { status: 400 });
  }

  const paragraphs = Array.isArray(body.body)
    ? body.body
    : String(body.body ?? "")
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);

  const article = await prisma.article.create({
    data: {
      title: body.title.trim(),
      excerpt: body.excerpt.trim(),
      category: body.category?.trim() || "Career",
      readTime: body.readTime?.trim() || "5 min",
      body: paragraphs,
      published: body.published ?? true,
      slug: body.slug?.trim() || slugify(`${body.title}-${Date.now()}`),
    },
  });

  return NextResponse.json({ ok: true, article });
}
