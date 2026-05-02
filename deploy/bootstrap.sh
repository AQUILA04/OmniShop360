#!/usr/bin/env bash
set -euo pipefail
# bootstrap.sh — idempotent bootstrap for Ubuntu 24.04 (also works on Ubuntu LTS variants)
# Usage (as root):
#   sudo bash bootstrap.sh --ssh-pub-key-file /path/to/deploy_key.pub [--domain example.com]

SSH_PUB_KEY_FILE=""
DOMAIN=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --ssh-pub-key-file)
      SSH_PUB_KEY_FILE="$2"; shift 2 ;;
    --domain)
      DOMAIN="$2"; shift 2 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

DEPLOY_USER="deploy"
DEPLOY_HOME="/home/${DEPLOY_USER}"
APP_DIR="/srv/omnishop360"
COMPOSE_DIR="${APP_DIR}/compose"
BACKUP_DIR="${APP_DIR}/backups"
SWAP_FILE="/swapfile"
DOCKER_COMPOSE_FILE="${COMPOSE_DIR}/docker-compose.yml"

if [ -f /etc/os-release ]; then
  . /etc/os-release
  OS_ID="${ID,,}"
  OS_VERSION="${VERSION_ID}"
else
  echo "Unable to detect OS"; exit 1
fi

echo "Detected OS: $OS_ID $OS_VERSION"

# --- 1) Create deploy user if missing ---
if id -u "$DEPLOY_USER" >/dev/null 2>&1; then
  echo "User $DEPLOY_USER exists"
else
  echo "Create user $DEPLOY_USER"
  useradd -m -s /bin/bash "$DEPLOY_USER"
  usermod -aG sudo "$DEPLOY_USER" || true
fi

# --- 2) Install prerequisites and Docker (Ubuntu) ---
if [[ "$OS_ID" == "ubuntu" || "$OS_ID" == "debian" ]]; then
  export DEBIAN_FRONTEND=noninteractive
  
  # Remove broken nodesource repositories to avoid apt-get update failures (nodistro error)
  rm -f /etc/apt/sources.list.d/nodesource.list || true

  apt-get update -y
  apt-get install -y --no-install-recommends ca-certificates curl gnupg lsb-release apt-transport-https software-properties-common

  # Install Docker official repo
  if [ ! -f /etc/apt/sources.list.d/docker.list ]; then
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" |
      tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update -y
  fi

  apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
  apt-get install -y iptables fail2ban ufw git
fi

# Start and enable docker
systemctl enable --now docker

# --- 3) Add deploy user to docker group ---
if getent group docker >/dev/null 2>&1; then
  usermod -aG docker "$DEPLOY_USER" || true
fi

# --- 4) Firewall setup (ufw) ---
if command -v ufw >/dev/null 2>&1; then
  ufw allow OpenSSH || true
  ufw allow http || true
  ufw allow https || true
  ufw --force enable || true
fi

# --- 5) Create directories ---
mkdir -p "${COMPOSE_DIR}" "${BACKUP_DIR}" "${APP_DIR}/data"
chown -R "${DEPLOY_USER}:${DEPLOY_USER}" "${APP_DIR}"

# --- 6) Swap: add 2G if low memory and no swap ---
MEM_KB=$(awk '/MemTotal/ {print $2}' /proc/meminfo || echo 0)
MEM_MB=$((MEM_KB/1024))
if [ "$MEM_MB" -lt 2000 ] && ! swapon --show | grep -q "$SWAP_FILE"; then
  echo "Creating 2G swap at $SWAP_FILE"
  fallocate -l 2G "$SWAP_FILE" || dd if=/dev/zero of="$SWAP_FILE" bs=1M count=2048
  chmod 600 "$SWAP_FILE"
  mkswap "$SWAP_FILE"
  swapon "$SWAP_FILE"
  echo "$SWAP_FILE none swap sw 0 0" >> /etc/fstab
