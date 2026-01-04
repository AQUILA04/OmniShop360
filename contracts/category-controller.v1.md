# Contrat API - Category Controller

**Version:** 1.0.0  
**Date de création:** 2025-12-09  
**Dernière modification:** 2025-12-09  
**Responsable Backend:** À définir  
**Responsable Frontend:** À définir  

---

## Changelog

| Version | Date | Auteur | Modifications |
|:---|:---|:---|:---|
| 1.0.0 | 2025-12-09 | AI Developer | Création initiale du contrat. Endpoints: POST /categories (créer), GET /categories (lister), GET /categories/{categoryId} (détails). Support des catégories hiérarchiques avec parentId. Validation du code unique par tenant. Accès en lecture pour shop_admin, création/modification réservée à tenant_admin. |

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

**Description:** Permet au Tenant Admin de créer une nouvelle catégorie de produits.

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
  "code": "string",
  "description": "string",
  "parentId": "uuid"
}
```

**Validation:**
- `name`: Requis, 2-255 caractères
- `code`: Requis, 1-50 caractères, unique au sein du tenant
- `description`: Optionnel, max 1000 caractères
- `parentId`: Optionnel, UUID valide d'une catégorie parente

#### Response

**Success (201 Created):**
```json
{
  "id": "uuid",
  "name": "string",
  "code": "string",
  "description": "string",
  "parentId": "uuid",
  "parentName": "string",
  "active": true,
  "createdAt": "2025-12-09T10:30:00Z",
  "updatedAt": "2025-12-09T10:30:00Z"
}
```

**Error (400 Bad Request):**
```json
{
  "timestamp": "2025-12-09T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Category with code already exists: {code}",
  "path": "/api/v1/categories"
}
```

**Error (403 Forbidden):**
```json
{
  "timestamp": "2025-12-09T10:30:00Z",
  "status": 403,
  "error": "Forbidden",
  "message": "Insufficient permissions. Required role: tenant_admin",
  "path": "/api/v1/categories"
}
```

---

### 2. Lister toutes les Catégories

**Endpoint:** `GET /categories`

**Rôle requis:** `tenant_admin` ou `shop_admin`

**Description:** Récupère la liste de toutes les catégories du tenant, triées par nom.

#### Request

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

#### Response

**Success (200 OK):**
```json
[
  {
    "id": "uuid",
    "name": "string",
    "code": "string",
    "description": "string",
    "parentId": "uuid",
    "parentName": "string",
    "active": true,
    "createdAt": "2025-12-09T10:30:00Z",
    "updatedAt": "2025-12-09T10:30:00Z"
  }
]
```

---

### 3. Récupérer une Catégorie par ID

**Endpoint:** `GET /categories/{categoryId}`

**Rôle requis:** `tenant_admin` ou `shop_admin`

**Description:** Récupère les détails d'une catégorie spécifique.

#### Request

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters:**
- `categoryId`: UUID de la catégorie

#### Response

**Success (200 OK):**
```json
{
  "id": "uuid",
  "name": "string",
  "code": "string",
  "description": "string",
  "parentId": "uuid",
  "parentName": "string",
  "active": true,
  "createdAt": "2025-12-09T10:30:00Z",
  "updatedAt": "2025-12-09T10:30:00Z"
}
```

**Error (404 Not Found):**
```json
{
  "timestamp": "2025-12-09T10:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Category not found with id: {categoryId}",
  "path": "/api/v1/categories/{categoryId}"
}
```

---

## Modèles de Données

### CategoryResponse

| Champ | Type | Description | Contraintes |
|:---|:---|:---|:---|
| `id` | UUID | Identifiant unique | Auto-généré |
| `name` | String | Nom de la catégorie | 2-255 caractères |
| `code` | String | Code unique de la catégorie | 1-50 caractères, unique par tenant |
| `description` | String | Description | Max 1000 caractères |
| `parentId` | UUID | ID de la catégorie parente | Optionnel |
| `parentName` | String | Nom de la catégorie parente | Optionnel |
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
- Le code de la catégorie doit être unique au sein d'un même tenant
- Les catégories peuvent avoir une hiérarchie (catégorie parente)
- Les Shop Admins peuvent voir les catégories mais ne peuvent pas les modifier ou les supprimer
- Les catégories sont triées par nom dans la liste

### Frontend
- Utiliser `HttpClient` d'Angular pour les appels API
- Implémenter un intercepteur pour ajouter automatiquement le token JWT
- Gérer les erreurs avec un service centralisé
- Afficher les catégories dans un arbre hiérarchique si nécessaire
- Utiliser les catégories dans un sélecteur lors de la création de produits

---

## Exemples d'utilisation

### Créer une Catégorie (cURL)

```bash
curl -X POST http://localhost:8080/api/v1/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "name": "Électronique",
    "code": "ELEC",
    "description": "Catégorie pour les produits électroniques"
  }'
```

### Créer une Sous-Catégorie (cURL)

```bash
curl -X POST http://localhost:8080/api/v1/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "name": "Smartphones",
    "code": "SMARTPHONE",
    "description": "Smartphones et téléphones",
    "parentId": "uuid-de-la-categorie-parente"
  }'
```

---

**Signature du contrat:**

| Rôle | Nom | Date | Signature |
|:---|:---|:---|:---|
| Backend Lead | ___________ | ___________ | ___________ |
| Frontend Lead | ___________ | ___________ | ___________ |
| Scrum Master | AI Developer | 2025-12-09 | ✅ |

