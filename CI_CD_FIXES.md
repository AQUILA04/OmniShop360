# OmniShop360 - Corrections des Workflows CI/CD

## Problèmes Identifiés et Résolus

### 1. ❌ Backend Build Failure - Maven Wrapper Manquant

**Erreur :**
```
./mvnw: 112: cannot open ./.mvn/wrapper/maven-wrapper.properties: No such file
Error: Process completed with exit code 2.
```

**Cause :** Le projet Spring Boot a été initialisé sans les fichiers Maven wrapper nécessaires pour l'exécution dans GitHub Actions.

**Solution :**
- Ajout du dossier `.mvn/wrapper/` avec les fichiers requis :
  - `maven-wrapper.jar` (version 3.2.0)
  - `maven-wrapper.properties` (Maven 3.9.6)

**Résultat :** Le backend peut maintenant être compilé et testé dans GitHub Actions sans nécessiter une installation Maven préalable.

---

### 2. ❌ Security Scan - Permissions CodeQL Manquantes

**Erreur :**
```
Warning: This run of the CodeQL Action does not have permission to access the CodeQL Action API endpoints.
Error: Resource not accessible by integration
```

**Cause :** Les workflows n'avaient pas les permissions nécessaires pour uploader les résultats de scan de sécurité vers GitHub Security.

**Solution :**
Ajout des permissions au niveau du workflow dans tous les fichiers concernés :

```yaml
permissions:
  contents: read
  security-events: write  # Pour CodeQL/Trivy uploads
  pull-requests: write    # Pour les commentaires sur les PRs
```

**Fichiers modifiés :**
- `backend-ci.yml`
- `frontend-ci.yml`
- `docker-build.yml`
- `pr-checks.yml`

**Résultat :** Les scans de sécurité peuvent maintenant uploader leurs résultats vers l'onglet "Security" de GitHub.

---

### 3. ❌ Docker Build - Format de Tag Invalide

**Erreur :**
```
ERROR: failed to build: invalid tag "ghcr.io/aquila04/omnishop360/backend:-9ee372f": invalid reference format
```

**Cause :** La configuration `docker/metadata-action` utilisait un pattern invalide pour les tags SHA :
```yaml
type=sha,prefix={{branch}}-
```

Le problème était que `{{branch}}` n'est pas une variable valide dans ce contexte, et le préfixe générait un tag commençant par `-` (tiret), ce qui est invalide.

**Solution :**
Simplification du pattern de tag SHA en retirant le préfixe problématique :

```yaml
# Avant (invalide)
type=sha,prefix={{branch}}-

# Après (valide)
type=sha
```

**Fichiers modifiés :**
- `docker-build.yml` (4 occurrences : backend, frontend, pos, keycloak)

**Résultat :** Les images Docker peuvent maintenant être construites et publiées avec des tags valides sur GitHub Container Registry.

---

## Récapitulatif des Changements

### Fichiers Ajoutés

| Fichier | Description |
|---------|-------------|
| `backend/.mvn/wrapper/maven-wrapper.jar` | Wrapper Maven pour l'exécution sans installation |
| `backend/.mvn/wrapper/maven-wrapper.properties` | Configuration du wrapper (Maven 3.9.6) |

### Fichiers Modifiés

| Fichier | Changement |
|---------|------------|
| `.github/workflows/backend-ci.yml` | Ajout des permissions (security-events, pull-requests) |
| `.github/workflows/frontend-ci.yml` | Ajout des permissions (security-events, pull-requests) |
| `.github/workflows/docker-build.yml` | Ajout des permissions + correction des tags Docker |
| `.github/workflows/pr-checks.yml` | Ajout des permissions (pull-requests, statuses) |

---

## Validation des Corrections

### Tests à Effectuer

Pour valider que toutes les corrections fonctionnent :

1. **Backend Build :**
   ```bash
   cd backend
   ./mvnw clean compile
   ./mvnw test
   ```
   ✅ Devrait compiler et exécuter les tests sans erreur

2. **Workflows GitHub Actions :**
   - Créer une PR de test vers `develop`
   - Vérifier que tous les workflows se lancent
   - Vérifier que les status checks passent au vert

3. **Docker Build :**
   - Vérifier que les images sont construites sans erreur de tag
   - Vérifier que les images sont publiées sur ghcr.io

4. **Security Scans :**
   - Vérifier que les résultats Trivy apparaissent dans l'onglet "Security"
   - Vérifier qu'aucune erreur de permission n'apparaît

---

## Prochaines Étapes Recommandées

### 1. Ajouter les Secrets GitHub (Optionnel)

Si vous souhaitez activer SonarCloud et Codecov :

**SonarCloud :**
1. Créer un compte sur https://sonarcloud.io
2. Ajouter le secret `SONAR_TOKEN` dans Settings → Secrets → Actions

**Codecov :**
1. Créer un compte sur https://codecov.io
2. Connecter le repository (pas de secret nécessaire pour les repos publics)

### 2. Configurer les Branch Protection Rules

Suivre le guide dans `docs/branch-protection-setup.md` pour activer les protections de branches.

### 3. Tester le Workflow Complet

Créer une feature branch et faire une PR pour valider l'ensemble du processus :

```bash
git checkout develop
git pull origin develop
git checkout -b feature/test-ci-fixes
echo "# Test CI" >> TEST.md
git add TEST.md
git commit -m "test: Validate CI/CD fixes"
git push origin feature/test-ci-fixes
# Créer une PR sur GitHub
```

---

## Statut Actuel

| Composant | Status | Notes |
|-----------|--------|-------|
| Backend CI | ✅ Corrigé | Maven wrapper ajouté, permissions OK |
| Frontend CI | ✅ Corrigé | Permissions ajoutées |
| POS CI | ✅ OK | Pas de problème détecté |
| Docker Build | ✅ Corrigé | Tags Docker valides |
| Security Scans | ✅ Corrigé | Permissions pour uploads |
| PR Checks | ✅ Corrigé | Permissions pour commentaires |

---

**Date de correction :** 3 décembre 2025  
**Commit :** `7258632` - fix: Correct CI/CD workflow issues  
**Branche :** `develop`
