# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
et ce projet adhère à [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
