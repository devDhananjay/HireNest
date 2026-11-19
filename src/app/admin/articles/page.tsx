"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlignLeft, BookOpen, Clock3, FolderOpen, Heading, TextQuote } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { IconField, IconTextarea } from "@/components/ui/icon-field";
import type { Article } from "@/lib/types";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    category: "Career",
    readTime: "5 min",
    body: "",
  });

  async function load() {
    const res = await fetch("/api/articles?all=1");
    const data = await res.json();
    setArticles(data.articles ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function createArticle(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Could not publish");
      return;
    }
    toast.success("Article published");
    setForm({ title: "", excerpt: "", category: "Career", readTime: "5 min", body: "" });
    await load();
  }

  async function unpublish(slug: string) {
    const res = await fetch(`/api/articles/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: false }),
    });
    if (!res.ok) {
      toast.error("Could not update");
      return;
    }
    toast.success("Unpublished");
    await load();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Articles CMS"
        description="Write and publish career library articles. Published posts appear on the public career resources pages immediately."
      />
      <form onSubmit={createArticle} className="space-y-4 rounded-[1.85rem] bg-white p-7 shadow-soft">
        <div className="flex items-center gap-3">
          <IconOrb icon={BookOpen} />
          <p className="text-sm text-muted-foreground">New article</p>
        </div>
        <IconField icon={Heading} required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <IconField icon={TextQuote} required placeholder="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <IconField icon={FolderOpen} placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <IconField icon={Clock3} placeholder="Read time" value={form.readTime} onChange={(e) => setForm({ ...form, readTime: e.target.value })} />
        </div>
        <IconTextarea
          icon={AlignLeft}
          required
          placeholder="Body paragraphs separated by a blank line"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
        />
        <Button type="submit" className="h-11 rounded-full">
          Publish article
        </Button>
      </form>

      <div className="space-y-3">
        {articles.map((article) => (
          <div key={article.slug} className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] bg-white px-5 py-4 shadow-soft">
            <div>
              <p className="font-medium">{article.title}</p>
              <p className="text-xs text-muted-foreground">
                {article.category} · /{article.slug}
              </p>
            </div>
            <Button variant="outline" className="h-9 rounded-full" onClick={() => void unpublish(article.slug)}>
              Unpublish
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
