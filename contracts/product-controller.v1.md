# Contrat API - Product Controller

**Version:** 1.0.0  
**Date de création:** 2025-12-09  
**Dernière modification:** 2025-12-09  
**Responsable Backend:** À définir  
**Responsable Frontend:** À définir  

---

## Changelog

| Version | Date | Auteur | Modifications |
|:---|:---|:---|:---|
| 1.0.0 | 2025-12-09 | AI Developer | Création initiale du contrat |

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

**Description:** Permet au Tenant Admin de créer un produit dans le catalogue maître.

#### Request

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

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
  "variants": [
    {
      "sku": "string",
      "name": "string",
      "barcode": "string",
      "costPrice": 0.0,
      "sellingPrice": 0.0
    }
  ]
}
```

**Validation:**
- `name`: Requis, 2-255 caractères
- `sku`: Requis, 1-100 caractères, unique au sein du tenant
- `description`: Optionnel, max 1000 caractères
- `categoryId`: Optionnel, UUID valide
- `barcode`: Optionnel, max 100 caractères
- `unit`: Optionnel, max 50 caractères (défaut: "UNIT")
- `costPrice`: Optionnel, >= 0 (défaut: 0.0)
- `sellingPrice`: Requis, > 0
- `taxRate`: Optionnel, >= 0 (défaut: 0.0)
- `variants`: Optionnel, tableau de variantes

#### Response

**Success (201 Created):**
```json
{
  "id": "uuid",
  "name": "string",
  "sku": "string",
  "description": "string",
  "categoryId": "uuid",
  "categoryName": "string",
  "barcode": "string",
  "unit": "UNIT",
  "costPrice": 0.0,
  "sellingPrice": 0.0,
  "taxRate": 0.0,
  "active": true,
  "createdAt": "2025-12-09T10:30:00Z",
  "updatedAt": "2025-12-09T10:30:00Z",
  "variants": [
    {
      "id": "uuid",
      "sku": "string",
      "name": "string",
      "barcode": "string",
      "costPrice": 0.0,
      "sellingPrice": 0.0,
      "active": true,
      "createdAt": "2025-12-09T10:30:00Z",
      "updatedAt": "2025-12-09T10:30:00Z"
    }
  ]
}
```

**Note:** Le champ `costPrice` est visible uniquement pour les utilisateurs avec le rôle `tenant_admin`. Pour les autres rôles, ce champ sera `null`.

**Error (400 Bad Request):**
```json
{
  "timestamp": "2025-12-09T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Product with SKU already exists: {sku}",
  "path": "/api/v1/products"
}
```

**Error (403 Forbidden):**
```json
{
  "timestamp": "2025-12-09T10:30:00Z",
  "status": 403,
  "error": "Forbidden",
  "message": "Insufficient permissions. Required role: tenant_admin",
  "path": "/api/v1/products"
}
```

---

### 2. Lister tous les Produits

**Endpoint:** `GET /products`

**Rôle requis:** `tenant_admin` ou `shop_admin`

**Description:** Récupère la liste paginée des produits du catalogue maître.

#### Request

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `page` (optional): Numéro de page (défaut: 0)
- `size` (optional): Taille de page (défaut: 20, max: 100)
- `sort` (optional): Champ de tri (défaut: createdAt,desc)
- `search` (optional): Recherche par nom ou SKU

**Exemple:**
```
GET /products?page=0&size=20&sort=name,asc&search=chaussure
```

#### Response

**Success (200 OK):**
```json
{
  "content": [
    {
      "id": "uuid",
      "name": "string",
      "sku": "string",
      "description": "string",
      "categoryId": "uuid",
      "categoryName": "string",
      "barcode": "string",
      "unit": "UNIT",
      "costPrice": null,
      "sellingPrice": 0.0,
      "taxRate": 0.0,
      "active": true,
      "createdAt": "2025-12-09T10:30:00Z",
      "updatedAt": "2025-12-09T10:30:00Z",
      "variants": []
    }
  ],
  "page": {
    "size": 20,
    "number": 0,
    "totalElements": 150,
    "totalPages": 8
  }
}
```

**Note:** Pour les utilisateurs avec le rôle `shop_admin`, le champ `costPrice` sera `null`.

---

### 3. Récupérer un Produit par ID

**Endpoint:** `GET /products/{productId}`

**Rôle requis:** `tenant_admin` ou `shop_admin`

**Description:** Récupère les détails d'un produit spécifique.

#### Request

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters:**
- `productId`: UUID du produit

#### Response

**Success (200 OK):**
```json
{
  "id": "uuid",
  "name": "string",
  "sku": "string",
  "description": "string",
  "categoryId": "uuid",
  "categoryName": "string",
  "barcode": "string",
  "unit": "UNIT",
  "costPrice": 0.0,
  "sellingPrice": 0.0,
  "taxRate": 0.0,
  "active": true,
  "createdAt": "2025-12-09T10:30:00Z",
  "updatedAt": "2025-12-09T10:30:00Z",
  "variants": [
    {
      "id": "uuid",
      "sku": "string",
      "name": "string",
      "barcode": "string",
      "costPrice": 0.0,
      "sellingPrice": 0.0,
      "active": true,
      "createdAt": "2025-12-09T10:30:00Z",
      "updatedAt": "2025-12-09T10:30:00Z"
    }
  ]
}
```

**Error (404 Not Found):**
```json
{
  "timestamp": "2025-12-09T10:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Product not found with id: {productId}",
  "path": "/api/v1/products/{productId}"
}
```

---

## Modèles de Données

### ProductResponse

| Champ | Type | Description | Contraintes |
|:---|:---|:---|:---|
| `id` | UUID | Identifiant unique | Auto-généré |
| `name` | String | Nom du produit | 2-255 caractères |
| `sku` | String | Code SKU unique | 1-100 caractères, unique par tenant |
| `description` | String | Description | Max 1000 caractères |
| `categoryId` | UUID | ID de la catégorie | Optionnel |
| `categoryName` | String | Nom de la catégorie | Optionnel |
| `barcode` | String | Code-barres | Max 100 caractères |
| `unit` | String | Unité de mesure | Défaut: "UNIT" |
| `costPrice` | Decimal | Prix d'achat | Visible uniquement pour tenant_admin |
| `sellingPrice` | Decimal | Prix de vente | Requis, > 0 |
| `taxRate` | Decimal | Taux de TVA (%) | Défaut: 0.0 |
| `active` | Boolean | Statut actif | Défaut: true |
| `createdAt` | DateTime | Date de création | ISO 8601 |
| `updatedAt` | DateTime | Date de modification | ISO 8601 |
| `variants` | Array | Liste des variantes | Optionnel |

### ProductVariantResponse

| Champ | Type | Description | Contraintes |
|:---|:---|:---|:---|
| `id` | UUID | Identifiant unique | Auto-généré |
| `sku` | String | Code SKU unique | 1-100 caractères, unique par tenant |
| `name` | String | Nom de la variante | 2-255 caractères |
| `barcode` | String | Code-barres | Max 100 caractères |
| `costPrice` | Decimal | Prix d'achat | Visible uniquement pour tenant_admin |
| `sellingPrice` | Decimal | Prix de vente | Requis, > 0 |
| `active` | Boolean | Statut actif | Défaut: true |
| `createdAt` | DateTime | Date de création | ISO 8601 |
| `updatedAt` | DateTime | Date de modification | ISO 8601 |

---

## Codes d'erreur

| Code | Description |
|:---|:---|
| 200 | OK - Requête réussie |
| 201 | Created - Ressource créée avec succès |
| 400 | Bad Request - Données invalides |
| 401 | Unauthorized - Token manquant ou invalide |
| 403 | Forbidden - Permissions insuffisantes |
| 404 | Not Found - Ressource non trouvée |
| 500 | Internal Server Error - Erreur serveur |

---

## Notes d'implémentation

### Backend
- Le champ `costPrice` doit être masqué pour les utilisateurs sans le rôle `tenant_admin`
- Les Shop Admins peuvent voir les produits mais ne peuvent pas les modifier ou les supprimer
- Les variantes de produits sont optionnelles et peuvent être créées lors de la création du produit
- Le SKU doit être unique au sein d'un même tenant

### Frontend
- Utiliser `HttpClient` d'Angular pour les appels API
- Masquer le champ `costPrice` dans l'interface pour les utilisateurs sans le rôle `tenant_admin`
- Implémenter un intercepteur pour ajouter automatiquement le token JWT
- Gérer les erreurs avec un service centralisé
- Afficher un calculateur de marge : `(Prix de vente - Prix d'achat) / Prix de vente * 100`

---

## Exemples d'utilisation

### Créer un Produit (cURL)

```bash
curl -X POST http://localhost:8080/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "name": "Chaussures de sport",
    "sku": "CH-SPORT-001",
    "description": "Chaussures de sport confortables",
    "unit": "UNIT",
    "costPrice": 25.50,
    "sellingPrice": 49.99,
    "taxRate": 20.0,
    "variants": [
      {
        "sku": "CH-SPORT-001-SIZE-42",
        "name": "Taille 42",
        "costPrice": 25.50,
        "sellingPrice": 49.99
      }
    ]
  }'
```

---

**Signature du contrat:**

| Rôle | Nom | Date | Signature |
|:---|:---|:---|:---|
| Backend Lead | ___________ | ___________ | ___________ |
| Frontend Lead | ___________ | ___________ | ___________ |
| Scrum Master | AI Developer | 2025-12-09 | ✅ |

