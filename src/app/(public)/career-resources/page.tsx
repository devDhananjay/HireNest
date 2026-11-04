import Link from "next/link";
import { BookOpen, GraduationCap, LineChart } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { articles } from "@/lib/demo/seed";

export default function CareerResourcesPage() {
  return (
    <div className="container-shell py-16">
      <p className="text-[12px] font-medium tracking-[0.16em] text-muted-foreground uppercase">Guides</p>
      <h1 className="mt-2 font-heading text-4xl font-semibold sm:text-5xl">Career resources</h1>
      <p className="mt-2 text-muted-foreground">Guides for Indian job seekers and hiring managers. Demo articles.</p>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {articles.map((article) => {
          const icon = article.category === "Career" ? BookOpen : article.category === "Insights" ? LineChart : GraduationCap;
          return (
            <Link key={article.slug} href={`/career-resources/${article.slug}`} className="hover-lift rounded-[1.85rem] bg-white p-7 shadow-soft">
              <IconOrb icon={icon} />
              <p className="mt-5 text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">{article.category}</p>
              <h2 className="mt-3 font-heading text-xl font-semibold">{article.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{article.excerpt}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
