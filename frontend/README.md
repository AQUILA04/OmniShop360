# OmniShop360 - Frontend (Angular)

Ce projet contient l'interface d'administration principale de l'application OmniShop360, développée avec Angular. Elle permet aux administrateurs de locataires (Tenant Admins) et de boutiques (Shop Admins) de gérer leurs opérations.

## Architecture

L'application est structurée en modules pour une meilleure organisation et une performance optimisée grâce au lazy loading.

- **`core`**: Contient les services transverses, gardes de route, intercepteurs et la logique d'authentification.
- **`shared`**: Contient les composants, directives et pipes réutilisables à travers l'application.
- **`features`**: Contient les modules fonctionnels principaux, chargés en lazy loading :
    - `admin-tenant`: Administration du locataire (gestion des boutiques, catalogue, etc.).
    - `admin-shop`: Administration de la boutique (gestion du personnel, etc.).
    - `dashboard`: Tableaux de bord et rapports.
- **`models`**: Contient les interfaces et modèles de données de l'application.

## Fonctionnalités Clés

- **Interface Réactive** : Développée avec Angular 17 et le pattern Signal.
- **Lazy Loading** : Les modules fonctionnels sont chargés à la demande pour un démarrage rapide.
- **Authentification** : Intégration avec Keycloak via `angular-oauth2-oidc`.
- **UI Components** : Utilisation d'Angular Material pour une interface utilisateur cohérente.
- **Déploiement Conteneurisé** : Prêt pour le déploiement avec Nginx dans un conteneur Docker.

## Prérequis

- Node.js 22+
- pnpm 10+
- Docker (pour l'environnement de développement)

## Démarrage Rapide

1.  **Installer les dépendances** :

    Depuis la racine du dossier `frontend`, exécutez :

    ```bash
    pnpm install
    ```

2.  **Lancer le serveur de développement** :

    ```bash
    pnpm start
    ```

L'application sera accessible à l'adresse `http://localhost:4200`.

## Build pour la Production

Pour construire l'application pour la production, exécutez :

```bash
pnpm run build
```

Les fichiers de build seront générés dans le dossier `dist/frontend/browser`.

## Environnements

Les fichiers de configuration d'environnement se trouvent dans `src/environments` :

- `environment.ts` : Pour le développement local.
- `environment.prod.ts` : Pour la production (les variables seront remplacées lors du déploiement).
