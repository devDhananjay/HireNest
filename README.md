# HIREORA

Premium recruitment and placement platform for the Indian market.

**Connecting Talent. Creating Possibilities.**

Next.js App Router app with PostgreSQL (Prisma), role-based auth, private resume storage, Razorpay employer packages, articles CMS, resume parsing, and DPDP deletion workflows.

## Prerequisites

- Node.js 20+
- PostgreSQL 16+ (Homebrew, Docker Compose, or hosted)

## Setup

```bash
cd ~/Desktop/Hireora\ Consultancy
cp .env.example .env
# Set DATABASE_URL + AUTH_SECRET
# Production: NEXT_PUBLIC_APP_URL=https://hireora.in

npm install
npm run db:generate
npm run db:push          # or: npm run db:migrate
npm run db:seed
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

OTP default: `123456` (`OTP_DEV_CODE`) when Resend is unset.

## Production deploy (AWS / VPS + HTTPS)

```bash
export DATABASE_URL="postgresql://..."
export AUTH_SECRET="$(openssl rand -base64 32)"
export NEXT_PUBLIC_APP_URL="https://hireora.in"
# optional: RESEND_*, TWILIO_*, RAZORPAY_*, S3_*, OPENAI_API_KEY

./scripts/deploy-production.sh ubuntu@YOUR_EC2_HOST
```

This builds the Next standalone output, uploads it, installs **systemd** + **Caddy** (auto HTTPS), and points `hireora.in` at the Node server on `:3000`.

DNS A record for `hireora.in` must point at the server before Caddy can issue certificates.

## Useful scripts

| Script | Purpose |
| --- | --- |
| `npm run db:up` | Docker Compose Postgres |
| `npm run db:generate` | Prisma client |
| `npm run db:push` / `db:migrate` | Schema |
| `npm run db:seed` | Seed data + CMS articles |
| `./scripts/deploy-production.sh` | Build + remote HTTPS deploy |

See `PRODUCT.md` and `.env.example` for providers.
