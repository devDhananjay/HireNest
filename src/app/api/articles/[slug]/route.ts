import { NextResponse } from "next/server";
import { requireSession } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article || !article.published) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    article: {
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      readTime: article.readTime,
      date: article.publishedAt.toISOString().slice(0, 10),
      body: article.body,
    },
  });
}

export async function PATCH(request: Request, context: { params: Promise<{ slug: string }> }) {
  const auth = await requireSession(["admin"]);
  if (auth.error) return auth.error;
  const { slug } = await context.params;
  const body = (await request.json()) as {
    title?: string;
    excerpt?: string;
    category?: string;
    readTime?: string;
    body?: string[];
    published?: boolean;
  };

  const article = await prisma.article.update({
    where: { slug },
    data: {
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.excerpt !== undefined ? { excerpt: body.excerpt } : {}),
      ...(body.category !== undefined ? { category: body.category } : {}),
      ...(body.readTime !== undefined ? { readTime: body.readTime } : {}),
      ...(body.body !== undefined ? { body: body.body } : {}),
      ...(body.published !== undefined ? { published: body.published } : {}),
    },
  });
  return NextResponse.json({ ok: true, article });
}

export async function DELETE(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const auth = await requireSession(["admin"]);
  if (auth.error) return auth.error;
  const { slug } = await context.params;
  await prisma.article.delete({ where: { slug } });
  return NextResponse.json({ ok: true });
}
