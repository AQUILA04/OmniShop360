# Contrat API - Shop Controller

**Version:** 1.3.0  
**Date de création:** 2025-12-09  
**Dernière modification:** 2026-02-21  
**Responsable Backend:** À définir  
**Responsable Frontend:** À définir  

---

## Changelog

| Version | Date | Auteur | Modifications |
|:---|:---|:---|:---|
| 1.0.0 | 2025-12-09 | AI Developer | Création initiale du contrat |
| 1.1.0 | 2025-01-24 | AI Developer | Ajout de l'endpoint POST /shops/{shopId}/cashiers |
| 1.2.0 | 2025-01-24 | AI Developer | Ajout de l'endpoint POST /shops/{shopId}/stock-managers |
| 1.3.0 | 2026-02-21 | AI Developer | Ajout de l'endpoint PUT /shops/{shopId} pour la modification d'une boutique. |

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

### 1. Créer une nouvelle Boutique

**Endpoint:** `POST /shops`  
**Rôle requis:** `tenant_admin`  
(Unchanged from v1.0.0)

### 2. Lister toutes les Boutiques

**Endpoint:** `GET /shops`  
**Rôle requis:** `tenant_admin` ou `shop_admin`  
(Unchanged from v1.0.0)

### 3. Récupérer une Boutique par ID

**Endpoint:** `GET /shops/{shopId}`  
**Rôle requis:** `tenant_admin` ou `shop_admin`  
(Unchanged from v1.0.0)

### 4. Modifier une Boutique (NEW in v1.3.0)

**Endpoint:** `PUT /shops/{shopId}`

**Rôle requis:** `tenant_admin`

**Description:** Met à jour les informations d'une boutique.

#### Request

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters:**
- `shopId`: UUID de la boutique

**Body:**
```json
{
  "name": "string",
  "address": "string",
  "city": "string",
  "postalCode": "string",
  "country": "string",
  "phone": "string",
  "email": "string"
}
```

**Validation:**
- `name`: Requis, 2-255 caractères
- `address`: Requis, 5-500 caractères
- `city`: Optionnel, max 100 caractères
- `postalCode`: Optionnel, max 20 caractères
- `country`: Optionnel, max 100 caractères
- `phone`: Optionnel, max 50 caractères
- `email`: Optionnel, format email valide, max 255 caractères

#### Response

**Success (200 OK):** Retourne l'objet ShopResponse mis à jour (id, name, code, email, phone, address, city, postalCode, country, active, createdAt, updatedAt, userCount).

**Error (400 Bad Request):** Données invalides

**Error (403 Forbidden):** Permissions insuffisantes. Rôle requis: tenant_admin

**Error (404 Not Found):** Shop not found with id: {shopId}

---

### 5. Créer un Shop Admin

**Endpoint:** `POST /shops/{shopId}/admins`  
**Rôle requis:** `tenant_admin`  
(Unchanged from v1.0.0)

### 6. Créer un Caissier

**Endpoint:** `POST /shops/{shopId}/cashiers`  
**Rôle requis:** `tenant_admin` ou `shop_admin`  
(Unchanged from v1.1.0)

### 7. Créer un Gestionnaire de Stock

**Endpoint:** `POST /shops/{shopId}/stock-managers`  
**Rôle requis:** `tenant_admin` ou `shop_admin`  
(Unchanged from v1.2.0)

---

## Modèles de Données

Identiques à v1.0.0 / v1.2.0 (ShopResponse, AdminUserResponse, etc.).

---

**Signature du contrat:**

| Rôle | Nom | Date | Signature |
|:---|:---|:---|:---|
| Backend Lead | ___________ | ___________ | ___________ |
| Frontend Lead | ___________ | ___________ | ___________ |
| Scrum Master | AI Developer | 2026-02-21 | ✅ |
