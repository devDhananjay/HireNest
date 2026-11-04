import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingHeader } from "@/components/marketing/header";
import { BRAND } from "@/lib/constants";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: BRAND.name,
  slogan: BRAND.tagline,
  url: "https://hireora.example",
  email: BRAND.email,
  telephone: BRAND.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bengaluru",
    addressCountry: "IN",
  },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MarketingHeader />
      <div className="flex-1 pt-16 sm:pt-[4.35rem]">{children}</div>
      <MarketingFooter />
    </div>
  );
}
