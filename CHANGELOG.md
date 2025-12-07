# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
et ce projet adhère à [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- ...

### Changed
- ...

### Deprecated
- ...

### Removed
- ...

### Fixed
- ...

### Security
- ...

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
