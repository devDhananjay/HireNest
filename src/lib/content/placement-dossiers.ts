export type PlacementDossier = {
  slug: string;
  title: string;
  industry: string;
  location: string;
  mandateType: "Retained" | "Contingent" | "RPO / bulk";
  daysToShortlist: number;
  daysToOffer: number;
  confidentiality: string;
  challenge: string;
  approach: string[];
  outcome: string;
  metrics: { label: string; value: string }[];
};

export const placementDossiers: PlacementDossier[] = [
  {
    slug: "fintech-vp-engineering",
    title: "VP Engineering for a Series-B fintech",
    industry: "BFSI / Fintech",
    location: "Bengaluru · Hybrid",
    mandateType: "Retained",
    daysToShortlist: 11,
    daysToOffer: 28,
    confidentiality: "Silent search — no public listing; outreach under NDA.",
    challenge:
      "The client needed a VP who had scaled payments infrastructure and could hire a 40-person platform org without destabilising delivery. Internal referrals had stalled for three months.",
    approach: [
      "Stakeholder scorecard with board-level outcomes for the first two quarters.",
      "Mapped 48 peer companies; confidential conversations with 19 operators.",
      "Three-person shortlist with evidence packs (architecture decisions, hiring velocity, attrition).",
      "Structured panel + reference protocol before offer.",
    ],
    outcome:
      "Offer accepted in week four. Candidate joined with a 60-day hiring plan already aligned to the CTO and product leads.",
    metrics: [
      { label: "Shortlist", value: "11 days" },
      { label: "Offer", value: "28 days" },
      { label: "Candidates mapped", value: "48" },
    ],
  },
  {
    slug: "retail-bulk-customer-ops",
    title: "120 customer-ops hires across four cities",
    industry: "Retail / Consumer",
    location: "Delhi NCR · Mumbai · Hyderabad · Pune",
    mandateType: "RPO / bulk",
    daysToShortlist: 7,
    daysToOffer: 45,
    confidentiality: "Public + campus channels; client brand on listings.",
    challenge:
      "Peak-season volume with inconsistent quality from prior vendors. Hiring managers were drowning in unqualified applications.",
    approach: [
      "Role scorecards per city with language and shift constraints.",
      "AI Hiring OS for resume parse + fit ranking before human screens.",
      "WhatsApp ack and interview-slot self-booking for high-volume rounds.",
      "Weekly SLA dashboard shared with the client TA lead.",
    ],
    outcome:
      "120 joins across the window with a usable shortlist ratio — hiring managers only saw candidates above an agreed fit threshold.",
    metrics: [
      { label: "Joins", value: "120" },
      { label: "Cities", value: "4" },
      { label: "Fit gate", value: "≥68%" },
    ],
  },
  {
    slug: "healthcare-clinical-ops-lead",
    title: "Clinical operations lead for a multi-city chain",
    industry: "Healthcare",
    location: "Hyderabad · Travel",
    mandateType: "Contingent",
    daysToShortlist: 9,
    daysToOffer: 22,
    confidentiality: "Named search with discreet peer outreach.",
    challenge:
      "NABH-aware operator who could standardise SOPs across new facilities without slowing patient throughput.",
    approach: [
      "Market map of hospital groups and diagnostic chains.",
      "Evidence interviews focused on audit readiness and team coaching.",
      "Client workshop to align compensation with scarcity in the market.",
    ],
    outcome:
      "Offer closed in three weeks. 90-day plan covered audit calendar and site-level KPI ownership.",
    metrics: [
      { label: "Shortlist", value: "9 days" },
      { label: "Offer", value: "22 days" },
      { label: "Sites in scope", value: "6" },
    ],
  },
  {
    slug: "saas-product-design-pod",
    title: "Senior product design pod (3 roles)",
    industry: "IT & Software",
    location: "Remote-first · India",
    mandateType: "Contingent",
    daysToShortlist: 8,
    daysToOffer: 31,
    confidentiality: "Listed roles with portfolio-first screening.",
    challenge:
      "Three senior ICs who could own discovery-to-ship without a design manager on day one — portfolio quality was uneven in the inbound flood.",
    approach: [
      "Portfolio rubric shared with hiring managers before sourcing.",
      "Fit scoring on tools + domain + remote collaboration signals.",
      "Async voice screen for product-sense questions before live rounds.",
    ],
    outcome:
      "All three roles filled. Design system ownership and research cadence landed in the first sprint.",
    metrics: [
      { label: "Roles closed", value: "3/3" },
      { label: "Voice screens", value: "14" },
      { label: "Avg. time-to-offer", value: "31 days" },
    ],
  },
];

export function getDossier(slug: string) {
  return placementDossiers.find((item) => item.slug === slug);
}
