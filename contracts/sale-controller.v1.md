# Contrat API - Sale Controller

**Version:** 1.0.0  
**Date de création:** 2025-01-24  
**Dernière modification:** 2025-01-24  
**Responsable Backend:** À définir  
**Responsable Frontend:** À définir  

---

## Changelog

| Version | Date | Auteur | Modifications |
|:---|:---|:---|:---|
| 1.0.0 | 2025-01-24 | AI Developer | Création initiale du contrat pour la gestion des ventes et transactions |

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

**Description:** Valide un panier, crée la vente, décrémente le stock et génère un ticket de caisse. Opération transactionnelle atomique.

#### Request

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Body:**
```json
{
  "customerId": "uuid",
  "items": [
    {
      "productId": "uuid",
      "variantId": "uuid",
      "quantity": 2.0
    }
  ],
  "paymentMethod": "CASH",
  "discountAmount": 5.0,
  "notes": "Vente en magasin"
}
```

**Validation:**
- `items`: Requis, tableau non vide
- `items[].productId`: Requis, UUID valide
- `items[].variantId`: Optionnel, UUID valide
- `items[].quantity`: Requis, nombre positif
- `paymentMethod`: Requis, enum (CASH, CARD, MOBILE, MIXED)
- `customerId`: Optionnel, UUID valide
- `discountAmount`: Optionnel, nombre >= 0
- `notes`: Optionnel, texte libre

#### Response

**Success (201 Created):**
```json
{
  "id": "uuid",
  "saleNumber": "SALE-20250124-123456",
  "saleDate": "2025-01-24T10:30:00Z",
  "shopId": "uuid",
  "shopName": "string",
  "customerId": "uuid",
  "customerName": "string",
  "subtotal": 100.0,
  "taxAmount": 20.0,
  "discountAmount": 5.0,
  "totalAmount": 115.0,
  "paymentMethod": "CASH",
  "paymentStatus": "PAID",
  "status": "COMPLETED",
  "notes": "Vente en magasin",
  "createdAt": "2025-01-24T10:30:00Z",
  "items": [
    {
      "id": "uuid",
      "productId": "uuid",
      "productName": "string",
      "productSku": "string",
      "variantId": "uuid",
      "variantName": "string",
      "variantSku": "string",
      "quantity": 2.0,
      "unitPrice": 50.0,
      "taxRate": 20.0,
      "discountAmount": 0.0,
      "subtotal": 100.0,
      "taxAmount": 20.0,
      "totalAmount": 120.0
    }
  ]
}
```

**Error (400 Bad Request):**
```json
{
  "timestamp": "2025-01-24T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Insufficient stock. Available: 5.0, Requested: 10.0",
  "path": "/api/v1/sales/checkout"
}
```

**Error (403 Forbidden):**
```json
{
  "timestamp": "2025-01-24T10:30:00Z",
  "status": 403,
  "error": "Forbidden",
  "message": "Insufficient permissions. Required role: tenant_admin, shop_admin or cashier",
  "path": "/api/v1/sales/checkout"
}
```

**Error (404 Not Found):**
```json
{
  "timestamp": "2025-01-24T10:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Product not found with id: {productId}",
  "path": "/api/v1/sales/checkout"
}
```

---

### 2. Lister les ventes

**Endpoint:** `GET /sales`

**Rôle requis:** `tenant_admin` ou `shop_admin`

**Description:** Récupère la liste paginée des ventes de la boutique avec possibilité de filtrage et recherche.

#### Request

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `page` (optional): Numéro de page (défaut: 0)
- `size` (optional): Taille de page (défaut: 20, max: 100)
- `sort` (optional): Champ de tri (défaut: saleDate,desc)
- `customerId` (optional): Filtrer par ID de client
- `keyword` (optional): Recherche par numéro de vente, nom client, email, téléphone
- `paymentMethod` (optional): Filtrer par méthode de paiement (CASH, CARD, MOBILE, MIXED)
- `paymentStatus` (optional): Filtrer par statut de paiement (PAID, PENDING, CANCELLED)
- `status` (optional): Filtrer par statut de vente (COMPLETED, CANCELLED, RETURNED)
- `fromDate` (optional): Date de début (format: yyyy-MM-dd)
- `toDate` (optional): Date de fin (format: yyyy-MM-dd)

