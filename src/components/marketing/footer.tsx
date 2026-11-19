import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { BRAND, CATEGORIES } from "@/lib/constants";

const columns = [
  {
    title: "Quick links",
    links: [
      { href: "/jobs", label: "Find Jobs" },
      { href: "/companies", label: "Browse Companies" },
      { href: "/for-candidates", label: "For Candidates" },
      { href: "/talent-community", label: "Talent community" },
      { href: "/for-employers", label: "For Employers" },
      { href: "/placement-dossiers", label: "Placement dossiers" },
      { href: "/career-resources", label: "Career Resources" },
    ],
  },
  {
    title: "Employers",
    links: [
      { href: "/recruitment-services", label: "Recruitment Services" },
      { href: "/services/ai-hiring-os", label: "AI Hiring OS" },
      { href: "/engagement", label: "Engagement & fees" },
      { href: "/trust", label: "Trust & confidentiality" },
      { href: "/services/executive-search", label: "Executive Search" },
      { href: "/contact", label: "Request a Recruiter" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="mt-4 sm:mt-10">
      <div className="container-shell">
        <div className="rounded-[1.6rem] bg-white px-5 py-10 shadow-soft sm:rounded-[2rem] sm:px-6 sm:py-14 md:px-10">
          <div className="grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Logo />
              <p className="mt-4 whitespace-nowrap text-sm leading-7 text-muted-foreground sm:mt-5">
                {BRAND.tagline}
              </p>
            </div>
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-semibold tracking-tight">{column.title}</h3>
                <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="transition hover:text-foreground">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h3 className="text-sm font-semibold tracking-tight">Job categories</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                {CATEGORIES.slice(0, 6).map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/jobs?category=${encodeURIComponent(category.name)}`}
                      className="transition hover:text-foreground"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col gap-4 border-t border-[#eef0f5] pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2 md:flex-row md:gap-6">
              <span className="inline-flex items-center gap-2">
                <Phone className="size-4" /> {BRAND.phone}
              </span>
              <span className="inline-flex items-center gap-2">
                <Mail className="size-4" /> {BRAND.email}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4" /> Bengaluru
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/trust" className="hover:text-foreground">
                Trust
              </Link>
              <Link href="/privacy-policy" className="hover:text-foreground">
                Privacy policy
              </Link>
              <Link href="/terms" className="hover:text-foreground">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="h-8" />
    </footer>
  );
}
