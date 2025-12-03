# OmniShop360 - Backend (Spring Boot)

Ce projet contient le backend de l'application OmniShop360, développé avec Spring Boot. Il expose une API RESTful sécurisée pour gérer toutes les opérations de la plateforme.

## Architecture

Le backend est conçu selon une architecture hexagonale (Ports & Adapters) pour une meilleure séparation des préoccupations et une testabilité accrue.

- **`domain`**: Contient le cœur de métier de l'application (entités, services de domaine, repositories).
- **`api`**: Contient les contrôleurs REST et la gestion des exceptions (le port d'entrée).
- **`infrastructure`**: Contient les implémentations concrètes des interfaces du domaine (persistence, intégration Keycloak, etc.).
- **`config`**: Contient la configuration de l'application (sécurité, cache, etc.).

## Fonctionnalités Clés

- **API RESTful** : Exposition des ressources via des endpoints REST.
- **Sécurité** : Intégration avec Keycloak via OAuth2/JWT pour l'authentification et l'autorisation.
- **Multi-Tenant** : Isolation des données par `tenant_id` au niveau de la persistence.
- **Base de Données** : Utilisation de PostgreSQL avec gestion des migrations via Flyway.
- **Cache** : Utilisation de Redis pour la mise en cache des données fréquemment consultées.
- **Cloud-Native** : Prêt pour le déploiement conteneurisé avec des health checks et des métriques.

## Prérequis

- Java 21
- Maven 3.8+
- Docker (pour l'environnement de développement)

## Démarrage Rapide

1.  **Lancer l'environnement Docker** :

    ```bash
    cd ../deploy/dev
    docker-compose up -d postgres redis keycloak
    ```

2.  **Configurer Keycloak** :

    Utilisez Terraform dans le dossier `keycloak-config` pour appliquer la configuration du realm.

3.  **Lancer l'application** :

    Depuis la racine du dossier `backend`, exécutez :

    ```bash
    ./mvnw spring-boot:run
    ```

L'API sera accessible à l'adresse `http://localhost:8081/api`.

## Endpoints Principaux

- **Actuator** : `http://localhost:8081/api/actuator`
- **Health Check** : `http://localhost:8081/api/actuator/health`
- **Swagger/OpenAPI (à ajouter)** : `http://localhost:8081/api/swagger-ui.html`

## Migrations de Base de Données

Les migrations sont gérées par Flyway et se trouvent dans `src/main/resources/db/migration`.

Pour créer une nouvelle migration, ajoutez un fichier SQL au format `V<VERSION>__<DESCRIPTION>.sql` (par exemple, `V2__add_users_table.sql`). Flyway appliquera automatiquement les nouvelles migrations au démarrage de l'application.