**Exemple:**
```
GET /sales?page=0&size=20&sort=saleDate,desc&fromDate=2025-01-01&toDate=2025-01-31&paymentMethod=CASH
```

#### Response

**Success (200 OK):**
```json
{
  "content": [
    {
      "id": "uuid",
      "saleNumber": "SALE-20250124-123456",
      "saleDate": "2025-01-24T10:30:00Z",
      "shopId": "uuid",
      "shopName": "string",
      "customerId": "uuid",
      "customerName": "string",
      "subtotal": 100.0,
      "taxAmount": 20.0,
      "discountAmount": 5.0,
      "totalAmount": 115.0,
      "paymentMethod": "CASH",
      "paymentStatus": "PAID",
      "status": "COMPLETED",
      "notes": "Vente en magasin",
      "createdAt": "2025-01-24T10:30:00Z",
      "items": []
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

---

### 3. Récupérer une vente par ID

**Endpoint:** `GET /sales/{saleId}`

**Rôle requis:** `tenant_admin` ou `shop_admin`

**Description:** Récupère les détails complets d'une vente spécifique.

#### Request

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters:**
- `saleId`: UUID de la vente

#### Response

**Success (200 OK):**
```json
{
  "id": "uuid",
  "saleNumber": "SALE-20250124-123456",
  "saleDate": "2025-01-24T10:30:00Z",
  "shopId": "uuid",
  "shopName": "string",
  "customerId": "uuid",
  "customerName": "string",
  "subtotal": 100.0,
  "taxAmount": 20.0,
  "discountAmount": 5.0,
  "totalAmount": 115.0,
  "paymentMethod": "CASH",
  "paymentStatus": "PAID",
  "status": "COMPLETED",
  "notes": "Vente en magasin",
  "createdAt": "2025-01-24T10:30:00Z",
  "items": [
    {
      "id": "uuid",
      "productId": "uuid",
      "productName": "string",
      "productSku": "string",
      "variantId": "uuid",
      "variantName": "string",
      "variantSku": "string",
      "quantity": 2.0,
      "unitPrice": 50.0,
      "taxRate": 20.0,
      "discountAmount": 0.0,
      "subtotal": 100.0,
      "taxAmount": 20.0,
      "totalAmount": 120.0
    }
  ]
}
```

**Error (404 Not Found):**
```json
{
  "timestamp": "2025-01-24T10:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Sale not found with id: {saleId}",
  "path": "/api/v1/sales/{saleId}"
}
```

---

## Modèles de Données

### SaleResponse

| Champ | Type | Description | Contraintes |
|:---|:---|:---|:---|
| `id` | UUID | Identifiant unique | Auto-généré |
| `saleNumber` | String | Numéro de vente unique | Auto-généré |
| `saleDate` | DateTime | Date et heure de la vente | ISO 8601 |
| `shopId` | UUID | ID de la boutique | Requis |
| `shopName` | String | Nom de la boutique | Requis |
| `customerId` | UUID | ID du client | Optionnel |
| `customerName` | String | Nom du client | Optionnel |
| `subtotal` | Decimal | Sous-total HT | Requis, >= 0 |
| `taxAmount` | Decimal | Montant de la TVA | Requis, >= 0 |
| `discountAmount` | Decimal | Montant de la remise | Optionnel, >= 0 |
| `totalAmount` | Decimal | Montant total TTC | Requis, >= 0 |
| `paymentMethod` | Enum | Méthode de paiement | CASH, CARD, MOBILE, MIXED |
| `paymentStatus` | Enum | Statut de paiement | PAID, PENDING, CANCELLED |
| `status` | Enum | Statut de la vente | COMPLETED, CANCELLED, RETURNED |
| `notes` | String | Notes | Optionnel |
| `createdAt` | DateTime | Date de création | ISO 8601 |
| `items` | Array | Liste des articles | Requis |

### SaleItemResponse

| Champ | Type | Description | Contraintes |
|:---|:---|:---|:---|
| `id` | UUID | Identifiant unique | Auto-généré |
| `productId` | UUID | ID du produit | Requis |
| `productName` | String | Nom du produit | Requis |
| `productSku` | String | SKU du produit | Requis |
| `variantId` | UUID | ID de la variante | Optionnel |
| `variantName` | String | Nom de la variante | Optionnel |
| `variantSku` | String | SKU de la variante | Optionnel |
| `quantity` | Decimal | Quantité vendue | Requis, > 0 |
| `unitPrice` | Decimal | Prix unitaire au moment de la vente | Requis, > 0 |
| `taxRate` | Decimal | Taux de TVA (%) | Requis, >= 0 |
| `discountAmount` | Decimal | Montant de la remise | Optionnel, >= 0 |
| `subtotal` | Decimal | Sous-total HT | Requis, >= 0 |
| `taxAmount` | Decimal | Montant de la TVA | Requis, >= 0 |
| `totalAmount` | Decimal | Montant total TTC | Requis, >= 0 |

### CheckoutRequest

| Champ | Type | Description | Contraintes |
|:---|:---|:---|:---|
| `customerId` | UUID | ID du client | Optionnel |
| `items` | Array | Liste des articles | Requis, non vide |
| `items[].productId` | UUID | ID du produit | Requis |
| `items[].variantId` | UUID | ID de la variante | Optionnel |
| `items[].quantity` | Decimal | Quantité | Requis, > 0 |
| `paymentMethod` | Enum | Méthode de paiement | Requis |
| `discountAmount` | Decimal | Montant de la remise | Optionnel, >= 0 |
| `notes` | String | Notes | Optionnel |

---

## Codes d'erreur

| Code | Description |
|:---|:---|
| 200 | OK - Requête réussie |
| 201 | Created - Vente créée avec succès |
| 400 | Bad Request - Données invalides ou stock insuffisant |
| 401 | Unauthorized - Token manquant ou invalide |
| 403 | Forbidden - Permissions insuffisantes |
| 404 | Not Found - Ressource non trouvée |
| 500 | Internal Server Error - Erreur serveur |

---

## Notes d'implémentation

### Backend
- L'opération de checkout est **transactionnelle** : si la décrémentation du stock échoue, la vente est annulée (rollback)
- Le prix de vente est stocké dans `SaleItem` au moment de la vente (pas de référence au catalogue)
- Le stock est décrémenté automatiquement pour chaque article vendu
- Un mouvement de stock de type `SALE` est créé pour chaque article
- Le numéro de vente est généré automatiquement au format `SALE-YYYYMMDD-XXXXXX`
- L'utilisateur doit être associé à une boutique pour traiter les ventes

### Frontend
- Utiliser `HttpClient` d'Angular pour les appels API
- Implémenter un intercepteur pour ajouter automatiquement le token JWT
- Gérer les erreurs avec un service centralisé
- Afficher des notifications utilisateur pour les succès/erreurs
- Valider le panier avant l'envoi au backend
- Afficher un ticket de caisse virtuel après validation

---

## Exemples d'utilisation

### Finaliser une vente (cURL)

```bash
curl -X POST http://localhost:8080/api/v1/sales/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "items": [
      {
        "productId": "123e4567-e89b-12d3-a456-426614174000",
        "quantity": 2.0
      }
    ],
    "paymentMethod": "CASH",
    "discountAmount": 5.0,
    "notes": "Vente en magasin"
  }'
```

### Lister les ventes (cURL)

```bash
curl -X GET "http://localhost:8080/api/v1/sales?page=0&size=20&fromDate=2025-01-01&toDate=2025-01-31" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

**Signature du contrat:**

| Rôle | Nom | Date | Signature |
|:---|:---|:---|:---|
| Backend Lead | ___________ | ___________ | ___________ |
| Frontend Lead | ___________ | ___________ | ___________ |
| Scrum Master | AI Developer | 2025-01-24 | ✅ |
