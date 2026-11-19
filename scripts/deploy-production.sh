#!/usr/bin/env bash
# Build + package HIREORA for EC2/Ubuntu with Caddy HTTPS reverse proxy.
# Usage:
#   export DATABASE_URL=... AUTH_SECRET=... NEXT_PUBLIC_APP_URL=https://hireora.in
#   ./scripts/deploy-production.sh user@host
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REMOTE="${1:-}"
APP_URL="${NEXT_PUBLIC_APP_URL:-https://hireora.in}"

if [[ -z "${DATABASE_URL:-}" || -z "${AUTH_SECRET:-}" ]]; then
  echo "Set DATABASE_URL and AUTH_SECRET before deploying."
  exit 1
fi

cd "$ROOT"
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build

STAGE="$(mktemp -d)/hireora-release"
mkdir -p "$STAGE"
cp -R .next/standalone/. "$STAGE/"
mkdir -p "$STAGE/.next"
cp -R .next/static "$STAGE/.next/static"
cp -R public "$STAGE/public" 2>/dev/null || true
cp -R prisma "$STAGE/prisma"
cp package.json "$STAGE/package.json"
cp prisma7.config.ts "$STAGE/prisma7.config.ts" 2>/dev/null || true

cat > "$STAGE/.env.production" <<EOF
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
DATABASE_URL=${DATABASE_URL}
AUTH_SECRET=${AUTH_SECRET}
NEXT_PUBLIC_APP_URL=${APP_URL}
OTP_DEV_CODE=${OTP_DEV_CODE:-}
EMAIL_FROM=${EMAIL_FROM:-HIREORA <noreply@hireora.in>}
RESEND_API_KEY=${RESEND_API_KEY:-}
TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID:-}
TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN:-}
TWILIO_WHATSAPP_FROM=${TWILIO_WHATSAPP_FROM:-}
S3_BUCKET=${S3_BUCKET:-}
S3_REGION=${S3_REGION:-auto}
S3_ENDPOINT=${S3_ENDPOINT:-}
S3_ACCESS_KEY_ID=${S3_ACCESS_KEY_ID:-}
S3_SECRET_ACCESS_KEY=${S3_SECRET_ACCESS_KEY:-}
S3_PUBLIC_BASE_URL=${S3_PUBLIC_BASE_URL:-}
RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID:-}
RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET:-}
RAZORPAY_WEBHOOK_SECRET=${RAZORPAY_WEBHOOK_SECRET:-}
OPENAI_API_KEY=${OPENAI_API_KEY:-}
EOF

cp "$ROOT/deploy/Caddyfile" "$STAGE/Caddyfile"
cp "$ROOT/deploy/hireora.service" "$STAGE/hireora.service"
TGZ="/tmp/hireora-production.tgz"
tar -czf "$TGZ" -C "$(dirname "$STAGE")" "$(basename "$STAGE")"
echo "Packed $TGZ"

if [[ -z "$REMOTE" ]]; then
  echo "Local package ready. Pass user@host to upload+restart."
  exit 0
fi

scp "$TGZ" "$REMOTE:/tmp/hireora-production.tgz"
scp "$ROOT/deploy/remote-install.sh" "$REMOTE:/tmp/remote-install.sh"
ssh "$REMOTE" "bash /tmp/remote-install.sh"
echo "Deployed → ${APP_URL}"
