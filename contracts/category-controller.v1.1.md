# Contrat API - Category Controller

**Version:** 1.1.0  
**Date de création:** 2025-12-09  
**Dernière modification:** 2026-02-21  
**Responsable Backend:** À définir  
**Responsable Frontend:** À définir  

---

## Changelog

| Version | Date | Auteur | Modifications |
|:---|:---|:---|:---|
| 1.0.0 | 2025-12-09 | AI Developer | Création initiale du contrat. Endpoints: POST, GET list, GET by id. |
| 1.1.0 | 2026-02-21 | AI Developer | Ajout de l'endpoint PUT /categories/{categoryId} pour la modification d'une catégorie. |

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

### 1. Créer une nouvelle Catégorie

**Endpoint:** `POST /categories`  
**Rôle requis:** `tenant_admin`  
(Unchanged from v1.0.0)

### 2. Lister toutes les Catégories

**Endpoint:** `GET /categories`  
**Rôle requis:** `tenant_admin` ou `shop_admin`  
(Unchanged from v1.0.0)

### 3. Récupérer une Catégorie par ID

**Endpoint:** `GET /categories/{categoryId}`  
**Rôle requis:** `tenant_admin` ou `shop_admin`  
(Unchanged from v1.0.0)

### 4. Modifier une Catégorie (NEW in v1.1.0)

**Endpoint:** `PUT /categories/{categoryId}`

**Rôle requis:** `tenant_admin`

**Description:** Met à jour les informations d'une catégorie existante.

#### Request

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters:**
- `categoryId`: UUID de la catégorie

**Body:**
```json
{
  "name": "string",
  "code": "string",
  "description": "string",
  "parentId": "uuid"
}
```

**Validation:**
- `name`: Requis, 2-255 caractères
- `code`: Requis, 1-50 caractères, unique au sein du tenant (hors la catégorie en cours de modification)
- `description`: Optionnel, max 1000 caractères
- `parentId`: Optionnel, UUID valide d'une catégorie parente du même tenant; `null` pour retirer le parent

#### Response

**Success (200 OK):** Retourne l'objet CategoryResponse mis à jour (voir modèles v1.0.0).

**Error (400 Bad Request):** Category with code already exists: {code}

**Error (403 Forbidden):** Permissions insuffisantes. Rôle requis: tenant_admin

**Error (404 Not Found):** Category not found with id: {categoryId}

---

## Modèles de Données

Identiques à v1.0.0 (CategoryResponse, etc.).

---

**Signature du contrat:**

| Rôle | Nom | Date | Signature |
|:---|:---|:---|:---|
| Backend Lead | ___________ | ___________ | ___________ |
| Frontend Lead | ___________ | ___________ | ___________ |
| Scrum Master | AI Developer | 2026-02-21 | ✅ |
