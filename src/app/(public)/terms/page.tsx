import { ScrollText } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";

export default function TermsPage() {
  return (
    <div className="container-shell max-w-3xl py-20">
      <IconOrb icon={ScrollText} size="lg" />
      <h1 className="mt-6 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Terms and conditions</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated 19 November 2026 · HIREORA platform terms</p>
      <div className="mt-8 space-y-6 rounded-[1.85rem] bg-white p-8 text-sm leading-7 shadow-soft">
        <section className="space-y-2">
          <h2 className="font-heading text-lg font-semibold">1. Accounts and eligibility</h2>
          <p>
            You must provide accurate registration details and keep login credentials confidential. Candidate accounts
            and basic job applications are free. Employer accounts may purchase job packages or retainers. Recruiter and
            admin access is granted by HIREORA.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-heading text-lg font-semibold">2. Acceptable use</h2>
          <p>
            You may not upload content you do not have rights to share, scrape the platform, misrepresent your identity
            or company, or post discriminatory job criteria. We may suspend accounts that abuse messaging, spam
            candidates, or attempt to bypass verification.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-heading text-lg font-semibold">3. Jobs, applications and matching</h2>
          <p>
            Employers are responsible for the accuracy of job posts. Candidates are responsible for the accuracy of
            profiles and resumes. Fit scores and hire-probability estimates are decision-support tools generated from
            profile overlap; they are not guarantees of interview, offer or employment.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-heading text-lg font-semibold">4. Fees and packages</h2>
          <p>
            Employer packages billed through Razorpay are described at checkout. Consultancy retainers for executive
            search or bulk programmes are agreed separately in writing. Fees already processed for completed search
            work are non-refundable except where required by law or a written SLA.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-heading text-lg font-semibold">5. Content and demos</h2>
          <p>
            Sample vacancies and anonymised case studies may appear for illustration. Editorial career articles may be
            updated through the admin CMS. You grant HIREORA a limited licence to process uploaded resumes solely to
            operate recruitment workflows.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-heading text-lg font-semibold">6. Liability</h2>
          <p>
            HIREORA provides the platform and consultancy services on a commercially reasonable basis. We are not a
            party to employment contracts between employers and candidates. To the extent permitted by law, liability
            is limited to fees paid for the relevant service in the three months before a claim.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-heading text-lg font-semibold">7. Contact</h2>
          <p>
            Questions about these terms: hello@hireora.in. Privacy and deletion requests are handled under the Privacy
            policy.
          </p>
        </section>
      </div>
    </div>
  );
}
