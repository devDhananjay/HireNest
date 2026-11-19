"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Article } from "@/lib/types";

export default function CareerResourcesPage() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => setArticles(data.articles ?? []))
      .catch(() => setArticles([]));
  }, []);

  return (
    <div className="container-shell py-12">
      <p className="text-[12px] font-medium tracking-[0.16em] text-muted-foreground uppercase">Library</p>
      <h1 className="mt-2 font-heading text-4xl font-semibold sm:text-5xl">Career resources</h1>
      <p className="mt-2 text-muted-foreground">Guides for Indian job seekers and hiring managers. Managed in the CMS.</p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/career-resources/${article.slug}`}
            className="hover-lift rounded-[1.85rem] bg-white p-6 shadow-soft"
          >
            <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">{article.category}</p>
            <h2 className="mt-2 font-heading text-xl font-semibold">{article.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{article.excerpt}</p>
            <p className="mt-4 text-xs text-muted-foreground">
              {article.date} · {article.readTime}
            </p>
          </Link>
        ))}
        {!articles.length ? <p className="text-sm text-muted-foreground">No published articles yet.</p> : null}
      </div>
    </div>
  );
}
