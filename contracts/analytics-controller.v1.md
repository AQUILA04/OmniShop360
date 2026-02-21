# Contrat API - Analytics Controller

**Version:** 1.0.0  
**Date de création:** 2025-02-21  
**Dernière modification:** 2025-02-21  
**Responsable Backend:** À définir  
**Responsable Frontend:** À définir  

---

## Changelog

| Version | Date | Auteur | Modifications |
|:---|:---|:---|:---|
| 1.0.0 | 2025-02-21 | AI Developer | Création initiale (US-015, US-016, US-017) |

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

### 1. Synthèse analytics (dashboard)

**Endpoint:** `GET /analytics/summary`

**Rôle requis:** `tenant_admin`, `shop_admin` ou `cashier`

**Description:** Retourne la synthèse des ventes sur une période : CA total, nombre de transactions, panier moyen, évolution quotidienne et top 5 produits. Shop Admin voit uniquement sa boutique. Tenant Admin peut filtrer par boutique ou voir le cumul tenant.

#### Request

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `shopId` (optional): UUID de la boutique (tenant_admin uniquement ; ignoré pour shop_admin)
- `fromDate` (optional): Date de début (yyyy-MM-dd). Défaut : jour courant
- `toDate` (optional): Date de fin (yyyy-MM-dd). Défaut : jour courant

**Exemple:**
```
GET /analytics/summary?fromDate=2025-02-01&toDate=2025-02-21
GET /analytics/summary?shopId=<UUID>&fromDate=2025-02-01&toDate=2025-02-21
```

#### Response

**Success (200 OK):**
```json
{
  "totalRevenue": 15000.50,
  "transactionCount": 42,
  "averageBasket": 357.15,
  "periodFrom": "2025-02-01",
  "periodTo": "2025-02-21",
  "salesEvolution": [
    {
      "day": "2025-02-01",
      "totalAmount": 1200.00,
      "transactionCount": 5
    }
  ],
  "topProducts": [
    {
      "productId": "uuid",
      "productName": "Produit A",
      "sku": "SKU-A",
      "quantitySold": 100,
      "totalAmount": 5000.00
    }
  ]
}
```

**Error (403 Forbidden):** Permissions insuffisantes.

---

### 2. Export des ventes (PDF / Excel)

**Endpoint:** `GET /analytics/export`

**Rôle requis:** `tenant_admin`, `shop_admin` ou `cashier`

**Description:** Génère un rapport des ventes sur la période au format PDF ou Excel. Même règles d’isolation que le summary (shop optionnel pour tenant_admin).

#### Request

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `format` (required): `PDF` ou `EXCEL`
- `shopId` (optional): UUID de la boutique (tenant_admin uniquement)
- `fromDate` (optional): Date de début (yyyy-MM-dd)
- `toDate` (optional): Date de fin (yyyy-MM-dd)

**Exemple:**
```
GET /analytics/export?format=PDF&fromDate=2025-02-01&toDate=2025-02-21
GET /analytics/export?format=EXCEL&shopId=<UUID>&fromDate=2025-02-01&toDate=2025-02-21
```

#### Response

**Success (200 OK):**
- **Content-Type:** `application/pdf` (PDF) ou `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (Excel)
- **Content-Disposition:** `attachment; filename="rapport-ventes-<date>.pdf"` ou `.xlsx`
- Body : binaire (fichier PDF ou Excel)

**Error (400 Bad Request):** Format absent ou invalide.

**Error (403 Forbidden):** Permissions insuffisantes.

---

## Modèles de données

### AnalyticsSummaryResponse

| Champ | Type | Description |
|:---|:---|:---|
| `totalRevenue` | Number | CA total sur la période |
| `transactionCount` | Long | Nombre de ventes |
| `averageBasket` | Number | Panier moyen |
| `periodFrom` | Date (yyyy-MM-dd) | Début de période |
| `periodTo` | Date (yyyy-MM-dd) | Fin de période |
| `salesEvolution` | Array | Évolution par jour |
| `topProducts` | Array | Top 5 produits (quantité vendue) |

### SalesEvolutionEntry

| Champ | Type | Description |
|:---|:---|:---|
| `day` | Date | Jour |
| `totalAmount` | Number | Montant du jour |
| `transactionCount` | Long | Nombre de ventes du jour |

### TopProductEntry

| Champ | Type | Description |
|:---|:---|:---|
| `productId` | UUID | ID produit |
| `productName` | String | Nom produit |
| `sku` | String | SKU |
| `quantitySold` | Number | Quantité vendue |
| `totalAmount` | Number | Montant total |

---

## Codes d'erreur

| Code | Description |
|:---|:---|
| 200 | OK |
| 400 | Bad Request (paramètres invalides) |
| 401 | Unauthorized (token manquant ou invalide) |
| 403 | Forbidden (rôle insuffisant) |
| 500 | Internal Server Error |

---

## Notes d'implémentation

### Backend
- Isolation tenant obligatoire ; shop optionnel pour tenant_admin, imposé pour shop_admin.
- Export limité à 10 000 lignes par requête.

### Frontend
- Utiliser les paramètres `fromDate` / `toDate` pour les filtres dashboard et export.
- Pour l’export, déclencher le téléchargement via le blob retourné et le nom de fichier dans Content-Disposition.

---

**Signature du contrat:**

| Rôle | Nom | Date | Signature |
|:---|:---|:---|:---|
| Backend Lead | ___________ | ___________ | ___________ |
| Frontend Lead | ___________ | ___________ | ___________ |
| Scrum Master | AI Developer | 2025-02-21 | ✅ |
