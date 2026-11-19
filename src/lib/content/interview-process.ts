export type InterviewProcessStep = {
  title: string;
  detail: string;
  typical: string;
};

/** Public hiring journey — reduces candidate uncertainty before apply. */
export const INTERVIEW_PROCESS: InterviewProcessStep[] = [
  {
    title: "Apply",
    detail: "Submit through HIREORA with an updated profile and resume. You get an acknowledgement when the packet lands.",
    typical: "Day 0",
  },
  {
    title: "Recruiter screen",
    detail: "A short conversation on experience, notice period, compensation and role fit — not a full technical loop.",
    typical: "2–5 days",
  },
  {
    title: "Hiring rounds",
    detail: "Role-specific interviews (video, onsite or panel). Schedules appear under Interviews when a slot is booked.",
    typical: "1–3 weeks",
  },
  {
    title: "Offer & join",
    detail: "Written offer with CTC breakup and joining date. Status history stays in your applications timeline.",
    typical: "Offer week",
  },
];
