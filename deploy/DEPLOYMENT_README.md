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
- Mode TLS : Automatisé via **Caddy Server** (Reverse Proxy inclus dans Docker Compose). Caddy gère les routes et le HTTPS automatiquement (ou fonctionne en HTTP par défaut si seul l'IP est fourni).

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
- installe Docker, docker compose plugin, fail2ban, ufw
- crée l'utilisateur `deploy` et place la clé publique
- prépare `/srv/omnishop360/compose` et `/srv/omnishop360/backups`
- crée un service systemd `omnishop-docker-compose.service` et un timer de backup

Déployer initialement le docker-compose
-------------------------------------
1. Copier `deploy/docker-compose.prod.yml` (version VPS) sur le serveur :

```bash
# Le workflow GitHub Actions prépare automatiquement deploy/docker-compose.prod.yml
# en remplaçant le propriétaire GHCR et le tag (sha) puis le copie sur le serveur.
# Si vous préférez copier manuellement :
scp deploy/docker-compose.prod.yml deploy@178.104.248.247:/srv/omnishop360/compose/docker-compose.yml
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

Rollback automatisé via GitHub Actions
-------------------------------------
- Un workflow manuel `Rollback - Deploy specific image tag` a été ajouté : `.github/workflows/rollback.yml`.
- Pour l'utiliser : dans l'interface GitHub Actions, lancez le workflow manuellement (Run workflow) et fournissez le `tag` (ex: un commit SHA ou `latest`). Le workflow préparera le `docker-compose` avec le tag demandé, le copiera sur le serveur et exécutera `docker compose pull && docker compose up -d`. Il effectue aussi un healthcheck après le déploiement.

Remarques :
- Le workflow de rollback requiert les mêmes secrets GitHub (`DEPLOY_SSH_PRIVATE_KEY`, `SERVER_IP`, `SERVER_SSH_USER`).
- Utilisez le tag du commit que vous souhaitez restaurer (vous pouvez retrouver les tags/shas dans l'historique GitHub Actions / images GHCR).

Rollback local (script sur le serveur)
-------------------------------------
Un script local `deploy/rollback_local.sh` a été ajouté au dépôt. Il peut être copié sur le serveur et permet de rendre un `docker-compose.yml` à partir d'un template et de lancer la mise à jour localement.

Installation / utilisation sur le serveur :
1. Copiez le template `deploy/docker-compose.prod.yml` (ou créez un fichier `/srv/omnishop360/compose/docker-compose.template.yml`) qui contient les placeholders `__GHCR_OWNER__` et `__TAG__`.
2. Copiez le script `deploy/rollback_local.sh` sur le serveur (par ex `/usr/local/bin/omnishop_rollback.sh`) et rendez-le exécutable :

```bash
sudo cp deploy/rollback_local.sh /usr/local/bin/omnishop_rollback.sh
sudo chmod +x /usr/local/bin/omnishop_rollback.sh
```

3. Pour déployer une version spécifique sur le serveur (sans passer par GitHub Actions), exécutez :

```bash
sudo /usr/local/bin/omnishop_rollback.sh <TAG>
# ex: sudo /usr/local/bin/omnishop_rollback.sh a1b2c3d4
```

4. Le script sauvegarde l'ancien `docker-compose.yml` dans `/srv/omnishop360/releases/`, rend le template avec le tag demandé, fait `docker compose pull` et `docker compose up -d`, puis conserve un historique simple des releases.

Remarque : le script utilise `jq` pour maintenir un fichier JSON d'historique si `jq` est installé, sinon il écrit un simple `releases.log`.

Backups
-------
- Le script de backup journalier fait : pg_dump (gzip) et tar.gz des volumes `omnishop-postgres-data` et `omnishop-redis-data`.
- Rétention par défaut : derniers 7 fichiers.
- Pour restore : arrêter le stack, re-injecter les dumps via `docker exec -i omnishop-postgres psql -U omnishop -d omnishop360`, et extraire les tar dans les volumes.

Sécurité & production notes
- Ne pas exposer Postgres (5432) et Redis (6379) publiquement. Ils sont maintenant uniquement accessibles sur le réseau interne Docker (`omnishop-network`).
- Caddy gère le reverse proxy. Pour ajouter Let's Encrypt plus tard, il suffit de remplacer `http://178.104.248.247` par `votre-domaine.com` dans le fichier `Caddyfile` et Caddy fera le reste automatiquement.
- En production, considérer Hetzner Managed DB ou cluster et un load balancer.

Questions fréquentes
- "Dois-je créer la clé SSH ?" — oui : créez la clé localement, installez la publique sur le serveur, ajoutez la privée en GitHub Secrets.

Support
-------
Je peux :
- adapter `docker-compose.yml` pour utiliser les images GHCR avec tags `${{ github.sha }}`
- ajouter un script d'upgrade/rollback automatisé
- vous accompagner lorsque vous serez prêt à ajouter un domaine personnalisé dans Caddy


