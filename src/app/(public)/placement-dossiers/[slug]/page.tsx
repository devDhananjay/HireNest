import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDossier, placementDossiers } from "@/lib/content/placement-dossiers";
import { btnOutline, btnPrimary } from "@/lib/ui";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return placementDossiers.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dossier = getDossier(slug);
  if (!dossier) return { title: "Dossier" };
  return { title: dossier.title, description: dossier.challenge };
}

export default async function PlacementDossierDetailPage({ params }: Props) {
  const { slug } = await params;
  const dossier = getDossier(slug);
  if (!dossier) notFound();

  return (
    <div className="container-shell py-14 sm:py-16">
      <Link href="/placement-dossiers" className="text-sm font-medium text-muted-foreground hover:text-foreground">
        ← All dossiers
      </Link>
      <p className="mt-6 text-[12px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
        {dossier.mandateType} · {dossier.industry}
      </p>
      <h1 className="mt-3 max-w-3xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
        {dossier.title}
      </h1>
      <p className="mt-3 text-muted-foreground">{dossier.location}</p>
      <p className="mt-4 max-w-2xl rounded-2xl bg-[#f4f5f8] px-4 py-3 text-sm leading-6 text-muted-foreground">
        {dossier.confidentiality}
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {dossier.metrics.map((metric) => (
          <div key={metric.label} className="rounded-[1.5rem] bg-white px-5 py-5 shadow-soft">
            <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">{metric.label}</p>
            <p className="mt-2 font-heading text-2xl font-semibold">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 max-w-3xl space-y-10">
        <section>
          <h2 className="font-heading text-2xl font-semibold">The challenge</h2>
          <p className="mt-3 text-base leading-8 text-muted-foreground">{dossier.challenge}</p>
        </section>
        <section>
          <h2 className="font-heading text-2xl font-semibold">How we worked</h2>
          <ol className="mt-4 space-y-3">
            {dossier.approach.map((step, index) => (
              <li key={step} className="flex gap-3 text-base leading-7 text-muted-foreground">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-black text-xs font-medium text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>
        <section>
          <h2 className="font-heading text-2xl font-semibold">Outcome</h2>
          <p className="mt-3 text-base leading-8 text-muted-foreground">{dossier.outcome}</p>
        </section>
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/contact" className={btnPrimary}>
          Start a similar mandate
        </Link>
        <Link href="/engagement" className={btnOutline}>
          Engagement & fees
        </Link>
      </div>
    </div>
  );
}
