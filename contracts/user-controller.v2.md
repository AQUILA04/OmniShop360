# Contrat API - User Controller (v2)

**Version:** 2.1.0  
**Date de création:** 2025-01-24  
**Dernière modification:** 2026-02-21  
**Responsable Backend:** À définir  
**Responsable Frontend:** À définir  

---

## Changelog

| Version | Date | Auteur | Modifications |
|:---|:---|:---|:---|
| 1.0.0 | 2025-01-24 | AI Developer | Création initiale du contrat pour la gestion des utilisateurs |
| 2.0.0 | 2026-02-21 | AI Developer | Ajout du champ `role` dans la réponse (liste utilisateurs) pour identifier le rôle de chaque utilisateur |
| 2.1.0 | 2026-02-21 | AI Developer | Comportement GET /users par rôle : superadmin = tous ; tenant_admin = son tenant ; shop_admin = sa boutique uniquement |

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

### 1. Lister les utilisateurs

**Endpoint:** `GET /users`

**Rôle requis:** `superadmin` ou `tenant_admin` ou `shop_admin`

**Description:** Récupère la liste paginée des utilisateurs avec le rôle de chaque utilisateur. Comportement selon le rôle appelant : **superadmin** : tous les utilisateurs du système ; **tenant_admin** : uniquement les utilisateurs de son tenant ; **shop_admin** : uniquement les utilisateurs de sa boutique.

#### Request

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `page` (optional): Numéro de page (défaut: 0)
- `size` (optional): Taille de page (défaut: 20, max: 100)
- `sort` (optional): Champ de tri (défaut: createdAt,desc). Ex: `lastName,asc`, `email,asc`
- `keyword` (optional): Recherche par mot-clé (prénom, nom, email)
- `email` (optional): Filtrer par email exact
- `active` (optional): Filtrer par statut actif (true/false)
- `tenantId` (optional): Filtrer par tenant (superadmin uniquement)
- `shopId` (optional): Filtrer par boutique (superadmin ou tenant_admin uniquement ; ignoré pour shop_admin, qui voit uniquement sa boutique)

**Exemple:**
```
GET /users?page=0&size=20&sort=lastName,asc&keyword=john&active=true
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
      "keycloakId": "string",
      "active": true,
      "tenantId": "uuid",
      "tenantCompanyName": "string",
      "shopId": "uuid",
      "shopName": "string",
      "createdAt": "2025-01-24T10:30:00Z",
      "role": "tenant_admin"
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

**Error (403 Forbidden):**
```json
{
  "timestamp": "2025-01-24T10:30:00Z",
  "status": 403,
  "error": "Forbidden",
  "message": "Insufficient permissions. Required role: superadmin, tenant_admin or shop_admin",
  "path": "/api/v1/users"
}
```

---

## Modèles de Données

### UserResponse

| Champ | Type | Description | Contraintes |
|:---|:---|:---|:---|
| `id` | UUID | Identifiant unique | Auto-généré |
| `firstName` | String | Prénom | Max 100 caractères |
| `lastName` | String | Nom | Max 100 caractères |
| `email` | String | Email | Format email valide, max 255 caractères |
| `keycloakId` | String | ID Keycloak | Identifiant utilisateur Keycloak |
| `active` | Boolean | Statut actif | Défaut: true |
| `tenantId` | UUID | Référence au tenant | Toujours présent |
| `tenantCompanyName` | String | Nom de l'entreprise (tenant) | Max 255 caractères |
| `shopId` | UUID | Référence à la boutique | Nullable si aucun shop assigné |
| `shopName` | String | Nom de la boutique | Nullable |
| `createdAt` | DateTime | Date de création | ISO 8601 |
| `role` | String | Rôle(s) métier de l'utilisateur | Uniquement les rôles applicatifs (superadmin, tenant_admin, shop_admin, cashier, stock_manager). Rôles Keycloak techniques (ex. uma_authorization) exclus. Plusieurs rôles séparés par ", " (ex. "tenant_admin, shop_admin"). Nullable si aucun rôle métier |

---

## Codes d'erreur

| Code | Description |
|:---|:---|
| 200 | OK - Requête réussie |
| 401 | Unauthorized - Token manquant ou invalide |
| 403 | Forbidden - Permissions insuffisantes |
| 500 | Internal Server Error - Erreur serveur |

---

## Notes d'implémentation

### Backend
- L'isolation des données est garantie : **superadmin** voit tous les utilisateurs et peut filtrer par tenantId ou shopId ; **tenant_admin** ne voit que les utilisateurs de son tenant (filtre shopId optionnel dans le tenant) ; **shop_admin** ne voit que les utilisateurs de sa boutique (tenantId/shopId de la requête ignorés)
- Les recherches utilisent JPA Specifications pour des filtres dynamiques
- Les utilisateurs supprimés (soft delete) ne sont pas retournés
- Le champ `role` est résolu via Keycloak (rôles realm effectifs), puis filtré pour ne garder que les rôles métier (superadmin, tenant_admin, shop_admin, cashier, stock_manager). Les rôles techniques Keycloak (uma_authorization, default-roles-*, etc.) sont exclus. Si plusieurs rôles métier, ils sont retournés séparés par ", ". En cas d'erreur ou d'aucun rôle métier, `role` est null

### Frontend
- Utiliser `HttpClient` d'Angular pour les appels API
- Implémenter un intercepteur pour ajouter automatiquement le token JWT
- Gérer les erreurs avec un service centralisé
- Implémenter une pagination côté frontend pour la liste des utilisateurs
- Permettre la recherche en temps réel avec debounce
- Afficher le rôle utilisateur dans la liste (badge, colonne, etc.) pour identifier chaque utilisateur

---

## Exemples d'utilisation

### Lister les utilisateurs (cURL)

```bash
curl -X GET "http://localhost:8080/api/v1/users?page=0&size=20&keyword=john&active=true" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### Lister les utilisateurs d'un tenant (superadmin)

```bash
curl -X GET "http://localhost:8080/api/v1/users?tenantId=<TENANT_UUID>&page=0&size=20" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

**Signature du contrat:**

| Rôle | Nom | Date | Signature |
|:---|:---|:---|:---|
| Backend Lead | ___________ | ___________ | ___________ |
| Frontend Lead | ___________ | ___________ | ___________ |
| Scrum Master | ___________ | 2026-02-21 | ✅ |
