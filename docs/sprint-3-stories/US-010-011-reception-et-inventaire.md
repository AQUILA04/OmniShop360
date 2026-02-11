# User Story Details : US-010 & US-011 - Réception et État des Stocks

## Description
Il s'agit de l'entrée initiale de marchandises. Contrairement au catalogue (théorique), ici on manipule des quantités physiques liées à une boutique précise.

## Rôles habilités
- **Stock Manager (Gestionnaire de Stock)** : Peut enregistrer les réceptions et consulter l'inventaire de sa boutique
- **Shop Admin** : Peut enregistrer les réceptions et consulter l'inventaire de sa boutique
- **Tenant Admin** : Peut enregistrer les réceptions et consulter l'inventaire de toutes les boutiques du tenant

La création d'un Gestionnaire de Stock s'effectue via `POST /api/v1/shops/{shopId}/stock-managers` (tenant_admin ou shop_admin).

## Spécifications Techniques (Backend)
- **Service `StockService` :** Doit exposer une méthode `addStock(productId, shopId, quantity)`.
- **Validation :** Vérifier que le `productId` existe dans le catalogue du Tenant auquel appartient la boutique.
- **Audit :** Chaque mouvement doit créer une ligne dans `stock_entry` avec le `entry_type = 'IN'`.

## Détails UI/UX (Frontend)
- **Composant Réception :** - Un champ de recherche de produit (Autocomplete).
    - Un champ numérique pour la quantité.
    - Un bouton "Valider la réception".
- **Composant Inventaire :**
    - Une table simple : `Produit | SKU | Quantité actuelle`.
    - **Alerte :** Si quantité < 5, afficher le texte en rouge (Low Stock Warning).

## Critères d'Acceptation
1. La quantité en stock est augmentée de la valeur saisie.
2. Un utilisateur d'une boutique A ne peut pas voir ou modifier le stock de la boutique B.
3. Le stock ne peut pas être négatif (bloquer les sorties si stock insuffisant).