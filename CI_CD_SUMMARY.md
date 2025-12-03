# OmniShop360 - Résumé de la Configuration CI/CD

## Vue d'ensemble

Le projet OmniShop360 dispose maintenant d'une infrastructure complète de CI/CD (Continuous Integration / Continuous Deployment) basée sur GitHub Actions, avec une stratégie Git Flow pour la gestion des branches.

## Workflows GitHub Actions Configurés

### 1. Backend CI (`backend-ci.yml`)

Ce workflow assure la qualité du code backend Spring Boot.

**Déclencheurs :**
- Push sur `develop`, `release/*`, `feature/*`, `hotfix/*`
- Pull Request vers `main`, `develop`, `release/*`

**Jobs :**
- **Build and Test** : Compilation Maven, tests unitaires et d'intégration avec PostgreSQL et Redis
- **Code Quality** : Analyse SonarCloud pour la qualité du code
- **Security Scan** : Scan de vulnérabilités avec Trivy

**Couverture de code :** JaCoCo avec minimum 50% de couverture

### 2. Frontend CI (`frontend-ci.yml`)

Workflow pour l'application d'administration Angular.

**Déclencheurs :** Identiques au backend

**Jobs :**
- **Build and Test** : Installation pnpm, linting, tests Karma/Jasmine, build production
- **Code Quality** : Analyse SonarCloud
- **Security Scan** : Audit npm et scan Trivy

### 3. POS CI (`pos-ci.yml`)

Workflow pour l'application Point de Vente Angular.

**Déclencheurs :** Identiques au backend

**Jobs :**
- **Build and Test** : Tests unitaires et build
- **Performance Test** : Tests de performance avec Lighthouse CI

### 4. Docker Build (`docker-build.yml`)

Construction et publication des images Docker.

**Déclencheurs :**
- Push sur `develop`, `release/*`
- Pull Request vers `main`, `develop`, `release/*`

**Jobs :**
- Build multi-plateforme (amd64, arm64) pour :
  - Backend
  - Frontend
  - POS
  - Keycloak
- Publication sur GitHub Container Registry (ghcr.io)
- Scan de sécurité des images avec Trivy

### 5. Pull Request Checks (`pr-checks.yml`)

Validation complète des Pull Requests.

**Déclencheurs :** Ouverture ou mise à jour d'une PR

**Jobs :**
- **PR Validation** : Vérification du titre (Conventional Commits), nom de branche, conflits
- **Changed Files** : Détection des composants modifiés
- **Component Checks** : Lancement des workflows spécifiques aux composants modifiés
- **Terraform Validate** : Validation de la configuration Terraform
- **PR Summary** : Génération d'un résumé automatique

### 6. Release (`release.yml`)

Automatisation du processus de release.

**Déclencheurs :** Push d'un tag `v*.*.*`

**Jobs :**
- **Create Release** : Génération du changelog et création de la release GitHub
- **Build and Publish** : Construction et publication des images Docker de production
- **Deploy Production** : Notification de déploiement (à personnaliser)

## Stratégie Git Flow

### Branches Principales

| Branche | Rôle | Protection |
| :--- | :--- | :--- |
| **main** | Production stable | 2 approbations, tous les tests |
| **develop** | Intégration continue | 1 approbation, tests essentiels |

### Branches de Support

- **feature/*** : Nouvelles fonctionnalités (depuis `develop`)
- **release/*** : Préparation de release (depuis `develop`)
- **hotfix/*** : Corrections urgentes (depuis `main`)

### Workflow de Contribution

1. **Nouvelle fonctionnalité** :
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/ma-fonctionnalite
   # Développement...
   git push origin feature/ma-fonctionnalite
   # Créer une PR vers develop
   ```

2. **Release** :
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b release/v1.0.0
   # Finalisation...
   git push origin release/v1.0.0
   # PR vers main
   # Après merge, créer le tag
   git tag -a v1.0.0 -m "Release 1.0.0"
   git push origin v1.0.0
   ```

3. **Hotfix** :
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/correction-critique
   # Correction...
   git push origin hotfix/correction-critique
   # PR vers main ET develop
   ```

## Protection des Branches

### Configuration Requise (Manuelle)

Les protections de branches doivent être configurées manuellement via l'interface GitHub :

**Branche `main` :**
- ✅ Require pull request (2 approbations)
- ✅ Require status checks (5 checks obligatoires)
- ✅ Require code owner review
- ✅ Require linear history
- ✅ Include administrators
- ❌ Allow force pushes (désactivé)
- ❌ Allow deletions (désactivé)

**Branche `develop` :**
- ✅ Require pull request (1 approbation)
- ✅ Require status checks (3 checks obligatoires)
- ❌ Allow force pushes (désactivé)

**Pattern `release/*` :**
- Mêmes règles que `main`

**Guide détaillé :** Voir `docs/branch-protection-setup.md`

## Fichiers de Gouvernance

### CODEOWNERS

Le fichier `.github/CODEOWNERS` définit les propriétaires automatiques pour chaque partie du code :
- Backend : @AQUILA04
- Frontend : @AQUILA04
- POS : @AQUILA04
- Infrastructure : @AQUILA04
- Documentation : @AQUILA04

### Pull Request Template

Un template complet est fourni dans `.github/pull_request_template.md` avec :
- Description du changement
- Type de changement
- Composants affectés
- Checklist de validation
- Tests effectués
- Screenshots si applicable

## Intégrations Externes

### SonarCloud (Optionnel)

Pour activer l'analyse de qualité du code :
1. Créer un compte sur [SonarCloud](https://sonarcloud.io)
2. Ajouter le secret `SONAR_TOKEN` dans les settings GitHub
3. Configurer l'organisation `omnishop360`

### Codecov (Optionnel)

Pour les rapports de couverture de code :
1. Créer un compte sur [Codecov](https://codecov.io)
2. Connecter le repository GitHub
3. Les rapports seront automatiquement uploadés

## Status Checks Requis

Pour merger une PR vers `main`, ces checks doivent passer :

1. ✅ Build and Test Backend
2. ✅ Build and Test Frontend
3. ✅ Build and Test POS
4. ✅ Code Quality Analysis
5. ✅ Security Scan

Pour merger vers `develop` :

1. ✅ Build and Test Backend
2. ✅ Build and Test Frontend
3. ✅ Build and Test POS

## Prochaines Étapes

### Configuration Immédiate

1. **Configurer les protections de branches** (voir `docs/branch-protection-setup.md`)
2. **Ajouter les secrets GitHub** (si SonarCloud/Codecov utilisés)
3. **Tester le workflow** en créant une PR de test

### Améliorations Futures

1. **Déploiement automatique** :
   - Kubernetes manifests
   - Helm charts
   - ArgoCD/FluxCD pour GitOps

2. **Tests E2E** :
   - Cypress ou Playwright
   - Tests d'intégration inter-services

3. **Monitoring** :
   - Prometheus/Grafana
   - Alertes automatiques

4. **Performance** :
   - Tests de charge (JMeter, k6)
   - Profiling automatique

## Ressources

- [Documentation Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)

---

**Date de création** : 3 décembre 2025  
**Branche** : `develop`  
**Status** : ✅ Configuration complète
