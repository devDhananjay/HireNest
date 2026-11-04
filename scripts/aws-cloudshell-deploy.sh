#!/bin/bash
# Run this INSIDE AWS CloudShell after uploading hireora-deploy.tgz
# Upload: Actions > Upload file > choose /tmp/hireora-deploy.tgz from Mac
#   (or: Desktop/Hireora is local — first copy tarball to a place you can upload)
set -euo pipefail
IP="${1:-3.111.213.233}"
PEM="${HOME}/hireora-temp.pem"
TGZ="${HOME}/hireora-deploy.tgz"

if [ ! -f "$PEM" ]; then echo "Missing $PEM"; exit 1; fi
if [ ! -f "$TGZ" ]; then echo "Missing $TGZ — Actions > Upload file > hireora-deploy.tgz"; exit 1; fi
chmod 400 "$PEM"

echo "Waiting for SSH on $IP..."
for i in $(seq 1 30); do
  if ssh -i "$PEM" -o StrictHostKeyChecking=no -o ConnectTimeout=5 -o BatchMode=yes ec2-user@"$IP" 'echo ok' 2>/dev/null; then
    break
  fi
  sleep 5
done

scp -i "$PEM" -o StrictHostKeyChecking=no "$TGZ" ec2-user@"$IP":~/hireora-deploy.tgz

ssh -i "$PEM" -o StrictHostKeyChecking=no ec2-user@"$IP" bash <<'REMOTE'
set -euo pipefail
# swap for t3.nano
if ! swapon --show | grep -q swapfile; then
  sudo dd if=/dev/zero of=/swapfile bs=1M count=1024 status=none
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
fi
# Node 20
if ! command -v node >/dev/null; then
  curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
  sudo dnf install -y nodejs || sudo yum install -y nodejs
fi
rm -rf ~/Hireora
mkdir -p ~/Hireora
tar xzf ~/hireora-deploy.tgz -C ~/Hireora --strip-components=1
cd ~/Hireora
# standalone server
export PORT=3000
export HOSTNAME=0.0.0.0
export NODE_ENV=production
pkill -f 'node server.js' 2>/dev/null || true
nohup node server.js > ~/hireora.log 2>&1 &
echo $! > ~/hireora.pid
sleep 2
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/ || true
echo "Hireora started pid=$(cat ~/hireora.pid)"
REMOTE

echo "DONE → http://${IP}:3000"
