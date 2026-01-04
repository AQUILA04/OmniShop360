# Contrat API - Shop Controller

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

### 1. Créer une nouvelle Boutique

**Endpoint:** `POST /shops`

**Rôle requis:** `tenant_admin`

**Description:** Permet au Tenant Admin de créer une nouvelle boutique.

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

**Success (201 Created):**
```json
{
  "id": "uuid",
  "name": "string",
  "code": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "city": "string",
  "postalCode": "string",
  "country": "string",
  "active": true,
  "createdAt": "2025-12-09T10:30:00Z",
  "updatedAt": "2025-12-09T10:30:00Z",
  "userCount": 0
}
```

**Error (400 Bad Request):**
```json
{
  "timestamp": "2025-12-09T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Shop name is required"
    }
  ],
  "path": "/api/v1/shops"
}
```

**Error (403 Forbidden):**
```json
{
  "timestamp": "2025-12-09T10:30:00Z",
  "status": 403,
  "error": "Forbidden",
  "message": "Insufficient permissions. Required role: tenant_admin",
  "path": "/api/v1/shops"
}
```

---

### 2. Lister toutes les Boutiques

**Endpoint:** `GET /shops`

**Rôle requis:** `tenant_admin` ou `shop_admin`

**Description:** Récupère la liste paginée des boutiques du tenant.

#### Request

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `page` (optional): Numéro de page (défaut: 0)
- `size` (optional): Taille de page (défaut: 20, max: 100)
- `sort` (optional): Champ de tri (défaut: createdAt,desc)
- `search` (optional): Recherche par nom ou code

**Exemple:**
```
GET /shops?page=0&size=20&sort=name,asc&search=paris
```

#### Response

**Success (200 OK):**
```json
{
  "content": [
    {
      "id": "uuid",
      "name": "string",
      "code": "string",
      "email": "string",
      "phone": "string",
      "address": "string",
      "city": "string",
      "postalCode": "string",
      "country": "string",
      "active": true,
      "createdAt": "2025-12-09T10:30:00Z",
      "updatedAt": "2025-12-09T10:30:00Z",
      "userCount": 2
    }
  ],
  "page": {
    "size": 20,
    "number": 0,
    "totalElements": 5,
    "totalPages": 1
  }
}
```

---

### 3. Récupérer une Boutique par ID

**Endpoint:** `GET /shops/{shopId}`

**Rôle requis:** `tenant_admin` ou `shop_admin`

**Description:** Récupère les détails d'une boutique spécifique.

#### Request

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters:**
- `shopId`: UUID de la boutique

#### Response

**Success (200 OK):**
```json
{
  "id": "uuid",
  "name": "string",
  "code": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "city": "string",
  "postalCode": "string",
  "country": "string",
  "active": true,
  "createdAt": "2025-12-09T10:30:00Z",
  "updatedAt": "2025-12-09T10:30:00Z",
  "userCount": 2
}
```

**Error (404 Not Found):**
```json
{
  "timestamp": "2025-12-09T10:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Shop not found with id: {shopId}",
  "path": "/api/v1/shops/{shopId}"
}
```

---

### 4. Créer un Shop Admin

**Endpoint:** `POST /shops/{shopId}/admins`

**Rôle requis:** `tenant_admin`

**Description:** Permet au Tenant Admin de créer un Shop Admin et de l'assigner à une boutique.

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
  "firstName": "string",
  "lastName": "string",
  "email": "string"
}
```

**Validation:**
- `firstName`: Requis, 2-50 caractères
- `lastName`: Requis, 2-50 caractères
- `email`: Requis, format email valide

#### Response

**Success (201 Created):**
```json
{
  "id": "uuid",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "keycloakId": "string"
}
```

**Error (400 Bad Request):**
```json
{
  "timestamp": "2025-12-09T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "User with email already exists: {email}",
  "path": "/api/v1/shops/{shopId}/admins"
}
```

**Error (404 Not Found):**
```json
{
  "timestamp": "2025-12-09T10:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Shop not found with id: {shopId}",
  "path": "/api/v1/shops/{shopId}/admins"
}
```

---

## Modèles de Données

### ShopResponse

| Champ | Type | Description | Contraintes |
|:---|:---|:---|:---|
| `id` | UUID | Identifiant unique | Auto-généré |
| `name` | String | Nom de la boutique | 2-255 caractères |
| `code` | String | Code unique de la boutique | Auto-généré |
| `email` | String | Email de contact | Format email valide |
| `phone` | String | Téléphone | Max 50 caractères |
| `address` | String | Adresse complète | 5-500 caractères |
| `city` | String | Ville | Max 100 caractères |
| `postalCode` | String | Code postal | Max 20 caractères |
| `country` | String | Pays | Max 100 caractères |
| `active` | Boolean | Statut actif | Défaut: true |
| `createdAt` | DateTime | Date de création | ISO 8601 |
| `updatedAt` | DateTime | Date de modification | ISO 8601 |
| `userCount` | Integer | Nombre d'utilisateurs | Calculé |

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
- Le code de la boutique est auto-généré à partir du nom
- Un Shop Admin créé est automatiquement lié à sa boutique via l'attribut `shop_id` dans Keycloak
- L'isolation des données est garantie : un Shop Admin ne peut accéder qu'aux données de sa boutique

### Frontend
- Utiliser `HttpClient` d'Angular pour les appels API
- Implémenter un intercepteur pour ajouter automatiquement le token JWT
- Gérer les erreurs avec un service centralisé
- Afficher des notifications utilisateur pour les succès/erreurs

---

## Exemples d'utilisation

### Créer une Boutique (cURL)

```bash
curl -X POST http://localhost:8080/api/v1/shops \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "name": "Boutique Paris Centre",
    "address": "123 Rue de la République",
    "city": "Paris",
    "postalCode": "75001",
    "country": "France",
    "phone": "+33123456789",
    "email": "paris@example.com"
  }'
```

### Créer un Shop Admin (cURL)

```bash
curl -X POST http://localhost:8080/api/v1/shops/{shopId}/admins \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com"
  }'
```

---

**Signature du contrat:**

| Rôle | Nom | Date | Signature |
|:---|:---|:---|:---|
| Backend Lead | ___________ | ___________ | ___________ |
| Frontend Lead | ___________ | ___________ | ___________ |
| Scrum Master | AI Developer | 2025-12-09 | ✅ |

