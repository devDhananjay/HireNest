import Link from "next/link";
import { ArrowRight, Crown, UserCheck, Users } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";

const services = [
  {
    href: "/services/permanent-staffing",
    title: "Permanent staffing",
    text: "Retained and contingency hiring for specialists and mid-management.",
    icon: UserCheck,
  },
  {
    href: "/services/bulk-hiring",
    title: "Bulk hiring",
    text: "Campus, lateral and high-volume programmes with structured SLAs.",
    icon: Users,
  },
  {
    href: "/services/executive-search",
    title: "Executive search",
    text: "Confidential leadership mandates with market mapping.",
    icon: Crown,
  },
];

export default function ServicesPage() {
  return (
    <div className="container-shell py-16">
      <p className="text-[12px] font-medium tracking-[0.16em] text-muted-foreground uppercase">Services</p>
      <h1 className="mt-2 font-heading text-4xl font-semibold sm:text-5xl">Recruitment services</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        HIREORA supports both a public job marketplace and a consultancy operating model.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {services.map((service) => (
          <Link key={service.href} href={service.href} className="hover-lift rounded-[1.85rem] bg-white p-7 shadow-soft">
            <IconOrb icon={service.icon} />
            <h2 className="mt-5 font-heading text-xl font-semibold">{service.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{service.text}</p>
            <p className="mt-5 inline-flex items-center text-sm font-medium">
              Learn more <ArrowRight className="ml-1 size-4" />
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
