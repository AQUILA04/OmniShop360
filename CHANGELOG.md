# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
et ce projet adhère à [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.4.0] - 2025-02-21 - Sprint 4 Backend

### Added
- **Analytics & Dashboard (US-015, US-016)** - Backend implementation for tableaux de bord
  - `GET /api/v1/analytics/summary` - Synthèse (CA, transactions, panier moyen, évolution, top produits)
  - Paramètres optionnels: `shopId`, `fromDate`, `toDate`
  - Rôles: `tenant_admin`, `shop_admin`, `cashier`
  - AnalyticsService, DTOs (AnalyticsSummaryResponse, SalesEvolutionEntry, TopProductEntry)
  - Requêtes d'agrégation dans SaleRepository (JPQL et native)
- **Export PDF / Excel (US-017)** - Export des rapports de ventes
  - `GET /api/v1/analytics/export` - Format PDF ou EXCEL
  - Dépendances: Apache POI (Excel), OpenPDF (PDF)
  - ExportService avec isolation tenant/shop
- **Audit Logs (US-019)** - Journaux d'audit avec Hibernate Envers
  - `GET /api/v1/audit-logs` - Liste paginée des modifications (Stock, Sale, Product)
  - Entités auditées: Stock, Sale, Product
  - AuditRevisionEntity avec userId et tenantId, AuditRevisionListener
  - AuditLogService, AuditLogController
  - Rôles: `superadmin`, `tenant_admin`
  - Migration Flyway V5 pour tables revision_info, stock_aud, sales_aud, products_aud
- **Intégration HashiCorp Vault (US-018, V-018)** - Gestion des secrets
  - bootstrap.yml avec configuration Vault (AppRole, KV backend)
  - Activation conditionnelle: `VAULT_ENABLED`, `VAULT_URI`, `VAULT_ROLE_ID`, `VAULT_SECRET_ID`
  - spring-cloud-starter-vault-config et spring-cloud-starter-bootstrap
  - Désactivation par défaut en dev (spring.cloud.vault.enabled: false)
- **API Contracts** - Nouveaux contrats pour le frontend
  - `contracts/analytics-controller.v1.md` - Analytics et export
  - `contracts/audit-log-controller.v1.md` - Journaux d'audit
- **Tests** - Couverture des nouveaux composants
  - AnalyticsServiceTest, ExportServiceTest, AnalyticsControllerIntegrationTest
  - AuditLogServiceTest, AuditLogControllerIntegrationTest

---

## [0.4.0] - 2025-02-21 - Sprint 4 Frontend

### Added
- **Dashboard Analytics (US-015, US-016)** - Tableau de bord avec KPIs et graphiques
  - `DashboardComponent` refondé avec filtres (date range, sélecteur boutique)
  - 3 cartes KPI : Chiffre d'affaires, Transactions, Panier moyen
  - `SalesChartComponent` — graphique linéaire Chart.js (évolution CA quotidien)
  - `TopProductsChartComponent` — graphique barres horizontales (top 5 produits)
  - `KpiCardComponent` — composant réutilisable avec formatage monétaire (XOF)
  - Sélecteur de boutique visible uniquement pour `tenant_admin`
  - Dépendances : `chart.js`, `ng2-charts@6`
- **Export PDF / Excel (US-017)** - Boutons d'export sur le dashboard
  - Téléchargement blob via `AnalyticsService.exportReport()`
  - Formats supportés : PDF et EXCEL
- **Audit Logs (US-019)** - Journal d'audit en lecture seule
  - `AuditLogListComponent` avec `GenericListComponent` (sans actions CRUD)
  - Filtres : date début/fin, type d'entité (Stock/Sale/Product), utilisateur
  - Labels français : Création, Modification, Suppression
  - Route `/tenant/audit-logs` protégée par `superadmin` / `tenant_admin`
