# Contrat API - Product Controller

**Version:** 1.1.0  
**Date de création:** 2025-12-09  
**Dernière modification:** 2026-02-21  
**Responsable Backend:** À définir  
**Responsable Frontend:** À définir  

---

## Changelog

| Version | Date | Auteur | Modifications |
|:---|:---|:---|:---|
| 1.0.0 | 2025-12-09 | AI Developer | Création initiale du contrat |
| 1.1.0 | 2026-02-21 | AI Developer | Ajout de l'endpoint PUT /products/{productId} pour la modification d'un produit. |

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

### 1. Créer un nouveau Produit

**Endpoint:** `POST /products`  
**Rôle requis:** `tenant_admin`  
(Unchanged from v1.0.0)

### 2. Lister tous les Produits

**Endpoint:** `GET /products`  
**Rôle requis:** `tenant_admin` ou `shop_admin`  
(Unchanged from v1.0.0)

### 3. Récupérer un Produit par ID

**Endpoint:** `GET /products/{productId}`  
**Rôle requis:** `tenant_admin` ou `shop_admin`  
(Unchanged from v1.0.0)

### 4. Modifier un Produit (NEW in v1.1.0)

**Endpoint:** `PUT /products/{productId}`

**Rôle requis:** `tenant_admin`

**Description:** Met à jour les informations d'un produit du catalogue (hors variantes).

#### Request

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters:**
- `productId`: UUID du produit

**Body:**
```json
{
  "name": "string",
  "sku": "string",
  "description": "string",
  "categoryId": "uuid",
  "barcode": "string",
  "unit": "UNIT",
  "costPrice": 0.0,
  "sellingPrice": 0.0,
  "taxRate": 0.0,
  "active": true
}
```

**Validation:**
- `name`: Requis, 2-255 caractères
- `sku`: Requis, 1-100 caractères, unique au sein du tenant (hors le produit en cours)
- `description`: Optionnel, max 1000 caractères
- `categoryId`: Optionnel, UUID valide; `null` pour retirer la catégorie
- `barcode`: Optionnel, max 100 caractères
- `unit`: Optionnel, défaut "UNIT"
- `costPrice`: Optionnel, >= 0
- `sellingPrice`: Requis, > 0
- `taxRate`: Optionnel, >= 0
- `active`: Optionnel, boolean

#### Response

**Success (200 OK):** Retourne l'objet ProductResponse mis à jour (voir modèles v1.0.0). costPrice visible uniquement pour tenant_admin.

**Error (400 Bad Request):** Product with SKU already exists: {sku}

**Error (403 Forbidden):** Permissions insuffisantes. Rôle requis: tenant_admin

**Error (404 Not Found):** Product not found with id: {productId}

---

## Modèles de Données

Identiques à v1.0.0 (ProductResponse, ProductVariantResponse, etc.).

---

**Signature du contrat:**

| Rôle | Nom | Date | Signature |
|:---|:---|:---|:---|
| Backend Lead | ___________ | ___________ | ___________ |
| Frontend Lead | ___________ | ___________ | ___________ |
| Scrum Master | AI Developer | 2026-02-21 | ✅ |
