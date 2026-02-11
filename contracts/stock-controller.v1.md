# Contrat API - Stock Controller

**Version:** 1.1.0  
**Date de création:** 2025-01-24  
**Dernière modification:** 2025-01-24  
**Responsable Backend:** À définir  
**Responsable Frontend:** À définir  

---

## Changelog

| Version | Date | Auteur | Modifications |
|:---|:---|:---|:---|
| 1.0.0 | 2025-01-24 | AI Developer | Création initiale du contrat pour la gestion des stocks et inventaires |
| 1.1.0 | 2025-01-24 | AI Developer | Ajout du rôle stock_manager pour réception et inventaire |

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

### 1. Enregistrer une réception de marchandises

**Endpoint:** `POST /stock/movements`

**Rôle requis:** `tenant_admin`, `shop_admin` ou `stock_manager`

**Description:** Permet d'enregistrer une réception de marchandises pour augmenter le stock disponible dans une boutique.

#### Request

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Body:**
```json
{
  "productId": "uuid",
  "variantId": "uuid",
  "quantity": 10.0,
  "unitCost": 25.50,
  "notes": "Réception de marchandises"
}
```

**Validation:**
- `productId`: Requis, UUID valide
- `variantId`: Optionnel, UUID valide
- `quantity`: Requis, nombre positif
- `unitCost`: Optionnel, nombre positif
- `notes`: Optionnel, texte libre

#### Response

**Success (201 Created):**
```json
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
  "lowStock": false
}
```

**Error (400 Bad Request):**
```json
{
  "timestamp": "2025-01-24T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": [
    {
      "field": "quantity",
      "message": "Quantity must be positive"
    }
  ],
  "path": "/api/v1/stock/movements"
}
```

**Error (403 Forbidden):**
```json
{
  "timestamp": "2025-01-24T10:30:00Z",
  "status": 403,
  "error": "Forbidden",
  "message": "Insufficient permissions. Required role: tenant_admin, shop_admin or stock_manager",
  "path": "/api/v1/stock/movements"
}
```

**Error (404 Not Found):**
```json
{
  "timestamp": "2025-01-24T10:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Product not found with id: {productId}",
  "path": "/api/v1/stock/movements"
}
```

---

### 2. Consulter l'inventaire

**Endpoint:** `GET /stock/inventory`

**Rôle requis:** `tenant_admin`, `shop_admin` ou `stock_manager`

**Description:** Récupère la liste paginée des stocks de la boutique avec possibilité de filtrage et recherche.

#### Request

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `page` (optional): Numéro de page (défaut: 0)
- `size` (optional): Taille de page (défaut: 20, max: 100)
- `sort` (optional): Champ de tri (défaut: product.name,asc)
- `productId` (optional): Filtrer par ID de produit
- `variantId` (optional): Filtrer par ID de variante
- `keyword` (optional): Recherche par nom ou SKU de produit/variante
- `lowStock` (optional): Filtrer les stocks bas (boolean)

**Exemple:**
```
GET /stock/inventory?page=0&size=20&sort=product.name,asc&keyword=chaussure&lowStock=true
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
      "lowStock": false
    }
  ],
  "page": {
    "size": 20,
    "number": 0,
    "totalElements": 45,
    "totalPages": 3
  }
}
```

**Error (403 Forbidden):**
```json
{
  "timestamp": "2025-01-24T10:30:00Z",
  "status": 403,
  "error": "Forbidden",
  "message": "Insufficient permissions. Required role: tenant_admin, shop_admin or stock_manager",
  "path": "/api/v1/stock/inventory"
}
```

---

## Modèles de Données

### StockResponse

| Champ | Type | Description | Contraintes |
|:---|:---|:---|:---|
| `id` | UUID | Identifiant unique | Auto-généré |
| `productId` | UUID | ID du produit | Requis |
| `productName` | String | Nom du produit | Requis |
| `productSku` | String | SKU du produit | Requis |
| `variantId` | UUID | ID de la variante | Optionnel |
| `variantName` | String | Nom de la variante | Optionnel |
| `variantSku` | String | SKU de la variante | Optionnel |
| `quantity` | Decimal | Quantité totale | Requis, >= 0 |
| `availableQuantity` | Decimal | Quantité disponible | Calculé |
| `minStockLevel` | Decimal | Niveau de stock minimum | Optionnel |
| `maxStockLevel` | Decimal | Niveau de stock maximum | Optionnel |
| `lowStock` | Boolean | Indicateur de stock bas | Calculé |

### StockMovementRequest

| Champ | Type | Description | Contraintes |
|:---|:---|:---|:---|
| `productId` | UUID | ID du produit | Requis |
| `variantId` | UUID | ID de la variante | Optionnel |
| `quantity` | Decimal | Quantité à ajouter | Requis, > 0 |
| `unitCost` | Decimal | Coût unitaire | Optionnel, >= 0 |
| `notes` | String | Notes | Optionnel |

---

## Codes d'erreur

| Code | Description |
|:---|:---|
| 200 | OK - Requête réussie |
| 201 | Created - Réception enregistrée avec succès |
| 400 | Bad Request - Données invalides |
| 401 | Unauthorized - Token manquant ou invalide |
| 403 | Forbidden - Permissions insuffisantes |
| 404 | Not Found - Ressource non trouvée |
| 500 | Internal Server Error - Erreur serveur |

---

## Notes d'implémentation

### Backend
- L'utilisateur doit être associé à une boutique pour gérer le stock (tenant_admin, shop_admin ou stock_manager)
- Chaque réception crée automatiquement un mouvement de stock de type `RECEIPT`
- Le stock est isolé par boutique : un utilisateur ne peut voir/modifier que le stock de sa boutique
- Le champ `lowStock` est calculé automatiquement en comparant `availableQuantity` avec `minStockLevel`

### Frontend
- Utiliser `HttpClient` d'Angular pour les appels API
- Implémenter un intercepteur pour ajouter automatiquement le token JWT
- Afficher un indicateur visuel (couleur orange/rouge) pour les stocks bas
- Gérer les erreurs avec un service centralisé
- Afficher des notifications utilisateur pour les succès/erreurs

---

## Exemples d'utilisation

### Enregistrer une réception (cURL)

```bash
curl -X POST http://localhost:8080/api/v1/stock/movements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "productId": "123e4567-e89b-12d3-a456-426614174000",
    "quantity": 50.0,
    "unitCost": 25.50,
    "notes": "Réception de marchandises"
  }'
```

### Consulter l'inventaire (cURL)

```bash
curl -X GET "http://localhost:8080/api/v1/stock/inventory?page=0&size=20&lowStock=true" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

**Signature du contrat:**

| Rôle | Nom | Date | Signature |
|:---|:---|:---|:---|
| Backend Lead | ___________ | ___________ | ___________ |
| Frontend Lead | ___________ | ___________ | ___________ |
| Scrum Master | AI Developer | 2025-01-24 | ✅ |
