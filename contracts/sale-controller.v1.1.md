# Contrat API - Sale Controller

**Version:** 1.1.0  
**Date de création:** 2025-01-24  
**Dernière modification:** 2025-01-24  
**Responsable Backend:** À définir  
**Responsable Frontend:** À définir  

---

## Changelog

| Version | Date | Auteur | Modifications |
|:---|:---|:---|:---|
| 1.0.0 | 2025-01-24 | AI Developer | Création initiale du contrat pour la gestion des ventes et transactions |
| 1.1.0 | 2025-01-24 | AI Developer | Ajout de l'endpoint Rechercher les produits pour la vente (GET /sales/products) |

---

## Base URL

```
Development: http://localhost:8080/api/v1
Production: https://api.omnishop360.com/api/v1
```

---

## Authentification

Toutes les requêtes nécessitent un token JWT valide dans le header `Authorization`:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## Endpoints

### 1. Finaliser une vente (Checkout)

**Endpoint:** `POST /sales/checkout`  
**Rôle requis:** `tenant_admin`, `shop_admin` ou `cashier`  
(Unchanged from v1.0.0)

### 2. Lister les ventes

**Endpoint:** `GET /sales`  
**Rôle requis:** `tenant_admin`, `shop_admin` ou `cashier`  
(Unchanged from v1.0.0)

### 3. Récupérer une vente par ID

**Endpoint:** `GET /sales/{saleId}`  
**Rôle requis:** `tenant_admin`, `shop_admin` ou `cashier`  
(Unchanged from v1.0.0)

### 4. Rechercher les produits pour la vente (NEW in v1.1.0)

**Endpoint:** `GET /sales/products`

**Rôle requis:** `tenant_admin`, `shop_admin` ou `cashier`

**Description:** Retourne la liste paginée des produits avec leur stock dans la boutique courante (contexte de l'utilisateur). Permet à l'agent en caisse de rechercher un produit par nom ou SKU et d'obtenir les informations de stock (quantité, prix de vente, alerte stock bas). Utilise le même modèle que l'inventaire (StockResponse) avec le champ `sellingPrice` renseigné.

#### Request

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `page` (optional): Numéro de page (défaut: 0)
- `size` (optional): Taille de page (défaut: 20, max: 100)
- `sort` (optional): Tri (défaut: product.name,asc). Ex: `product.name,desc`, `quantity,asc`
- `search` (optional): Recherche par nom produit ou SKU (insensible à la casse, contient)

**Exemple:**
```
GET /sales/products?page=0&size=20&sort=product.name,asc&search=cafe
```

#### Response

**Success (200 OK):**
```json
{
  "content": [
    {
      "id": "uuid",
      "productId": "uuid",
      "productName": "string",
      "productSku": "string",
      "variantId": "uuid",
      "variantName": "string",
      "variantSku": "string",
      "quantity": 10.0,
      "availableQuantity": 10.0,
      "minStockLevel": 5.0,
      "maxStockLevel": 100.0,
      "lowStock": false,
      "sellingPrice": 29.99
    }
  ],
  "page": {
    "size": 20,
    "number": 0,
    "totalElements": 42,
    "totalPages": 3
  }
}
```

- `sellingPrice`: Prix de vente unitaire (produit ou variante). Peut être `null` si non défini.
- Les autres champs sont identiques au modèle StockResponse (voir stock-controller.v1.md).

**Error (403 Forbidden):** Permissions insuffisantes.

**Error (400 Bad Request):** Utilisateur non associé à une boutique (obligatoire pour tenant_admin/shop_admin/cashier dans ce contexte).

---

## Modèles de données (v1.1.0)

### StockResponse (pour GET /sales/products)

| Champ | Type | Description |
|:---|:---|:---|
| id | UUID | ID du stock |
| productId | UUID | ID du produit |
| productName | string | Nom du produit |
| productSku | string | SKU du produit |
| variantId | UUID \| null | ID de la variante (optionnel) |
| variantName | string \| null | Nom de la variante |
| variantSku | string \| null | SKU de la variante |
| quantity | number | Quantité en stock |
| availableQuantity | number | Quantité disponible |
| minStockLevel | number | Seuil d'alerte |
| maxStockLevel | number \| null | Stock max |
| lowStock | boolean | true si availableQuantity <= minStockLevel |
| sellingPrice | number \| null | Prix de vente unitaire (pour la vente) |

---

**Signature:** Backend / Frontend