- **Services** - Nouveaux services pour le Sprint 4
  - `AnalyticsService` — `getSummary()` et `exportReport()`
  - `AuditLogService` — `getAll()` avec filtres spécifiques et mapping id
- **Modèles** - DTOs TypeScript alignés sur le backend
  - `AnalyticsSummaryResponse`, `SalesEvolutionEntry`, `TopProductEntry`, `ExportFormat`
  - `AuditLogEntry`
- **Navigation** - Lien "📋 Journaux d'audit" ajouté dans la sidebar (groupe Tenant Admin)
- **Tests unitaires**
  - `analytics.service.spec.ts` (5 tests : summary, filtres, export blob)
  - `audit-log.service.spec.ts` (3 tests : pagination, filtres, mapping id)

---

## [0.3.0] - 2025-01-24 - Sprint 3 Backend

### Added
- **Stock Management API** - Backend implementation for stock reception and inventory management
  - `POST /api/v1/stock/movements` - Record stock reception (US-010)
  - `GET /api/v1/stock/inventory` - View inventory with filtering and search (US-011)
  - Stock entity with quantity tracking and low stock detection
  - StockMovement entity for audit trail
  - StockService with addStock, removeStock, and getInventory methods
  - StockSpecification for advanced search using JPA Specifications
- **Sales & POS API** - Backend implementation for sales transactions
  - `POST /api/v1/sales/checkout` - Finalize sale and decrement stock atomically (US-013, US-014)
  - `GET /api/v1/sales` - List sales with filtering and search
  - `GET /api/v1/sales/products` - Search products with stock for sale (tenant_admin, shop_admin, cashier)
  - `GET /api/v1/sales/{saleId}` - Get sale details
  - Sale and SaleItem entities with price snapshot at sale time
  - SaleService with transactional checkout method
  - SaleSpecification for advanced search using JPA Specifications
- **Customer Entity** - Customer entity for sales tracking
- **ProductVariantRepository** - Repository for product variants
- **API Contracts** - Contract documentation for frontend integration
  - `contracts/stock-controller.v1.md` - Stock management API contract
  - `contracts/sale-controller.v1.md` - Sales and POS API contract
  - `contracts/sale-controller.v1.1.md` - Sales - Product search for cashiers
- **Unit and Integration Tests** - 100% test coverage for new code
  - Tests for `StockService`
  - Tests for `SaleService`
  - Tests for `StockResponse` and `SaleResponse` DTOs

### Changed
- **Architecture** - Extended backend with stock and sales management following existing patterns
  - Reused existing Specifications pattern for advanced searches
  - Followed existing DTO and Service patterns
  - Maintained transaction isolation per shop

### Security
- Implemented role-based access control for stock and sales endpoints
  - Stock endpoints: `tenant_admin`, `shop_admin`, or `stock_manager`
  - Sales checkout: `tenant_admin`, `shop_admin`, or `cashier`
  - Sales product search: `tenant_admin`, `shop_admin`, or `cashier`
  - Sales listing: `tenant_admin` or `shop_admin`
- **Cashier Management** - Backend implementation for cashier creation
  - `POST /api/v1/shops/{shopId}/cashiers` - Create cashier for a shop
  - `CreateCashierRequest` DTO for cashier creation
  - `ShopService.createCashier()` method with tenant and shop validation
  - Shop Admin can only create cashiers for their own shop
  - Tenant Admin can create cashiers for any shop in their tenant
  - Updated `shop-controller.v1.md` contract (v1.1.0) with cashier endpoint
  - Unit tests for cashier creation scenarios
