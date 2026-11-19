"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import type { Article } from "@/lib/types";

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [article, setArticle] = useState<Article | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    fetch(`/api/articles/${slug}`)
      .then(async (res) => {
        if (!res.ok) {
          setMissing(true);
          return;
        }
        const data = await res.json();
        setArticle(data.article);
      })
      .catch(() => setMissing(true));
  }, [slug]);

  if (missing) {
    return (
      <div className="container-shell max-w-3xl py-20">
        <h1 className="font-heading text-3xl font-semibold">Article not found</h1>
        <Link href="/career-resources" className="mt-4 inline-block text-sm hover:underline">
          Back to library
        </Link>
      </div>
    );
  }

  if (!article) {
    return <p className="container-shell py-20 text-sm text-muted-foreground">Loading article…</p>;
  }

  return (
    <article className="container-shell max-w-3xl py-20">
      <IconOrb icon={BookOpen} size="lg" />
      <p className="mt-6 text-[12px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
        {article.category} · Career library
      </p>
      <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">{article.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {article.date} · {article.readTime}
      </p>
      <div className="mt-8 space-y-5 rounded-[1.85rem] bg-white p-8 shadow-soft sm:p-10">
        <p className="text-lg leading-8">{article.excerpt}</p>
        {article.body.map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className="leading-8 text-muted-foreground">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
