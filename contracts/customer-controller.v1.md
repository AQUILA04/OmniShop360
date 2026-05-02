# Contrat API - Customer Controller

**Version:** 1.0.0  
**Date de création:** 2025-01-24  
**Dernière modification:** 2025-01-24  
**Responsable Backend:** À définir  
**Responsable Frontend:** À définir  

---

## Changelog

| Version | Date | Auteur | Modifications |
|:---|:---|:---|:---|
| 1.0.0 | 2025-01-24 | AI Developer | Création initiale du contrat pour la gestion des clients |

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

### 1. Créer un nouveau Client

**Endpoint:** `POST /customers`

**Rôle requis:** `tenant_admin`, `shop_admin` ou `cashier`

**Description:** Permet de créer un nouveau client dans le système.

#### Request

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "city": "string",
  "postalCode": "string",
  "country": "string"
}
```

**Validation:**
- `firstName`: Optionnel, max 100 caractères
- `lastName`: Optionnel, max 100 caractères
- `email`: Optionnel, format email valide, max 255 caractères
- `phone`: Optionnel, max 50 caractères
- `address`: Optionnel, texte libre
- `city`: Optionnel, max 100 caractères
- `postalCode`: Optionnel, max 20 caractères
- `country`: Optionnel, max 100 caractères

#### Response

**Success (201 Created):**
```json
{
  "id": "uuid",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "city": "string",
  "postalCode": "string",
  "country": "string",
  "loyaltyPoints": 0,
  "active": true,
  "createdAt": "2025-01-24T10:30:00Z",
  "updatedAt": "2025-01-24T10:30:00Z"
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
      "field": "email",
      "message": "Email must be a valid email address"
    }
  ],
  "path": "/api/v1/customers"
}
```

**Error (403 Forbidden):**
```json
{
  "timestamp": "2025-01-24T10:30:00Z",
  "status": 403,
  "error": "Forbidden",
  "message": "Insufficient permissions. Required role: tenant_admin, shop_admin or cashier",
  "path": "/api/v1/customers"
}
```

---

### 2. Modifier un Client

**Endpoint:** `PUT /customers/{customerId}`

**Rôle requis:** `tenant_admin`, `shop_admin` ou `cashier`

**Description:** Permet de modifier les informations d'un client existant.

#### Request

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters:**
- `customerId`: UUID du client

**Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "city": "string",
  "postalCode": "string",
  "country": "string",
  "active": true
}
```

**Validation:**
- Tous les champs sont optionnels
- Les mêmes contraintes que pour la création s'appliquent

#### Response

**Success (200 OK):**
```json
{
  "id": "uuid",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "city": "string",
  "postalCode": "string",
  "country": "string",
  "loyaltyPoints": 0,
  "active": true,
  "createdAt": "2025-01-24T10:30:00Z",
  "updatedAt": "2025-01-24T10:30:00Z"
}
```

**Error (404 Not Found):**
```json
{
  "timestamp": "2025-01-24T10:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Customer not found with id: {customerId}",
  "path": "/api/v1/customers/{customerId}"
}
```

---

### 3. Supprimer un Client

**Endpoint:** `DELETE /customers/{customerId}`

**Rôle requis:** `tenant_admin`, `shop_admin` ou `cashier`

**Description:** Permet de supprimer un client (soft delete). Le client n'est pas physiquement supprimé mais marqué comme supprimé.

#### Request

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters:**
- `customerId`: UUID du client

#### Response

**Success (204 No Content):**
Aucun contenu dans la réponse.

**Error (404 Not Found):**
```json
{
  "timestamp": "2025-01-24T10:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Customer not found with id: {customerId}",
  "path": "/api/v1/customers/{customerId}"
}
```

---

### 4. Lister tous les Clients

**Endpoint:** `GET /customers`

**Rôle requis:** `tenant_admin`, `shop_admin` ou `cashier`

**Description:** Récupère la liste paginée des clients avec possibilité de recherche et filtrage avancé.

#### Request

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `page` (optional): Numéro de page (défaut: 0)
- `size` (optional): Taille de page (défaut: 20, max: 100)
- `sort` (optional): Champ de tri (défaut: createdAt,desc)
- `keyword` (optional): Recherche par mot-clé (nom, prénom, email, téléphone)
- `email` (optional): Filtrer par email exact
- `phone` (optional): Filtrer par téléphone exact
- `active` (optional): Filtrer par statut actif (true/false)

**Exemple:**
```
GET /customers?page=0&size=20&sort=lastName,asc&keyword=john&active=true
```

