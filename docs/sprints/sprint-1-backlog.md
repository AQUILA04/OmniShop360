# Sprint 1 Backlog - Gestion des Tenants et Authentification

**Objectif du Sprint :** Permettre à un Super Admin de créer un nouveau Tenant (entreprise cliente) et de configurer son administrateur principal. L'administrateur du Tenant doit pouvoir se connecter à l'application.

---

## User Stories

### Epic: Gestion des Tenants

| ID | User Story | Rôle | Priorité | Story Points | Dépendances |
|:---|:---|:---|:---|:---:|:---|
| **US-001** | En tant que Super Admin, je veux pouvoir créer un nouveau Tenant en fournissant les informations de base (nom de l'entreprise, email de contact, etc.) pour onboarder un nouveau client. | Super Admin | 🔴 Must Have | 8 | US-003 |
| **US-002** | En tant que Super Admin, je veux pouvoir voir la liste de tous les Tenants existants pour avoir une vue d'ensemble de mes clients. | Super Admin | 🟡 Should Have | 3 | US-001 |
| **US-003** | En tant que Super Admin, lors de la création d'un Tenant, je veux pouvoir créer l'utilisateur Administrateur de ce Tenant (Tenant Admin) en fournissant son nom et son email. | Super Admin | 🔴 Must Have | 5 | US-001 |

### Epic: Authentification

| ID | User Story | Rôle | Priorité | Story Points | Dépendances |
|:---|:---|:---|:---|:---:|:---|
| **US-004** | En tant que Tenant Admin, je veux recevoir un email avec un lien pour définir mon mot de passe initial afin de pouvoir me connecter pour la première fois. | Tenant Admin | 🔴 Must Have | 5 | US-003 |
| **US-005** | En tant qu'utilisateur (Super Admin, Tenant Admin), je veux pouvoir me connecter à l'application via une page de login sécurisée pour accéder à mes fonctionnalités. | Tous | 🔴 Must Have | 8 | - |
| **US-006** | En tant qu'utilisateur connecté, je veux pouvoir me déconnecter de l'application pour sécuriser mon compte. | Tous | 🔴 Must Have | 3 | US-005 |

---

## Tâches Techniques Détaillées

### Backend (Développeur Backend)

#### **US-001 & US-003 : Création Tenant et Tenant Admin**

1.  **[Task-BE-01]** Créer l'entité JPA `Tenant` avec les champs : `id`, `name`, `contactEmail`, `status`.
2.  **[Task-BE-02]** Créer l'entité JPA `User` avec les champs : `id`, `tenantId`, `firstName`, `lastName`, `email`, `keycloakId`.
3.  **[Task-BE-03]** Créer le `TenantRepository` et le `UserRepository`.
4.  **[Task-BE-04]** Créer le `TenantService` avec une méthode `createTenant(CreateTenantRequest request)`.
5.  **[Task-BE-05]** Implémenter la logique de création du Tenant dans la base de données.
6.  **[Task-BE-06]** Intégrer un client Keycloak Admin pour créer l'utilisateur Tenant Admin dans Keycloak.
7.  **[Task-BE-07]** Assigner le rôle `tenant_admin` à l'utilisateur créé dans Keycloak.
8.  **[Task-BE-08]** Sauvegarder l'ID Keycloak dans l'entité `User` locale.
9.  **[Task-BE-09]** Créer le `TenantController` avec un endpoint `POST /api/v1/tenants` sécurisé pour le rôle `superadmin`.
10. **[Task-BE-10]** Ajouter les tests unitaires pour `TenantService` (mock Keycloak client).
11. **[Task-BE-11]** Ajouter les tests d'intégration avec Testcontainers (PostgreSQL + Keycloak) pour le `TenantController`.

#### **US-002 : Lister les Tenants**

1.  **[Task-BE-12]** Ajouter une méthode `getAllTenants()` dans `TenantService` et `TenantController` (`GET /api/v1/tenants`).
2.  **[Task-BE-13]** Implémenter la pagination pour la liste des tenants.
3.  **[Task-BE-14]** Ajouter les tests unitaires et d'intégration.

#### **US-004 : Email d'invitation**

1.  **[Task-BE-15]** Configurer Spring Mail avec les paramètres de MailDev.
2.  **[Task-BE-16]** Créer un `EmailService` pour envoyer des emails via des templates (Thymeleaf ou FreeMarker).
3.  **[Task-BE-17]** Dans `TenantService`, après la création du Tenant Admin, déclencher l'action "ExecuteActionsEmail" de Keycloak pour envoyer l'email de configuration du mot de passe.
4.  **[Task-BE-18]** Créer un template d'email personnalisé pour l'invitation.

### Frontend (Développeur Frontend)

#### **US-005 & US-006 : Login / Logout**

1.  **[Task-FE-01]** Configurer `angular-oauth2-oidc` pour se connecter à Keycloak.
2.  **[Task-FE-02]** Créer un `AuthService` pour gérer la logique de connexion, déconnexion, et récupération du profil utilisateur.
3.  **[Task-FE-03]** Créer un `AuthGuard` pour protéger les routes nécessitant une authentification.
4.  **[Task-FE-04]** Créer une page de login qui redirige vers Keycloak.
5.  **[Task-FE-05]** Créer un composant `Header` avec un bouton "Login" / "Logout" et le nom de l'utilisateur connecté.
6.  **[Task-FE-06]** Créer un composant `ProfileMenu` affichant les informations de l'utilisateur et le bouton de déconnexion.

#### **US-001 & US-003 : Création Tenant et Tenant Admin**

1.  **[Task-FE-07]** Créer un module `TenantManagement` en lazy loading, accessible uniquement par le `superadmin`.
2.  **[Task-FE-08]** Créer un composant `TenantCreateForm` avec les champs nécessaires (nom entreprise, nom admin, email admin).
3.  **[Task-FE-09]** Utiliser Angular Material pour le formulaire (Input, Button, Card).
4.  **[Task-FE-10]** Implémenter la validation du formulaire (champs requis, format email).
5.  **[Task-FE-11]** Créer un `TenantService` dans le frontend pour appeler l'API `POST /api/v1/tenants`.
6.  **[Task-FE-12]** Afficher une notification de succès ou d'erreur après la soumission du formulaire.

#### **US-002 : Lister les Tenants**

1.  **[Task-FE-13]** Créer un composant `TenantListComponent` pour afficher la liste des tenants.
2.  **[Task-FE-14]** Utiliser la table Angular Material (`mat-table`) pour afficher les données.
3.  **[Task-FE-15]** Implémenter la pagination et le tri dans la table.
4.  **[Task-FE-16]** Ajouter une barre de recherche pour filtrer les tenants par nom.

---

## Définition de "Fini" (Definition of Done)

- Le code est mergé sur la branche `develop`.
- Tous les tests (unitaires et intégration) passent dans le pipeline CI.
- La couverture de code est maintenue ou augmentée.
- Les nouvelles fonctionnalités sont documentées dans le `README.md` si nécessaire.
- Le changelog du sprint est mis à jour.
- La démo de la fonctionnalité a été validée par le Product Owner.
