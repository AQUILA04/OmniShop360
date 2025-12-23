# User Story Details : US-008 & US-009 - Prix et Gouvernance

## Description
Cette story traite de la partie la plus sensible : la valeur financière des produits. Le système doit gérer deux types de prix et une règle de gouvernance qui impacte le comportement du futur module POS.

## Spécifications de Sécurité (Spring Boot)
- **Champ `purchase_price` (Prix d'achat) :** - Doit être protégé par une annotation de sécurité ou un DTO spécifique.
    - **Interdiction :** Si le JWT de l'utilisateur ne contient pas le rôle `ROLE_TENANT_ADMIN`, ce champ doit être `null` ou masqué dans la réponse JSON.
- **Champ `sale_price` (Prix de vente) :** Visible par tous.

## Logique de Gouvernance (US-009)
- Ajouter une table `tenant_settings` ou un champ dans `Tenant` : `price_policy` (Enum: `GLOBAL_ENFORCED`, `LOCAL_ALLOWED`).
- **Logique métier :** - Si `GLOBAL_ENFORCED` : Le prix de vente en boutique est strictement égal au `sale_price` du catalogue maître.
    - Si `LOCAL_ALLOWED` : Le système permettra (au Sprint 3) de créer une surcharge de prix par boutique.

## Détails UI/UX (Frontend)
- **Champ Prix d'Achat :** Utiliser un composant de saisie avec une icône "Cadenas" pour indiquer la sensibilité.
- **Calculateur de Marge :** Affichage dynamique sur la fiche produit : `(Prix de vente - Prix d'achat) / Prix de vente * 100` pour aider le Tenant Admin à fixer ses prix.

## Critères d'Acceptation
1. Seul le Tenant Admin peut saisir et voir le prix d'achat.
2. Le changement de politique de prix est persisté en base de données.
3. Les calculs de marge sont corrects (gestion des arrondis à 2 décimales).