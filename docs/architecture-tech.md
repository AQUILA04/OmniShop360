# Architecture Technique : OmniShop 360 (Spring Boot & Angular)

## 1. Structure Frontend (Angular)
* **Modules :** `Admin-Tenant`, `Admin-Shop`, `POS`, `Core & Auth`.
* **Stratégie de Chargement :** `POS` doit être léger et chargé énergiquement (`Eager Loading`) pour la performance. Les autres modules seront chargés paresseusement (`Lazy Loading`).
* **Routage :** Utilisation de **Angular Guards** pour appliquer les permissions de niveau supérieur (ex: bloquer l'accès à la route `/tenant/*` pour un `Shop Admin`).

## 2. Gestion de l'Identité et de la Sécurité (Keycloak)
* **IAM :** Utilisation de **Keycloak** pour l'authentification OAuth 2.0 / OpenID Connect.
* **Token :** Le token JWT (JSON Web Token) émis par Keycloak doit inclure les `roles` de l'utilisateur et son `tenant_id` (via un Custom Mapper).
* **Contexte de la Requête :** Chaque requête API émise par Angular doit inclure le JWT (Bearer Token).
* **Sécurité des Données :** Le `Tenant ID` et le `Shop ID` seront extraits du token sur le backend Spring Boot pour appliquer la **Row-Level Security (RLS)**.
* **Rôle Superadmin :**
    * Un rôle `superadmin` est défini pour l'administration globale de l'application.
    * Ce rôle a les permissions de créer des `tenants` et des `Tenant Admins`.
    * Un utilisateur `superadmin` est créé automatiquement au déploiement de l'application via un script de démarrage (par exemple, dans le backend Spring Boot).
    * Lors de la création, un email est envoyé au `superadmin` (configuré via les variables d'environnement) avec un lien pour initialiser son mot de passe dans Keycloak.

## 3. Contrats API Backend (Spring Boot)
* **Sécurité RLS :** Le backend Spring Boot (via Spring Security et JPA/ORM) doit systématiquement filtrer toutes les requêtes en base de données par l'ID du Tenant et l'ID de la Boutique de l'utilisateur connecté.
* **Endpoint Critique - Marge (D.3) :** L'endpoint de récupération des coûts et de la marge (`/api/v1/tenant/reports/performance`) doit être strictement protégé par un rôle `Tenant Admin` ou `Comptable Tenant`.
* **Performance BI (D.1) :** Les requêtes d'agrégation de données pour le BI devront utiliser des vues matérialisées ou des services de Data Aggregation pour garantir un temps de réponse rapide.
* **Transaction POS (C.1/C.2) :** L'API de Checkout doit être transactionnelle (ACID) pour garantir la cohérence des ventes et des stocks.

## 4. Recommandations de Base de Données
* **Mise en œuvre du Multi-Tenant :** Schéma partagé, avec colonnes `tenant_id` et `shop_id` sur toutes les tables.
* **Garantie de Sécurité :** L'application de la RLS est indispensable pour l'isolation des données critiques.
