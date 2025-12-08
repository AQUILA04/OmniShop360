# Sprint 1 Kickoff - OmniShop360

**Date :** 2025-12-08  
**Sprint :** 1 - Gestion des Tenants et Authentification  
**Durée :** 2 semaines (à définir)  
**Scrum Master :** Manus AI

---

## Objectif du Sprint

> Permettre à un Super Admin de créer un nouveau Tenant (entreprise cliente) et de configurer son administrateur principal. L'administrateur du Tenant doit pouvoir se connecter à l'application.

---

## Livrables

À la fin de ce sprint, les fonctionnalités suivantes doivent être **complètes, testées et prêtes à être déployées** :

### Fonctionnalités Clés

1.  **Création de Tenant** : Un formulaire dans l'interface admin permettant au Super Admin de créer un nouveau Tenant et son administrateur.
2.  **Liste des Tenants** : Une page affichant tous les Tenants existants avec pagination et recherche.
3.  **Authentification** : Une page de login sécurisée via Keycloak pour tous les utilisateurs.
4.  **Déconnexion** : La possibilité pour un utilisateur de se déconnecter.
5.  **Email d'Invitation** : L'administrateur du nouveau Tenant reçoit un email pour définir son mot de passe.

### Artefacts Techniques

- **Branche de travail :** `feature/sprint-1-setup`
- **Backlog détaillé :** `docs/sprints/sprint-1-backlog.md`
- **Contrat API :** `contracts/tenant-controller.v1.md`
- **Guides de développement :**
  - `docs/guides/backend-dev-guide.md`
  - `docs/guides/frontend-dev-guide.md`
- **Changelog mis à jour :** `CHANGELOG.md`

---

## Instructions pour les Développeurs

### 1. Cloner le Projet et Changer de Branche

```bash
# Cloner le projet (si ce n'est pas déjà fait)
git clone https://github.com/AQUILA04/OmniShop360.git
cd OmniShop360

# Récupérer les dernières modifications et basculer sur la branche du sprint
git checkout develop
git pull origin develop
git checkout feature/sprint-1-setup
```

### 2. Démarrer l'Environnement de Développement

```bash
# Démarrer tous les services (PostgreSQL, Redis, Keycloak, MailDev)
cd deploy/dev
docker-compose up -d
```

**Services disponibles :**
- **PostgreSQL** : `localhost:5432`
- **Redis** : `localhost:6379`
- **Keycloak** : `http://localhost:8081` (admin/admin)
- **MailDev** : `http://localhost:1080` (pour voir les emails envoyés)

### 3. Lancer les Applications

#### Backend

```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

#### Frontend

```bash
cd frontend
pnpm install
pnpm start
```

### 4. Consulter les Guides et le Backlog

- **Backlog Sprint 1** : `docs/sprints/sprint-1-backlog.md`
  - Contient toutes les user stories et tâches détaillées.

- **Contrat API** : `contracts/tenant-controller.v1.md`
  - La source de vérité pour la communication frontend/backend.

- **Guides de Développement** :
  - `docs/guides/backend-dev-guide.md`
  - `docs/guides/frontend-dev-guide.md`

### 5. Workflow de Développement

1.  **Créer une branche de feature** à partir de `feature/sprint-1-setup` :
    ```bash
    git checkout -b feature/US-001-create-tenant-form
    ```

2.  **Développer** la fonctionnalité en suivant les guides et le contrat API.

3.  **Tester** localement :
    - Backend : `./mvnw verify`
    - Frontend : `pnpm test`

4.  **Créer une Pull Request** vers `feature/sprint-1-setup`.

5.  **Demander une revue** de code.

6.  **Merger** une fois la PR approuvée et les builds CI passés.

---

## Rôles et Responsabilités

### Développeur Backend

- **Focus :** Implémenter les endpoints définis dans `tenant-controller.v1.md`.
- **Tâches principales :**
  - Créer les entités, services, repositories.
  - Intégrer Keycloak Admin Client.
  - Configurer et utiliser Spring Mail.
  - Écrire les tests unitaires et d'intégration (avec Testcontainers).
- **Guide :** `docs/guides/backend-dev-guide.md`

### Développeur Frontend

- **Focus :** Implémenter les interfaces utilisateur pour la gestion des tenants et l'authentification.
- **Tâches principales :**
  - Configurer `angular-oauth2-oidc`.
  - Créer les composants de formulaire et de liste.
  - Utiliser les composants réutilisables de `shared/`.
  - Implémenter les services pour appeler l'API.
  - Écrire les tests unitaires des composants et services.
- **Guide :** `docs/guides/frontend-dev-guide.md`

### Scrum Master

- **Focus :** Faciliter le sprint, lever les blocages, et s'assurer que l'équipe respecte les objectifs.
- **Tâches :**
  - Animer les cérémonies (daily, review, retro).
  - Mettre à jour le backlog.
  - Suivre l'avancement.

---

## Définition de "Fini" (Definition of Done)

- Le code est mergé sur la branche `develop` (via `feature/sprint-1-setup`).
- Tous les tests passent dans le pipeline CI.
- La couverture de code est maintenue ou augmentée.
- La fonctionnalité est documentée.
- Le changelog est mis à jour.
- La démo de la fonctionnalité a été validée par le Product Owner.

---

**Bon sprint à tous !** 🚀