- **Stock Manager Management** - Backend implementation for stock manager creation
  - `POST /api/v1/shops/{shopId}/stock-managers` - Create stock manager for a shop
  - `CreateStockManagerRequest` DTO for stock manager creation
  - `ShopService.createStockManager()` method with tenant and shop validation
  - Shop Admin can only create stock managers for their own shop
  - Tenant Admin can create stock managers for any shop in their tenant
  - Stock endpoints (`POST /stock/movements`, `GET /stock/inventory`) accessible to `stock_manager`
  - Contract `shop-controller.v1.2.md` with stock manager endpoint
  - Updated `stock-controller.v1.md` (v1.1.0) with stock_manager role
  - Unit tests for stock manager creation in ShopServiceTest
  - Integration test for POST /shops/{shopId}/stock-managers
- **Customer Management API** - Backend implementation for customer CRUD operations
  - `POST /api/v1/customers` - Create a new customer
  - `PUT /api/v1/customers/{customerId}` - Update customer information
  - `DELETE /api/v1/customers/{customerId}` - Delete customer (soft delete)
  - `GET /api/v1/customers` - List customers with advanced search and filtering
  - `GET /api/v1/customers/{customerId}` - Get customer details
  - `CustomerService` with full CRUD operations
  - `CustomerSpecification` for advanced search using JPA Specifications
  - `CreateCustomerRequest`, `UpdateCustomerRequest`, `CustomerResponse`, `CustomerSearchDto` DTOs
  - Accessible to `tenant_admin`, `shop_admin`, and `cashier` roles
  - Multi-tenant isolation: users can only access customers from their tenant
  - Unit tests for `CustomerService` with 100% coverage
  - API contract `customer-controller.v1.md` for frontend integration
- **User Management API** - Backend implementation for user listing
  - `GET /api/v1/users` - List users with advanced search and filtering
  - `UserService` with getUsers method
  - `UserSpecification` for advanced search using JPA Specifications
  - `UserResponse`, `UserSearchDto` DTOs
  - Accessible to `superadmin` (all users) and `tenant_admin` (users of their tenant)
  - API contract `user-controller.v1.md` for frontend integration
  - Unit tests for `UserResponse`, `UserSpecification`, `UserService`, `UserController`
  - Integration tests for `UserController`

---

## [0.2.0] - 2025-12-10 - Sprint 1 Backend

### Added
- **Tenant Management API** - Backend implementation for tenant creation and management
  - `POST /api/v1/tenants` - Create new tenant with admin user
  - `GET /api/v1/tenants` - List all tenants with pagination and search
  - `GET /api/v1/tenants/{id}` - Get tenant by ID
- **Keycloak Integration** - `KeycloakAdapter` for user management in Keycloak
  - Create users in Keycloak
  - Assign roles to users
  - Send password reset emails via Keycloak
- **Global Exception Handler** - Centralized error handling for REST API
  - Handles validation errors (`MethodArgumentNotValidException`)
  - Handles entity not found (`EntityNotFoundException`)
  - Handles access denied (`AccessDeniedException`)
  - Handles constraint violations (`ConstraintViolationException`)
  - Handles generic exceptions
- **Database Migrations** - Flyway migration for users table (`V2__create_users_table.sql`)
- **Swagger/OpenAPI Documentation** - API documentation with Swagger UI
- **Unit and Integration Tests** - 100% test coverage for new code
  - Tests for `TenantService`
  - Tests for `TenantController`
  - Tests for `KeycloakAdapter`
  - Tests for `GlobalExceptionHandler`
  - Tests for DTOs (`TenantResponse`, `PageResponse`, `AdminUserResponse`)

### Changed
- **Architecture** - Reorganized backend structure following hexagonal architecture
  - Moved configuration classes to `infrastructure.config` package
  - Separated DTOs into `web.dto` package
- **BaseEntity** - Removed `tenantId` field (handled via `@ManyToOne` relationship)

### Fixed
- Fixed `@OneToMany` relationship mapping in `Tenant` entity
- Fixed resource leaks in `KeycloakAdapter` (proper `Response` closure with try-with-resources)
- Fixed `NullPointerException` in `KeycloakAdapter.getCreatedUserId()` with null checks
- Fixed `StringIndexOutOfBoundsException` in `TenantService.generateTenantCode()` for empty filtered names

