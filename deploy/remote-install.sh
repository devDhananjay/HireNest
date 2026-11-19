#!/usr/bin/env bash
set -euo pipefail
sudo mkdir -p /opt/hireora
sudo rm -rf /opt/hireora/*
sudo tar -xzf /tmp/hireora-production.tgz -C /opt/hireora --strip-components=1
cd /opt/hireora
if ! command -v node >/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
if ! command -v caddy >/dev/null; then
  sudo apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
  sudo apt-get update
  sudo apt-get install -y caddy
fi
sudo cp /opt/hireora/Caddyfile /etc/caddy/Caddyfile
sudo cp /opt/hireora/hireora.service /etc/systemd/system/hireora.service
sudo systemctl daemon-reload
sudo systemctl enable --now hireora
sudo systemctl enable --now caddy
sudo systemctl reload caddy || sudo systemctl restart caddy
curl -s -o /dev/null -w "local:%{http_code}\n" http://127.0.0.1:3000/ || true
echo "HIREORA service active"
