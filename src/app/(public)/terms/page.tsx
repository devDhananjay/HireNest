import { ScrollText } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";

export default function TermsPage() {
  return (
    <div className="container-shell max-w-3xl py-20">
      <IconOrb icon={ScrollText} size="lg" />
      <h1 className="mt-6 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Terms and conditions</h1>
      <p className="mt-3 text-sm text-muted-foreground">Draft terms for the HIREORA demo platform.</p>
      <div className="mt-8 space-y-5 rounded-[1.85rem] bg-white p-8 text-sm leading-7 shadow-soft">
        <p>
          Candidate accounts and basic applications are free. Employer job packages and recruitment retainers may be introduced later. Demo statistics, testimonials and vacancies are labelled as such.
        </p>
        <p>
          Users must provide accurate information and must not upload files they do not have rights to share. HIREORA matching scores assist human decisions and are not a guarantee of hiring.
        </p>
      </div>
    </div>
  );
}