#### Response

**Success (200 OK):**
```json
{
  "content": [
    {
      "id": "uuid",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string",
      "address": "string",
      "city": "string",
      "postalCode": "string",
      "country": "string",
      "loyaltyPoints": 0,
      "active": true,
      "createdAt": "2025-01-24T10:30:00Z",
      "updatedAt": "2025-01-24T10:30:00Z"
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

### 5. Récupérer un Client par ID

**Endpoint:** `GET /customers/{customerId}`

**Rôle requis:** `tenant_admin`, `shop_admin` ou `cashier`

**Description:** Récupère les détails d'un client spécifique.

#### Request

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters:**
- `customerId`: UUID du client

#### Response

**Success (200 OK):**
```json
{
  "id": "uuid",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "city": "string",
  "postalCode": "string",
  "country": "string",
  "loyaltyPoints": 0,
  "active": true,
  "createdAt": "2025-01-24T10:30:00Z",
  "updatedAt": "2025-01-24T10:30:00Z"
}
```

**Error (404 Not Found):**
```json
{
  "timestamp": "2025-01-24T10:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Customer not found with id: {customerId}",
  "path": "/api/v1/customers/{customerId}"
}
```

---

## Modèles de Données

### CustomerResponse

| Champ | Type | Description | Contraintes |
|:---|:---|:---|:---|
| `id` | UUID | Identifiant unique | Auto-généré |
| `firstName` | String | Prénom | Max 100 caractères |
| `lastName` | String | Nom | Max 100 caractères |
| `email` | String | Email | Format email valide, max 255 caractères |
| `phone` | String | Téléphone | Max 50 caractères |
| `address` | String | Adresse complète | Texte libre |
| `city` | String | Ville | Max 100 caractères |
| `postalCode` | String | Code postal | Max 20 caractères |
| `country` | String | Pays | Max 100 caractères |
| `loyaltyPoints` | Integer | Points de fidélité | Défaut: 0 |
| `active` | Boolean | Statut actif | Défaut: true |
| `createdAt` | DateTime | Date de création | ISO 8601 |
| `updatedAt` | DateTime | Date de modification | ISO 8601 |

---

## Codes d'erreur

| Code | Description |
|:---|:---|
| 200 | OK - Requête réussie |
| 201 | Created - Ressource créée avec succès |
| 204 | No Content - Ressource supprimée avec succès |
| 400 | Bad Request - Données invalides |
| 401 | Unauthorized - Token manquant ou invalide |
| 403 | Forbidden - Permissions insuffisantes |
| 404 | Not Found - Ressource non trouvée |
| 500 | Internal Server Error - Erreur serveur |

---

## Notes d'implémentation

### Backend
- L'isolation des données est garantie : un utilisateur ne peut accéder qu'aux clients de son tenant
- La suppression est un soft delete (le client est marqué comme supprimé mais reste en base)
- Les recherches utilisent JPA Specifications pour des filtres dynamiques
- Les points de fidélité sont initialisés à 0 lors de la création

### Frontend
- Utiliser `HttpClient` d'Angular pour les appels API
- Implémenter un intercepteur pour ajouter automatiquement le token JWT
- Gérer les erreurs avec un service centralisé
- Afficher des notifications utilisateur pour les succès/erreurs
- Implémenter une pagination côté frontend pour la liste des clients
- Permettre la recherche en temps réel avec debounce

---

## Exemples d'utilisation

### Créer un Client (cURL)

```bash
curl -X POST http://localhost:8080/api/v1/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com",
    "phone": "+33123456789",
    "address": "123 Rue de la République",
    "city": "Paris",
    "postalCode": "75001",
    "country": "France"
  }'
```

### Modifier un Client (cURL)

```bash
curl -X PUT http://localhost:8080/api/v1/customers/{customerId} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "firstName": "Jean",
    "lastName": "Martin",
    "email": "jean.martin@example.com",
    "active": true
  }'
```

### Supprimer un Client (cURL)

```bash
curl -X DELETE http://localhost:8080/api/v1/customers/{customerId} \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### Rechercher des Clients (cURL)

```bash
curl -X GET "http://localhost:8080/api/v1/customers?page=0&size=20&keyword=jean&active=true" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

**Signature du contrat:**

| Rôle | Nom | Date | Signature |
|:---|:---|:---|:---|
| Backend Lead | ___________ | ___________ | ___________ |
| Frontend Lead | ___________ | ___________ | ___________ |
| Scrum Master | AI Developer | 2025-01-24 | ✅ |
