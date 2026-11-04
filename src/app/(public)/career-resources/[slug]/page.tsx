import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { articles } from "@/lib/demo/seed";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  return (
    <article className="container-shell max-w-3xl py-20">
      <IconOrb icon={BookOpen} size="lg" />
      <p className="mt-6 text-[12px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
        {article.category} · Demo article
      </p>
      <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">{article.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {article.date} · {article.readTime}
      </p>
      <div className="mt-8 rounded-[1.85rem] bg-white p-8 shadow-soft sm:p-10">
        <p className="text-lg leading-8">{article.excerpt}</p>
        <p className="mt-6 leading-8 text-muted-foreground">
          This is placeholder editorial content for the HIREORA career library. Replace it with CMS-managed articles when the content workspace is connected.
        </p>
      </div>
    </article>
  );
}