fi

# --- 7) SSL is now handled automatically by Caddy Server ---

# --- 8) Install authorized key for deploy user if provided ---
if [ -n "$SSH_PUB_KEY_FILE" ] && [ -f "$SSH_PUB_KEY_FILE" ]; then
  mkdir -p "${DEPLOY_HOME}/.ssh"
  cat "$SSH_PUB_KEY_FILE" >> "${DEPLOY_HOME}/.ssh/authorized_keys"
  chown -R "${DEPLOY_USER}:${DEPLOY_USER}" "${DEPLOY_HOME}/.ssh"
  chmod 700 "${DEPLOY_HOME}/.ssh"
  chmod 600 "${DEPLOY_HOME}/.ssh/authorized_keys"
  echo "Installed SSH public key for ${DEPLOY_USER}"
fi

# --- 9) Systemd unit to manage docker compose stack ---
SYSTEMD_UNIT="/etc/systemd/system/omnishop-docker-compose.service"
cat > "$SYSTEMD_UNIT" <<EOF
[Unit]
Description=OmniShop360 docker compose stack
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=${COMPOSE_DIR}
ExecStart=/usr/bin/docker compose -f ${DOCKER_COMPOSE_FILE} pull || true
ExecStartPost=/usr/bin/docker compose -f ${DOCKER_COMPOSE_FILE} up -d
ExecStop=/usr/bin/docker compose -f ${DOCKER_COMPOSE_FILE} down
TimeoutStartSec=600
User=${DEPLOY_USER}
Group=${DEPLOY_USER}

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable omnishop-docker-compose.service || true

# --- 10) Backup script + timer (daily) ---
BACKUP_SCRIPT="/usr/local/bin/omnishop_backup.sh"
cat > "$BACKUP_SCRIPT" <<'EOS'
#!/usr/bin/env bash
set -euo pipefail
APP_DIR="/srv/omnishop360"
BACKUP_DIR="${APP_DIR}/backups"
TIMESTAMP=$(date +'%Y%m%d-%H%M%S')
mkdir -p "$BACKUP_DIR"
if docker ps --format '{{.Names}}' | grep -q omnishop-postgres; then
  docker exec omnishop-postgres pg_dump -U omnishop omnishop360 | gzip > "${BACKUP_DIR}/pgdump-${TIMESTAMP}.sql.gz"
fi
for VOL in omnishop-postgres-data omnishop-redis-data; do
  docker run --rm -v "${VOL}":/volume -v "${BACKUP_DIR}":/backup alpine sh -c "cd /volume && tar czf /backup/${VOL}-${TIMESTAMP}.tar.gz ." || true
done
# keep last 7
ls -1t ${BACKUP_DIR} | tail -n +8 | xargs -r -I{} rm -f ${BACKUP_DIR}/{}
EOS

chmod +x "$BACKUP_SCRIPT"

SERVICE_UNIT="/etc/systemd/system/omnishop-backup.service"
TIMER_UNIT="/etc/systemd/system/omnishop-backup.timer"
cat > "$SERVICE_UNIT" <<EOF
[Unit]
Description=Run OmniShop backup
[Service]
Type=oneshot
ExecStart=${BACKUP_SCRIPT}
EOF
cat > "$TIMER_UNIT" <<EOF
[Unit]
Description=Daily OmniShop backup
[Timer]
OnCalendar=daily
Persistent=true
[Install]
WantedBy=timers.target
EOF

systemctl daemon-reload
systemctl enable --now omnishop-backup.timer || true

echo "Bootstrap complete. Put your docker-compose.yml at: ${DOCKER_COMPOSE_FILE} and adjust .env as needed."

echo "Notes:"
echo " - This script creates a self-signed cert when --domain is not provided. Replace with certbot when you have a domain."
echo " - Recommended workflow: build images in CI, push to GHCR, then use docker compose pull && docker compose up -d on this server."

exit 0

