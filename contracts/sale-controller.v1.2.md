# Contrat API - Sale Controller

**Version:** 1.2.0  
**Date de création:** 2025-01-24  
**Dernière modification:** 2026-04-11  
**Responsable Backend:** À définir  
**Responsable Frontend:** À définir

---

## Changelog

| Version | Date | Auteur | Modifications |
|:---|:---|:---|:---|
| 1.1.0 | 2025-01-24 | AI Developer | Ajout GET `/api/v1/sales/products` |
| 1.2.0 | 2026-04-11 | AI Developer | Filtrage produit POS enrichi (code, nom, catégorie) + client divers par défaut au checkout + politique vente sans stock |

---

## Endpoints impactés

### 1. Recherche produits POS (mise à jour)
- **Endpoint:** `GET /api/v1/sales/products`
- **Query params ajoutés:** `code`, `name`, `categoryId`
- **Query params conservés:** `page`, `size`, `sort`, `search`

### 2. Checkout (comportement)
- **Endpoint:** `POST /api/v1/sales/checkout`
- Si `customerId` est absent: application d'un client par défaut "Client Divers".
- La validation du stock dépend de la configuration boutique `allowSaleWithoutStock`.

---

**Signature:** Backend / Frontend
