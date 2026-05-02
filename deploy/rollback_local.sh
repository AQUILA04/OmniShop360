#!/usr/bin/env bash
set -euo pipefail
# rollback_local.sh - render compose from template and deploy on the server
# Usage: sudo bash rollback_local.sh <tag>

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <tag>"; exit 2
fi

TAG="$1"
GHCR_OWNER="AQUILA04"
APP_DIR="/srv/omnishop360"
COMPOSE_DIR="$APP_DIR/compose"
TEMPLATE="$COMPOSE_DIR/docker-compose.template.yml"
TARGET="$COMPOSE_DIR/docker-compose.yml"
RELEASES_DIR="$APP_DIR/releases"

mkdir -p "$RELEASES_DIR"

TS=$(date +%Y%m%d-%H%M%S)
if [ -f "$TARGET" ]; then
  cp "$TARGET" "$RELEASES_DIR/docker-compose.$TS.yml"
fi

if [ ! -f "$TEMPLATE" ]; then
  echo "Template not found: $TEMPLATE"
  echo "Please place a template at $TEMPLATE (with placeholders __GHCR_OWNER__ and __TAG__)"
  exit 1
fi

sed "s|__GHCR_OWNER__|${GHCR_OWNER}|g; s|__TAG__|${TAG}|g" "$TEMPLATE" > "$TARGET"

echo "Rendered compose to $TARGET (tag=$TAG). Backed up previous to $RELEASES_DIR"

cd "$COMPOSE_DIR"
docker compose pull || true
docker compose up -d
docker image prune -f || true

# append release metadata
METAFILE="$RELEASES_DIR/releases.json"
jq -n --arg t "$TAG" --arg dt "$TS" '{tag:$t, timestamp:$dt}' >> "$METAFILE" 2>/dev/null || echo "[{\"tag\":\"$TAG\",\"timestamp\":\"$TS\"}]" > "$METAFILE"

echo "Deployment complete."
exit 0