### Security
- Implemented role-based access control with `@PreAuthorize("hasRole('superadmin')")` on tenant endpoints

---

## [0.2.0] - 2025-12-23 - Sprint 1 Frontend & Architecture

### Added
- **Frontend Tenant Management** - Full CRUD functionality for tenants.
  - List tenants with pagination, sorting, and search.
  - Create new tenants with an admin user.
  - Edit existing tenants.
  - View tenant details.
  - Suspend/Activate and delete tenants.
- **Generic CRUD Architecture (Frontend)** - A reusable, configuration-driven architecture.
  - `BaseCrudService` for standard API calls.
  - `BaseListComponent` and `GenericListComponent` for dynamic, modern tables.
  - `BaseDetailsComponent` for dynamic detail views.
  - `BaseFormComponent` and `GenericFormComponent` for dynamic forms.
  - `README.md` documenting how to use the generic components.
- **Authentication Flow (Frontend)**
  - `AuthService` to manage user session and profile.
  - `authInterceptor` to automatically inject Bearer tokens in API calls.
  - Logout functionality in the main header.
  - `APP_INITIALIZER` to ensure authentication is ready before app start.
- **Global Toast Service** - `ToastService` using `ngx-toastr` for consistent user notifications.
- **Modern UI/UX**
  - Redesigned list view with a modern "SaaS" look and feel.
  - Added a rich "empty state" component.
  - Improved search bar and overall layout.
  - Loaded Material Icons font for proper icon display.

### Changed
- **Angular Configuration**
  - Configured a proxy for local development to bypass CORS issues with Keycloak.
  - Increased the initial bundle size budget to avoid warnings.
  - Switched from `MatSnackBar` to `ngx-toastr` for notifications.
- **Keycloak Terraform**
  - Updated `web_origins` and `valid_redirect_uris` to be more robust for local development.

### Fixed
- **Authentication** - Resolved multiple issues preventing login and token injection.
  - Corrected `redirectUri` and `scope` in the OIDC configuration.
  - Handled CORS errors by configuring Keycloak and using a proxy.
  - Fixed `invalid_issuer` error by aligning proxy and OIDC configuration.
- **UI Bugs**
  - Corrected various Angular template syntax errors.
  - Fixed missing Material Icons.

---

## [0.1.0] - 2025-12-08 - Sprint 1 Setup

### Added
- **Sprint 1 Backlog** (`docs/sprints/sprint-1-backlog.md`)
- **Contrats API** (`contracts/tenant-controller.v1.md`)
- **MailDev** pour le test des emails en local
- **Guides de développement** pour backend et frontend
- **Structure de composants réutilisables** pour Angular
- **Changelog** du projet (`CHANGELOG.md`)

### Changed
- **docker-compose.yml** : Ajout du service MailDev
- **application-dev.yml** : Configuration de Spring Mail pour MailDev

---

## [0.0.1] - 2025-12-03 - Initial Setup

### Added
- **Architecture Cloud-Native** (Spring Boot, Angular, PostgreSQL, Redis, Keycloak)
- **Infrastructure as Code** (Docker, Docker Compose, Terraform)
- **CI/CD avec GitHub Actions** (build, test, docker, release)
- **Git Flow** initialisé (`main`, `develop`, `feature/setup`)
- **Documentation complète** du projet et de l'architecture

### Fixed
- **Maven Wrapper** manquant dans le backend
- **Permissions GitHub Actions** pour CodeQL et Docker
- **Format de tag Docker** invalide
- **pnpm-lock.yaml** manquant pour les builds Docker

---

[Unreleased]: https://github.com/AQUILA04/OmniShop360/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/AQUILA04/OmniShop360/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/AQUILA04/OmniShop360/releases/tag/v0.1.0
[0.0.1]: https://github.com/AQUILA04/OmniShop360/releases/tag/v0.0.1
