# Sprint 2 Backlog - Gestion des Boutiques et Catalogue Maître

**Objectif du Sprint :** Permettre à un **Tenant Admin** de configurer ses points de vente (Boutiques) et de commencer à construire son catalogue de produits global, incluant la gestion des prix d'achat et de vente.

---

## User Stories (US)

### Epic: Configuration du Réseau (Boutiques)

| ID | User Story | Rôle | Priorité | Points | Dépendances |
| --- | --- | --- | --- | --- | --- |
| **US-005** | En tant que **Tenant Admin**, je veux créer et configurer des **Boutiques** (nom, adresse, tel) pour refléter mon réseau physique. | Tenant Admin | 🔴 Must | 5 | Sprint 1 |
| **US-006** | En tant que **Tenant Admin**, je veux créer des **Shop Admins** et les affecter exclusivement à une boutique spécifique. | Tenant Admin | 🔴 Must | 5 | US-005, Keycloak |

### Epic: Gestion du Catalogue Maître

| ID | User Story | Rôle | Priorité | Points | Dépendances |
| --- | --- | --- | --- | --- | --- |
| **US-007** | En tant que **Tenant Admin**, je veux créer des produits dans le **Catalogue Maître** avec catégories et variantes (taille/couleur). | Tenant Admin | 🔴 Must | 8 | Sprint 1 |
| **US-008** | En tant que **Tenant Admin**, je veux définir le **Prix d'Achat (Coût)** et le **Prix de Vente** par défaut pour chaque produit. | Tenant Admin | 🔴 Must | 3 | US-007 |
| **US-009** | En tant que **Tenant Admin**, je veux configurer la **Politique de Prix** (Imposé Global vs Forçable Local) pour mon tenant. | Tenant Admin | 🟡 Should | 5 | US-008 |

---

## Tâches Techniques (Sprint 2)

### 🔧 Backend (Spring Boot)

#### **Gestion des Boutiques & Users**

1. **[Task-BE-07]** Créer l'entité `Shop` liée au `Tenant`.
2. **[Task-BE-08]** Créer les endpoints `POST /api/v1/shops` et `GET /api/v1/shops`.
3. **[Task-BE-09]** Implémenter la logique d'assignation utilisateur-boutique dans la base de données locale (lien User ID <-> Shop ID).

#### **Catalogue Produits**

4. **[Task-BE-10]** Créer l'entité `Product` avec champs : nom, SKU, prix_achat, prix_vente_maitre.
5. **[Task-BE-11]** Sécuriser les champs de coûts : Seuls les utilisateurs avec le rôle `ROLE_TENANT_ADMIN` peuvent voir/modifier le prix d'achat.
6. **[Task-BE-12]** Implémenter le filtrage RLS sur les boutiques pour les futurs Shop Admins.

### 🎨 Frontend (Angular)

#### **Interface Management (Tenant View)**

1. **[Task-FE-17]** Créer le module `ShopManagement` (Liste et Formulaire de création).
2. **[Task-FE-18]** Créer le module `CatalogManagement` pour la gestion des produits.
3. **[Task-FE-19]** Implémenter le formulaire produit avec distinction visuelle des sections "Prix de vente" et "Informations de coût" (accessibles sous conditions de rôles).
4. **[Task-FE-20]** Ajouter un sélecteur dans les réglages du Tenant pour la politique de prix (Toggle Button).

---

## Définition de "Fini" (Definition of Done)

* [ ] Le code est poussé sur la branche `develop`.
* [ ] Les tests unitaires couvrent la gestion des coûts (sensibilité des données).
* [ ] Un Tenant Admin peut créer une boutique et y assigner un gérant.
* [ ] Un produit créé au niveau Master est visible (en lecture seule) par le futur rôle de boutique.

---