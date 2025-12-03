# OmniShop360 - Workflow CI/CD et Stratégie de Branches

Ce document décrit la stratégie de gestion des branches (Git Flow), les workflows d'intégration et de déploiement continus (CI/CD) mis en place avec GitHub Actions, ainsi que les règles de protection des branches.

## 1. Stratégie de Branches (Git Flow)

Nous utilisons une méthodologie Git Flow adaptée pour structurer notre développement, garantir la stabilité du code et faciliter les releases.

### Branches Principales

- **`main`**: Cette branche représente l'état actuel de la production. Elle est toujours stable et déployable. Tout commit sur `main` doit être une version de production taguée.
- **`develop`**: C'est la branche principale de développement. Elle intègre toutes les fonctionnalités terminées et constitue la source pour les nouvelles releases.

### Branches de Support

- **`feature/*`**: Pour le développement de nouvelles fonctionnalités.
    - **Création**: `git checkout -b feature/nom-de-la-feature develop`
    - **Merge**: Une fois terminée, la branche est mergée dans `develop` via une Pull Request.

- **`release/*`**: Pour la préparation d'une nouvelle release.
    - **Création**: `git checkout -b release/v1.1.0 develop`
    - Permet de finaliser une release (corrections de bugs mineurs, documentation).
    - **Merge**: Une fois prête, la branche est mergée dans `main` (et taguée) et dans `develop` (pour intégrer les corrections).

- **`hotfix/*`**: Pour les corrections critiques en production.
    - **Création**: `git checkout -b hotfix/correction-urgente main`
    - **Merge**: Une fois terminée, la branche est mergée dans `main` (avec un nouveau tag de patch) et dans `develop`.

## 2. Workflows GitHub Actions (CI/CD)

Les workflows sont situés dans le dossier `.github/workflows/`.

### `pr-checks.yml` - Vérifications des Pull Requests

Ce workflow est le point d'entrée pour toute Pull Request ciblant `main`, `develop`, ou `release/*`.

- **Déclencheur**: Ouverture ou synchronisation d'une Pull Request.
- **Jobs**:
    - **`pr-validation`**: Valide le titre de la PR (doit suivre les [Conventional Commits](https://www.conventionalcommits.org/)), le nom de la branche et vérifie l'absence de conflits de merge.
    - **`changed-files`**: Détecte les composants modifiés (backend, frontend, pos, etc.) pour ne lancer que les tests pertinents.
    - **`*-checks`**: Lance les workflows de CI spécifiques aux composants modifiés (ex: `backend-ci.yml`).
    - **`terraform-validate`**: Valide la syntaxe et la configuration de Terraform si des fichiers dans `keycloak-config/` sont modifiés.

### `backend-ci.yml` - CI Backend

- **Déclencheur**: Push sur les branches de développement ou PR vers les branches protégées.
- **Jobs**:
    - **`build-and-test`**: Compile le code, lance les tests unitaires et d'intégration avec une base de données et un Redis de test.
    - **`code-quality`**: Analyse statique du code avec SonarCloud.
    - **`security-scan`**: Scan de vulnérabilités avec Trivy.

### `frontend-ci.yml` & `pos-ci.yml` - CI Frontend & POS

- **Déclencheur**: Similaire au backend.
- **Jobs**:
    - **`build-and-test`**: Installe les dépendances, lint le code, lance les tests unitaires (Karma/Jasmine) et génère un rapport de couverture.
    - **`code-quality`**: Analyse avec SonarCloud.
    - **`security-scan`**: Audit des dépendances (`pnpm audit`) et scan avec Trivy.

### `docker-build.yml` - Build des Images Docker

- **Déclencheur**: Push sur `develop` ou `release/*`.
- **Jobs**: Construit et pousse les images Docker multi-plateformes (amd64, arm64) pour chaque service (backend, frontend, pos, keycloak) vers le GitHub Container Registry (ghcr.io).

### `release.yml` - Processus de Release

- **Déclencheur**: Push d'un tag au format `v*.*.*` sur la branche `main`.
- **Jobs**:
    - **`create-release`**: Génère automatiquement un changelog et crée une Release GitHub.
    - **`build-and-publish`**: Construit les images Docker de production et les publie sur ghcr.io avec le tag de la version et `latest`.
    - **`deploy-production`**: (Placeholder) Notifie et prépare le déploiement en production.

## 3. Protection des Branches

Pour garantir l'intégrité du code, les branches principales sont protégées par des règles strictes. Les push directs sont interdits.

| Branche | Règle | Description |
| :--- | :--- | :--- |
| **`main`** | **2 approbations requises** | - Nécessite une Pull Request.<br>- Tests de CI doivent passer.<br>- Requiert l'approbation de 2 `CODEOWNERS`.<br>- Interdit les push forcés. |
| **`develop`** | **1 approbation requise** | - Nécessite une Pull Request.<br>- Tests de CI doivent passer.<br>- Requiert l'approbation d'au moins 1 `CODEOWNER`. |
| **`release/*`** | **2 approbations requises** | - Mêmes règles que `main` pour garantir la stabilité avant la release. |

### Fichier `CODEOWNERS`

Le fichier `.github/CODEOWNERS` définit les propriétaires de chaque partie du code. Ils sont automatiquement assignés pour la revue des Pull Requests.

### Mise en Place de la Protection

Un script est fourni pour automatiser la configuration de ces règles via l'API GitHub.

**Utilisation :**
```bash
cd .github/scripts
GITHUB_TOKEN=votre_pat_github ./setup-branch-protection.sh
```

> **Note**: Le Personal Access Token (PAT) doit avoir les permissions `repo`.

## 4. Processus de Contribution et de Release

### Contribuer à une nouvelle fonctionnalité

1.  Créez une branche `feature` depuis `develop`: `git checkout -b feature/ma-super-feature develop`
2.  Développez et commitez votre travail.
3.  Poussez votre branche: `git push origin feature/ma-super-feature`
4.  Ouvrez une Pull Request de `feature/ma-super-feature` vers `develop`.
5.  Attendez la validation des tests et l'approbation des reviewers.
6.  Mergez la PR.

### Créer une nouvelle Release

1.  Créez une branche `release` depuis `develop`: `git checkout -b release/v1.2.0 develop`
2.  Mettez à jour la version dans les fichiers de projet si nécessaire et effectuez les dernières corrections.
3.  Ouvrez une Pull Request de `release/v1.2.0` vers `main`.
4.  Une fois la PR validée et mergée, taguez la version sur `main`:
    ```bash
    git checkout main
    git pull origin main
    git tag -a v1.2.0 -m "Release 1.2.0"
    git push origin v1.2.0
    ```
5.  Le push du tag déclenchera le workflow `release.yml`.
6.  Mergez également la branche `release` dans `develop` pour y intégrer les corrections de dernière minute: `git checkout develop && git merge release/v1.2.0`.
