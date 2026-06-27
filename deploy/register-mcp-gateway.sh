#!/usr/bin/env bash
#
# register-mcp-gateway.sh — make gpt-terminal-plus a live, OAuth-accessible
# server in the local mcp-gateway. Run ONCE, with sudo available.
#
#   sudo bash deploy/register-mcp-gateway.sh
#
# It is idempotent: safe to re-run. It performs the privileged steps that
# could not be auto-applied (systemd units + nginx edge route + reload).
#
# Prereqid (already done by the setup that generated this script):
#   - dist/ is built (npm ci && npx tsc --module commonjs --moduleResolution node --outDir dist)
#   - .env contains a 64-char API_TOKEN
#   - mcp-gateway servers.json already has the "gpt-terminal-plus" entry (:8815)
#
set -euo pipefail

APP_DIR="/mnt/models/projects/dormant/gpt-terminal-plus"
GW_DIR="/home/chatgpt/mcp-gateway"
NGINX_REAL="/etc/nginx/sites-available/glama-bridge.conf"   # resolve of $GW_DIR/nginx/mcp.conf
NAME="gpt-terminal-plus"
PORT=8815

echo "==> 1/3  install + start the app service (upstream on :3100)"
install -m 0644 "$APP_DIR/deploy/systemd/gpt-terminal-plus.service" \
  /etc/systemd/system/gpt-terminal-plus.service
systemctl daemon-reload
systemctl enable --now gpt-terminal-plus.service
sleep 3
ss -tlnH | grep -q ':3100' && echo "    ✓ app listening on :3100" || { echo "    ✗ app not on :3100 — check journalctl -u gpt-terminal-plus"; exit 1; }

echo "==> 2/3  add the nginx OAuth route /oauth/ex/$NAME/mcp -> 127.0.0.1:$PORT"
if grep -q "/oauth/ex/$NAME/mcp" "$NGINX_REAL"; then
  echo "    • route already present"
else
  python3 - "$NGINX_REAL" "$NAME" "$PORT" <<'PY'
import sys
f, name, port = sys.argv[1], sys.argv[2], sys.argv[3]
s = open(f).read()
block = f"""    location /oauth/ex/{name}/mcp {{
        auth_request /oauth-validate;
        rewrite ^/oauth/ex/{name}/mcp(/.*)?$ /mcp break;
        proxy_pass http://127.0.0.1:{port};
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header Connection '';
        proxy_buffering off;
        proxy_read_timeout 3600s;
    }}
"""
anchor = "    location / {{ return 404; }}".replace("{{", "{").replace("}}", "}")
assert anchor in s, "catch-all anchor not found; inspect nginx conf manually"
open(f, "w").write(s.replace(anchor, block + anchor, 1))
print("    ✓ route inserted")
PY
fi
nginx -t
systemctl reload nginx
echo "    ✓ nginx reloaded"

echo "==> 3/3  enable + start the gateway backend (supergateway+proxy on :$PORT)"
systemctl enable --now "mcp-server@$NAME"
sleep 8
ss -tlnH | grep -q ":$PORT" && echo "    ✓ backend listening on :$PORT" || { echo "    ✗ backend not on :$PORT — check journalctl -u mcp-server@$NAME"; exit 1; }

echo
echo "DONE. OAuth endpoint: https://mcp.teamstinky.duckdns.org/oauth/ex/$NAME/mcp"
echo "Discovery:           https://mcp.teamstinky.duckdns.org/.well-known/oauth-authorization-server"
