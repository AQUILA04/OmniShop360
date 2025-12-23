# User Story Details : US-007 - Gestion du Catalogue Maître

## Description
En tant que **Tenant Admin**, je veux créer et gérer un catalogue de produits centralisé afin que toutes mes boutiques partagent la même nomenclature, tout en permettant une gestion des stocks individualisée par la suite.

## Spécifications Techniques (Backend)
- **Modèle de données :**
    - `tenant_id` (UUID) : Liaison obligatoire au Tenant.
    - `sku` (String) : Code unique au sein du Tenant.
    - `name`, `description`, `category`.
    - `has_variants` (Boolean) : Flag pour activer la gestion de variantes.
- **Variantes :** Une table liée `product_variants` doit gérer les combinaisons (ex: Taille: L, Couleur: Bleu). Chaque variante possède son propre SKU.
- **Contrainte :** Un `Shop Admin` peut voir les produits mais ne peut JAMAIS les modifier ou en supprimer au niveau Master.

## Détails UI/UX (Frontend)
- **Vue Liste :** Tableau avec recherche par nom ou SKU.
- **Vue Formulaire :**
    - Onglet "Général" : Informations de base.
    - Onglet "Variantes" : Dynamique (Ajout de lignes pour chaque variante).
- **Validation :** Empêcher les doublons de SKU pour un même Tenant.

## Critères d'Acceptation
1. Le produit créé est immédiatement visible par le Tenant Admin.
2. Le produit est rattaché au `tenant_id` de l'utilisateur connecté.
3. Les informations de variantes sont correctement persistées en base.