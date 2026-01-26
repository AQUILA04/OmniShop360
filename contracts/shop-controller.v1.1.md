# Contrat API - Shop Controller

**Version:** 1.1.0  
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

**Description:** Permet au Tenant Admin ou Shop Admin de créer un Caissier et de l'assigner à une boutique. Un Shop Admin ne peut créer un caissier que pour sa propre boutique.

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
  "path": "/api/v1/shops/{shopId}/cashiers"
}
```

**Error (400 Bad Request - Shop Admin restriction):**
```json
{
  "timestamp": "2025-01-24T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Shop Admin can only create cashiers for their own shop",
  "path": "/api/v1/shops/{shopId}/cashiers"
}
```

**Error (403 Forbidden):**
```json
{
  "timestamp": "2025-01-24T10:30:00Z",
  "status": 403,
  "error": "Forbidden",
  "message": "Insufficient permissions. Required role: tenant_admin or shop_admin",
  "path": "/api/v1/shops/{shopId}/cashiers"
}
```

**Error (404 Not Found):**
```json
{
  "timestamp": "2025-01-24T10:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Shop not found with id: {shopId}",
  "path": "/api/v1/shops/{shopId}/cashiers"
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
- Un Caissier créé est automatiquement lié à sa boutique via l'attribut `shop_id` dans Keycloak
- Un Shop Admin ne peut créer un caissier que pour sa propre boutique (vérification automatique)
- Un Tenant Admin peut créer un caissier pour n'importe quelle boutique de son tenant
- L'isolation des données est garantie : un Caissier ne peut accéder qu'aux données de sa boutique

### Frontend
- Utiliser `HttpClient` d'Angular pour les appels API
- Implémenter un intercepteur pour ajouter automatiquement le token JWT
- Gérer les erreurs avec un service centralisé
- Afficher des notifications utilisateur pour les succès/erreurs
- Vérifier le rôle de l'utilisateur avant d'afficher l'option de création de caissier

---

## Exemples d'utilisation

### Créer un Caissier (cURL)

```bash
curl -X POST http://localhost:8080/api/v1/shops/{shopId}/cashiers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "firstName": "Marie",
    "lastName": "Martin",
    "email": "marie.martin@example.com"
  }'
```

---

**Signature du contrat:**

| Rôle | Nom | Date | Signature |
|:---|:---|:---|:---|
| Backend Lead | ___________ | ___________ | ___________ |
| Frontend Lead | ___________ | ___________ | ___________ |
| Scrum Master | AI Developer | 2025-01-24 | ✅ |
