# OmniShop360 - Plateforme SaaS de Commerce Unifié

**OmniShop360** est une plateforme SaaS B2B de gestion de commerce unifiée, conçue pour les réseaux de boutiques et franchises. Elle offre une architecture multi-tenant stricte garantissant une **gouvernance centralisée** et une **autonomie opérationnelle** locale.

## Vue d'ensemble de l'Architecture

Le projet est structuré en plusieurs applications conteneurisées, orchestrées par Docker Compose pour un environnement de développement simple et reproductible.

- **`backend/`**: API RESTful développée avec **Spring Boot 3** et Java 21. Elle gère toute la logique métier, la persistance des données et la sécurité.
- **`frontend/`**: Application d'administration (pour Tenant et Shop Admins) développée avec **Angular 17**.
- **`pos/`**: Application de Point de Vente (POS) optimisée pour la performance, également développée avec **Angular 17**.
- **`keycloak/`**: Personnalisation de l'image Docker de **Keycloak** pour inclure un thème custom `omnishop360`.
- **`keycloak-config/`**: Infrastructure as Code (IaC) avec **Terraform** pour configurer automatiquement le realm, les clients, les rôles et les utilisateurs dans Keycloak.
- **`deploy/dev/`**: Contient les fichiers d'orchestration (**Docker Compose**), les scripts de build et les configurations pour l'environnement de développement local.

## Démarrage Rapide (Environnement de Développement)

Suivez ces étapes pour lancer l'ensemble de la plateforme sur votre machine locale.

### Prérequis

- **Docker** et **Docker Compose**
- **Terraform** (pour la configuration de Keycloak)
- **Java 21** et **Maven 3.8+** (pour le développement backend)
- **Node.js 22** et **pnpm 10+** (pour le développement frontend/POS)

### 1. Configuration Initiale

Copiez les fichiers d'exemple pour créer vos configurations locales :

```bash
# Copier le fichier d'environnement pour Docker Compose
cp deploy/dev/.env.example deploy/dev/.env

# Copier les variables Terraform pour Keycloak
cp keycloak-config/terraform.tfvars.example keycloak-config/terraform.tfvars
```

Modifiez `deploy/dev/.env` et `keycloak-config/terraform.tfvars` si nécessaire (les valeurs par défaut sont prévues pour un environnement local standard).

### 2. Construire les Images Docker

Un script est fourni pour construire toutes les images Docker des applications.

**Sur Linux/macOS :**
```bash
cd deploy/dev
./build-images.sh
```

**Sur Windows :**
```bash
cd deploy\dev
.\build-images.bat
```

### 3. Lancer les Services

Utilisez Docker Compose pour démarrer tous les services (PostgreSQL, Redis, Keycloak, Backend, Frontend, POS).

```bash
cd deploy/dev
docker-compose up -d
```

Attendez quelques minutes que tous les services démarrent. Vous pouvez suivre les logs avec `docker-compose logs -f`.

### 4. Configurer Keycloak avec Terraform

Une fois que Keycloak est démarré, appliquez la configuration IaC.

```bash
cd keycloak-config

# Initialiser Terraform
terraform init

# Appliquer la configuration
terraform apply -auto-approve
```

Cette étape va créer le realm `omnishop360`, les clients pour le frontend et le backend, les rôles, ainsi que l'utilisateur `superadmin`.

### 5. Accéder aux Applications

Votre environnement est maintenant prêt ! Vous pouvez accéder aux différentes parties de l'application :

- **Frontend (Admin)**: [http://localhost:4200](http://localhost:4200)
- **POS (Caisse)**: [http://localhost:4201](http://localhost:4201)
- **Keycloak (IAM)**: [http://localhost:8080](http://localhost:8080)
    - **Realm**: `omnishop360`
    - **Admin Console**: `admin` / `admin` (ou ce que vous avez défini dans `.env`)
- **Backend API**: [http://localhost:8081/api](http://localhost:8081/api)

## Développement

Pour développer sur un projet spécifique sans utiliser Docker, référez-vous aux fichiers `README.md` de chaque sous-dossier (`backend/`, `frontend/`, `pos/`).

## Structure des Dossiers

```
OmniShop360/
├── backend/          # Backend Spring Boot
├── frontend/         # Frontend Angular (Admin)
├── pos/              # Frontend Angular (Point of Sale)
├── keycloak/         # Dockerfile et thème pour Keycloak
├── keycloak-config/  # Configuration IaC de Keycloak (Terraform)
├── deploy/
│   └── dev/          # Environnement de développement (Docker Compose, scripts)
├── docs/             # Documentation du projet (PRD, architecture, etc.)
└── README.md         # Ce fichier
```
