# HIREORA

Premium recruitment and placement platform scaffold for the Indian market.

**Connecting Talent. Creating Possibilities.**

This is a Next.js App Router project with a complete public website and role-based dashboards (candidate, employer, recruiter, admin). Interactions run against typed demo data stored in the browser. Prisma schema is included for a later PostgreSQL backend.

## Run locally

```bash
cd ~/Desktop/Hireora
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo logins

Password for all seeded accounts: `demo123`

| Role | Email |
| --- | --- |
| Candidate | candidate@hireora.demo |
| Employer | employer@hireora.demo |
| Recruiter | recruiter@hireora.demo |
| Admin | admin@hireora.demo |

You can also click the role cards on `/login`. Registration uses demo OTP `123456`.

## What works now

- Public marketing site, job search, apply/save, contact and hiring-requirement forms
- Role-based demo authentication and route protection
- Candidate profile, applications timeline, interviews
- Employer job create/manage, application actions, interview scheduling
- Recruiter CRM, duplicate flags, drag-and-drop pipeline
- Admin moderation, demo charts, settings toggles

## Later

PostgreSQL + Prisma client, real OTP/email/WhatsApp, private resume storage, payments, and live AI parsing. Those surfaces are labelled in the UI.

See `PRODUCT.md` for the full product spec.
