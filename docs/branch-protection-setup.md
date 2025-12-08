# Configuration des Protections de Branches

Ce document explique comment configurer manuellement les protections de branches sur GitHub pour le projet OmniShop360.

## Pourquoi la Configuration Manuelle ?

L'API GitHub pour la protection de branches nécessite un Personal Access Token (PAT) avec des permissions spécifiques qui ne sont pas disponibles pour les PAT classiques. Les protections de branches doivent donc être configurées manuellement via l'interface web de GitHub.

## Étapes de Configuration

### 1. Accéder aux Paramètres du Repository

1. Allez sur https://github.com/AQUILA04/OmniShop360
2. Cliquez sur **Settings** (Paramètres)
3. Dans le menu latéral, cliquez sur **Branches**

### 2. Configurer la Protection de la Branche `main`

1. Cliquez sur **Add branch protection rule**
2. Dans **Branch name pattern**, entrez : `main`
3. Cochez les options suivantes :

#### Require a pull request before merging
- ✅ **Require a pull request before merging**
- ✅ **Require approvals** : Définir à **2**
- ✅ **Dismiss stale pull request approvals when new commits are pushed**
- ✅ **Require review from Code Owners**
- ✅ **Require approval of the most recent reviewable push**

#### Require status checks to pass before merging
- ✅ **Require status checks to pass before merging**
- ✅ **Require branches to be up to date before merging**
- Recherchez et ajoutez les status checks suivants :
  - `Build and Test Backend`
  - `Build and Test Frontend`
  - `Build and Test POS`
  - `Code Quality Analysis`
  - `Security Scan`

#### Additional Settings
- ✅ **Require conversation resolution before merging**
- ✅ **Require linear history**
- ✅ **Include administrators** (Enforce all configured restrictions for administrators)
- ✅ **Do not allow bypassing the above settings**
- ❌ **Allow force pushes** (désactivé)
- ❌ **Allow deletions** (désactivé)

4. Cliquez sur **Create** pour sauvegarder

### 3. Configurer la Protection de la Branche `develop`

1. Cliquez sur **Add branch protection rule**
2. Dans **Branch name pattern**, entrez : `develop`
3. Cochez les options suivantes :

#### Require a pull request before merging
- ✅ **Require a pull request before merging**
- ✅ **Require approvals** : Définir à **1**
- ✅ **Dismiss stale pull request approvals when new commits are pushed**

#### Require status checks to pass before merging
- ✅ **Require status checks to pass before merging**
- ✅ **Require branches to be up to date before merging**
- Ajoutez les status checks :
  - `Build and Test Backend`
  - `Build and Test Frontend`
  - `Build and Test POS`

#### Additional Settings
- ✅ **Require conversation resolution before merging**
- ❌ **Allow force pushes** (désactivé)
- ❌ **Allow deletions** (désactivé)

4. Cliquez sur **Create** pour sauvegarder

### 4. Configurer la Protection des Branches `release/*`

1. Cliquez sur **Add branch protection rule**
2. Dans **Branch name pattern**, entrez : `release/*`
3. Utilisez les **mêmes paramètres que pour `main`** (protection stricte)

4. Cliquez sur **Create** pour sauvegarder

## Vérification

Une fois les règles configurées, vous devriez voir trois règles de protection dans la liste :

| Branch Pattern | Approvals Required | Status Checks | Force Push |
| :--- | :--- | :--- | :--- |
| `main` | 2 | 5 checks | ❌ Disabled |
| `develop` | 1 | 3 checks | ❌ Disabled |
| `release/*` | 2 | 5 checks | ❌ Disabled |

## Test de la Configuration

Pour vérifier que les protections fonctionnent :

1. Essayez de pousser directement sur `main` : cela devrait être refusé
2. Créez une branche `feature/test` depuis `develop`
3. Faites un changement et créez une Pull Request vers `develop`
4. Vérifiez que les workflows CI se lancent automatiquement
5. Vérifiez qu'au moins 1 approbation est requise avant de pouvoir merger

## Notes Importantes

- Les administrateurs du repository peuvent contourner ces règles si nécessaire (option "Include administrators" permet de les forcer également)
- Les status checks doivent avoir été exécutés au moins une fois pour apparaître dans la liste de sélection
- Les règles de protection s'appliquent également aux webhooks et aux applications GitHub

## Ressources

- [Documentation GitHub - Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Documentation GitHub - Status Checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks)
