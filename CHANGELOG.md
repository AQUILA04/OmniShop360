# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
et ce projet adhère à [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

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

[Unreleased]: https://github.com/AQUILA04/OmniShop360/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/AQUILA04/OmniShop360/releases/tag/v0.1.0
[0.0.1]: https://github.com/AQUILA04/OmniShop360/releases/tag/v0.0.1
