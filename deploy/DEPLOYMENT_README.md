OmniShop360 - Déploiement sur VPS Hetzner (Ubuntu 24.04)
=====================================================

Résumé
------
Ce guide couvre les étapes pour préparer le VPS Ubuntu 24.04 (IP: 178.104.248.247), les secrets GitHub à créer, l'exécution du script bootstrap et le pipeline GitHub Actions (GHCR + SSH deploy). Le déploiement utilisera une clé SSH (déployée par l'administrateur) et un certificat auto-signé pour l'IP (puis remplacement par Let's Encrypt quand le domaine sera disponible).

Fichiers ajoutés
- `deploy/bootstrap.sh` : script idempotent d'amorçage pour Ubuntu 24.04
- `.github/workflows/ci-cd-deploy.yml` : workflow GitHub Actions (build → GHCR → SSH deploy)
- `deploy/DEPLOYMENT_README.md` : ce fichier

Choix faits
- Registry : GHCR (ghcr.io)
- Keycloak : construit dans CI
- Backup : local disk (environnement de validation/test)
- Mode TLS initial : certificat auto-signé (IP) — passer à certbot/Let's Encrypt quand domaine `omnishop360.com` sera prêt

GitHub Secrets nécessaires
- `GHCR_TOKEN` : token personnel (GHCR) avec permissions write:packages
- `DEPLOY_SSH_PRIVATE_KEY` : clé privée SSH correspondante à la clé publique ajoutée sur le serveur (user `deploy`)
- `SERVER_IP` : 178.104.248.247
- `SERVER_SSH_USER` : deploy
- `KEYCLOAK_CLIENT_SECRET` : secret Keycloak
- `POSTGRES_PASSWORD` : mot de passe Postgres (optionnel si géré localement sur serveur)
- (optionnel) `SMTP_USER`, `SMTP_PASS` si vous utilisez SMTP réel

Recommandation pour la clé SSH (meilleure pratique)
1. Générez la clé de déploiement sur votre machine locale (admin) :

```bash
ssh-keygen -t ed25519 -C "deploy@omnishop" -f ~/.ssh/omnishop_deploy
```

2. Copiez la clé publique sur le serveur (en tant que root ou via sudo) :

```bash
ssh-copy-id -i ~/.ssh/omnishop_deploy.pub deploy@178.104.248.247
```

3. Ajoutez la clé privée (`~/.ssh/omnishop_deploy`) comme secret GitHub `DEPLOY_SSH_PRIVATE_KEY` (contenu entier).

Remarque : vous pouvez aussi générer la clé sur le VPS, mais garder la clé privée hors du serveur est préférable (privée stockée uniquement dans GitHub Secrets).

Exécution du bootstrap (sur le VPS)
---------------------------------
Copiez le script `deploy/bootstrap.sh` sur le serveur (ou clonez le repo) puis exécutez en root :

```bash
# sur le VPS en tant que root
sudo bash /path/to/repo/deploy/bootstrap.sh --ssh-pub-key-file /home/you/omnishop_deploy.pub
```

Le script :
- installe Docker, docker compose plugin, nginx, fail2ban, ufw
- crée l'utilisateur `deploy` et place la clé publique
- prépare `/srv/omnishop360/compose` et `/srv/omnishop360/backups`
- crée un service systemd `omnishop-docker-compose.service` et un timer de backup
- génère un certificat auto-signé pour l'IP (si aucun domaine fourni)

Déployer initialement le docker-compose
-------------------------------------
1. Copier `deploy/dev/docker-compose.yml` sur le serveur :

```bash
scp deploy/dev/docker-compose.yml deploy@178.104.248.247:/srv/omnishop360/compose/docker-compose.yml
```

2. (Optionnel) Créer `/srv/omnishop360/compose/.env` avec les secrets locaux si vous ne voulez pas qu'ils soient injectés via GitHub Secrets :

```bash
sudo -u deploy tee /srv/omnishop360/compose/.env <<EOF
POSTGRES_PASSWORD=omnishop_password
KEYCLOAK_CLIENT_SECRET=changeme
EOF
```

3. Depuis le serveur (user deploy) démarrer le stack :

```bash
cd /srv/omnishop360/compose
docker compose pull
docker compose up -d
```

Commandes de vérification
- `docker ps` pour voir les containers
- `docker compose -f /srv/omnishop360/compose/docker-compose.yml ps` pour le stack
- `curl http://localhost:8081/api/actuator/health` pour vérifier le backend

Pipeline GitHub Actions (déclenchement)
-------------------------------------
- Le workflow `.github/workflows/ci-cd-deploy.yml` se déclenche sur push vers `main`.
- Il build les images pour `backend`, `frontend`, `pos`, `keycloak`, push vers GHCR et copie le `docker-compose.yml` puis exécute `docker compose pull` et `docker compose up -d` sur le serveur via SSH.

Rollback simple
---------------
- Gardez des tags immuables (sha). Pour rollback : modifier le `docker-compose.yml` sur le serveur pour utiliser un tag antérieur (ex: `:abc123`) puis `docker compose pull && docker compose up -d`.

Backups
-------
- Le script de backup journalier fait : pg_dump (gzip) et tar.gz des volumes `omnishop-postgres-data` et `omnishop-redis-data`.
- Rétention par défaut : derniers 7 fichiers.
- Pour restore : arrêter le stack, re-injecter les dumps via `docker exec -i omnishop-postgres psql -U omnishop -d omnishop360`, et extraire les tar dans les volumes.

Sécurité & production notes
- Ne pas exposer Postgres (5432) publiquement.
- Remplacer le certificat auto-signé par Let's Encrypt dès que `omnishop360.com` est disponible.
- En production, considérer Hetzner Managed DB ou cluster et un load balancer.

Questions fréquentes
- "Dois-je créer la clé SSH ?" — oui : créez la clé localement, installez la publique sur le serveur, ajoutez la privée en GitHub Secrets.

Support
-------
Je peux :
- adapter `docker-compose.yml` pour utiliser les images GHCR avec tags `${{ github.sha }}`
- ajouter un script d'upgrade/rollback automatisé
- créer un guide pour migrer de self-signed à certbot une fois le domaine prêt

