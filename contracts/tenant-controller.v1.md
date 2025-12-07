# Contrat API - Tenant Controller

**Version:** 1.0.0  
**Date de création:** 2025-12-08  
**Dernière modification:** 2025-12-08  
**Responsable Backend:** À définir  
**Responsable Frontend:** À définir  

---

## Changelog

| Version | Date | Auteur | Modifications |
|:---|:---|:---|:---|
| 1.0.0 | 2025-12-08 | Scrum Master | Création initiale du contrat |

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

### 1. Créer un nouveau Tenant

**Endpoint:** `POST /tenants`

**Rôle requis:** `superadmin`

**Description:** Permet au Super Admin de créer un nouveau Tenant (entreprise cliente) et son administrateur principal.

#### Request

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Body:**
```json
{
  "companyName": "string",
  "contactEmail": "string",
  "adminFirstName": "string",
  "adminLastName": "string",
  "adminEmail": "string"
}
```

**Validation:**
- `companyName`: Requis, 3-100 caractères
- `contactEmail`: Requis, format email valide
- `adminFirstName`: Requis, 2-50 caractères
- `adminLastName`: Requis, 2-50 caractères
- `adminEmail`: Requis, format email valide, unique

#### Response

**Success (201 Created):**
```json
{
  "id": "uuid",
  "companyName": "string",
  "contactEmail": "string",
  "status": "ACTIVE",
  "createdAt": "2025-12-08T10:30:00Z",
  "admin": {
    "id": "uuid",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "keycloakId": "string"
  }
}
```

**Error (400 Bad Request):**
```json
{
  "timestamp": "2025-12-08T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": [
    {
      "field": "adminEmail",
      "message": "Email already exists"
    }
  ],
  "path": "/api/v1/tenants"
}
```

**Error (403 Forbidden):**
```json
{
  "timestamp": "2025-12-08T10:30:00Z",
  "status": 403,
  "error": "Forbidden",
  "message": "Insufficient permissions. Required role: superadmin",
  "path": "/api/v1/tenants"
}
```

---

### 2. Lister tous les Tenants

**Endpoint:** `GET /tenants`

**Rôle requis:** `superadmin`

**Description:** Récupère la liste paginée de tous les Tenants.

#### Request

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `page` (optional): Numéro de page (défaut: 0)
- `size` (optional): Taille de page (défaut: 20, max: 100)
- `sort` (optional): Champ de tri (défaut: createdAt,desc)
- `search` (optional): Recherche par nom d'entreprise

**Exemple:**
```
GET /tenants?page=0&size=20&sort=companyName,asc&search=acme
```

#### Response

**Success (200 OK):**
```json
{
  "content": [
    {
      "id": "uuid",
      "companyName": "string",
      "contactEmail": "string",
      "status": "ACTIVE",
      "createdAt": "2025-12-08T10:30:00Z",
      "adminCount": 1,
      "shopCount": 0
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
  "timestamp": "2025-12-08T10:30:00Z",
  "status": 403,
  "error": "Forbidden",
  "message": "Insufficient permissions. Required role: superadmin",
  "path": "/api/v1/tenants"
}
```

---

### 3. Récupérer un Tenant par ID

**Endpoint:** `GET /tenants/{tenantId}`

**Rôle requis:** `superadmin`

**Description:** Récupère les détails d'un Tenant spécifique.

#### Request

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters:**
- `tenantId`: UUID du tenant

#### Response

**Success (200 OK):**
```json
{
  "id": "uuid",
  "companyName": "string",
  "contactEmail": "string",
  "status": "ACTIVE",
  "createdAt": "2025-12-08T10:30:00Z",
  "updatedAt": "2025-12-08T10:30:00Z",
  "admins": [
    {
      "id": "uuid",
      "firstName": "string",
      "lastName": "string",
      "email": "string"
    }
  ],
  "shops": []
}
```

**Error (404 Not Found):**
```json
{
  "timestamp": "2025-12-08T10:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Tenant not found with id: {tenantId}",
  "path": "/api/v1/tenants/{tenantId}"
}
```

---

## Modèles de Données

### Tenant

| Champ | Type | Description | Contraintes |
|:---|:---|:---|:---|
| `id` | UUID | Identifiant unique | Auto-généré |
| `companyName` | String | Nom de l'entreprise | 3-100 caractères |
| `contactEmail` | String | Email de contact | Format email valide |
| `status` | Enum | Statut du tenant | ACTIVE, SUSPENDED, DELETED |
| `createdAt` | DateTime | Date de création | ISO 8601 |
| `updatedAt` | DateTime | Date de modification | ISO 8601 |

### User (Admin)

| Champ | Type | Description | Contraintes |
|:---|:---|:---|:---|
| `id` | UUID | Identifiant unique | Auto-généré |
| `tenantId` | UUID | Référence au tenant | Foreign key |
| `firstName` | String | Prénom | 2-50 caractères |
| `lastName` | String | Nom | 2-50 caractères |
| `email` | String | Email | Format email valide, unique |
| `keycloakId` | String | ID Keycloak | Auto-généré |

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
| 409 | Conflict - Conflit (ex: email déjà existant) |
| 500 | Internal Server Error - Erreur serveur |

---

## Notes d'implémentation

### Backend
- Utiliser Spring Security pour la validation des rôles
- Implémenter la pagination avec Spring Data JPA
- Utiliser Keycloak Admin Client pour créer les utilisateurs
- Envoyer l'email d'invitation via `ExecuteActionsEmail` de Keycloak
- Ajouter des logs pour toutes les opérations de création/modification

### Frontend
- Utiliser `HttpClient` d'Angular pour les appels API
- Implémenter un intercepteur pour ajouter automatiquement le token JWT
- Gérer les erreurs avec un service centralisé
- Afficher des notifications utilisateur pour les succès/erreurs
- Implémenter un loading state pendant les requêtes

---

## Tests

### Backend
- Tests unitaires pour `TenantService`
- Tests d'intégration avec Testcontainers (PostgreSQL + Keycloak)
- Validation des contraintes de données
- Tests des cas d'erreur (email dupliqué, permissions, etc.)

### Frontend
- Tests unitaires des services
- Tests des composants avec mocks
- Tests end-to-end avec Cypress (optionnel)

---

## Exemples d'utilisation

### Créer un Tenant (cURL)

```bash
curl -X POST http://localhost:8080/api/v1/tenants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "companyName": "ACME Corporation",
    "contactEmail": "contact@acme.com",
    "adminFirstName": "John",
    "adminLastName": "Doe",
    "adminEmail": "john.doe@acme.com"
  }'
```

### Lister les Tenants (cURL)

```bash
curl -X GET "http://localhost:8080/api/v1/tenants?page=0&size=20" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

**Signature du contrat:**

| Rôle | Nom | Date | Signature |
|:---|:---|:---|:---|
| Backend Lead | ___________ | ___________ | ___________ |
| Frontend Lead | ___________ | ___________ | ___________ |
| Scrum Master | Manus AI | 2025-12-08 | ✅ |
