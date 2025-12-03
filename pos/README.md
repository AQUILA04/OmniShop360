# OmniShop360 - Point of Sale (POS) (Angular)

Ce projet contient l'interface du Point de Vente (POS) de l'application OmniShop360, développée avec Angular. Elle est optimisée pour la performance et une utilisation rapide par les caissiers.

## Architecture

L'application est conçue pour être légère et rapide, avec un focus sur la performance de l'expérience utilisateur en caisse.

- **`core`**: Services essentiels pour la communication avec le backend et la gestion de l'état du POS.
- **`features/cash-register`**: Le module principal contenant la logique de la caisse (panier, paiement, recherche de produits).
- **`shared`**: Composants et services partagés spécifiques au POS.

## Fonctionnalités Clés

- **Performance Optimale** : Conçue pour un chargement et une exécution rapides (`Eager Loading`).
- **Interface Epurée** : Design simple et efficace pour une prise en main rapide par les caissiers.
- **Recherche Rapide** : Optimisée pour la recherche par scan de code-barres.
- **Mode Hors-Ligne (à implémenter)** : Capacité à fonctionner avec une connectivité limitée.
- **Authentification Sécurisée** : Intégration avec Keycloak.

## Prérequis

- Node.js 22+
- pnpm 10+
- Docker (pour l'environnement de développement)

## Démarrage Rapide

1.  **Installer les dépendances** :

    ```bash
    pnpm install
    ```

2.  **Lancer le serveur de développement** :

    ```bash
    pnpm start
    ```

L'application sera accessible à l'adresse `http://localhost:4201`.

## Build pour la Production

```bash
pnpm run build
```

Les fichiers de build seront générés dans le dossier `dist/pos/browser`.
