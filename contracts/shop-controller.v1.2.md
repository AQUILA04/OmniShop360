# Contrat API - Shop Controller

**Version:** 1.2.0  
**Date de création:** 2025-01-24  
**Dernière modification:** 2025-01-24  
**Responsable Backend:** À définir  
**Responsable Frontend:** À définir  

---

## Changelog

| Version | Date | Auteur | Modifications |
|:---|:---|:---|:---|
| 1.0.0 | 2025-12-09 | AI Developer | Création initiale du contrat |
| 1.1.0 | 2025-01-24 | AI Developer | Ajout de l'endpoint POST /shops/{shopId}/cashiers pour créer un caissier |
| 1.2.0 | 2025-01-24 | AI Developer | Ajout de l'endpoint POST /shops/{shopId}/stock-managers pour créer un gestionnaire de stock |

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

### 4. Créer un Shop Admin

**Endpoint:** `POST /shops/{shopId}/admins`  
**Rôle requis:** `tenant_admin`  
(Unchanged from v1.0.0)

### 5. Créer un Caissier

**Endpoint:** `POST /shops/{shopId}/cashiers`  
**Rôle requis:** `tenant_admin` ou `shop_admin`  
(Unchanged from v1.1.0)

### 6. Créer un Gestionnaire de Stock (NEW in v1.2.0)

**Endpoint:** `POST /shops/{shopId}/stock-managers`

**Rôle requis:** `tenant_admin` ou `shop_admin`

**Description:** Permet au Tenant Admin ou Shop Admin de créer un Gestionnaire de Stock et de l'assigner à une boutique. Un Shop Admin ne peut créer un gestionnaire de stock que pour sa propre boutique. Le gestionnaire de stock peut gérer les réceptions et consulter l'inventaire de sa boutique.

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
  "timestamp": "2025-01-24T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "User with email already exists: {email}",
  "path": "/api/v1/shops/{shopId}/stock-managers"
}
```

**Error (400 Bad Request - Shop Admin restriction):**
```json
{
  "timestamp": "2025-01-24T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Shop Admin can only create stock managers for their own shop",
  "path": "/api/v1/shops/{shopId}/stock-managers"
}
```

**Error (403 Forbidden):**
```json
{
  "timestamp": "2025-01-24T10:30:00Z",
  "status": 403,
  "error": "Forbidden",
  "message": "Insufficient permissions. Required role: tenant_admin or shop_admin",
  "path": "/api/v1/shops/{shopId}/stock-managers"
}
```

**Error (404 Not Found):**
```json
{
  "timestamp": "2025-01-24T10:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Shop not found with id: {shopId}",
  "path": "/api/v1/shops/{shopId}/stock-managers"
}
```

---

## Modèles de Données

### AdminUserResponse

| Champ | Type | Description | Contraintes |
|:---|:---|:---|:---|
| `id` | UUID | Identifiant unique | Auto-généré |
| `firstName` | String | Prénom | 2-50 caractères |
| `lastName` | String | Nom | 2-50 caractères |
| `email` | String | Email | Format email valide |
| `keycloakId` | String | Identifiant Keycloak | Auto-généré |

---

## Notes d'implémentation

### Backend
- Un Gestionnaire de Stock créé est automatiquement lié à sa boutique via l'attribut `shop_id` dans Keycloak
- Un Shop Admin ne peut créer un gestionnaire de stock que pour sa propre boutique (vérification automatique)
- Un Tenant Admin peut créer un gestionnaire de stock pour n'importe quelle boutique de son tenant
- Le Gestionnaire de Stock peut accéder à `POST /stock/movements` et `GET /stock/inventory` pour sa boutique

### Frontend
- Vérifier le rôle de l'utilisateur avant d'afficher l'option de création de gestionnaire de stock

---

## Exemples d'utilisation

### Créer un Gestionnaire de Stock (cURL)

```bash
curl -X POST http://localhost:8080/api/v1/shops/{shopId}/stock-managers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "firstName": "Pierre",
    "lastName": "Leroy",
    "email": "pierre.leroy@example.com"
  }'
```

---

**Signature du contrat:**

| Rôle | Nom | Date | Signature |
|:---|:---|:---|:---|
| Backend Lead | ___________ | ___________ | ___________ |
| Frontend Lead | ___________ | ___________ | ___________ |
| Scrum Master | AI Developer | 2025-01-24 | ✅ |
