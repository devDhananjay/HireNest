# HIREORA product spec (merged)

Brand: **HIREORA**  
Tagline: **Connecting Talent. Creating Possibilities.**  
Site: `https://hireora.in`  
Palette: Navy `#101D35`, Royal Blue `#3157D5`, Orange `#F4A340`, Soft White `#F8F9FC`, Charcoal `#202938`.

## Users

- Job seekers
- Employers / companies
- Recruiters / HR consultants
- Platform administrators

## Platform

PostgreSQL + Prisma backend with JWT httpOnly sessions.

Wired:

- Auth (bcrypt, OTP register/reset)
- Resume private storage (local or S3/R2) + AI/heuristic CV parsing
- Live fit score + hire-probability model (decision support, not a guarantee)
- Articles CMS (admin publish → public career library)
- Email (Resend) / WhatsApp (Twilio) with console fallbacks
- Razorpay employer packages
- DPDP deletion request + admin fulfilment
- Production deploy via `scripts/deploy-production.sh` + Caddy HTTPS

## Monetization

Employer job packages via Razorpay (`starter` / `growth` / `enterprise`). Candidate registration and basic applications stay free in the MVP.
