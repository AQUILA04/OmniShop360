# Contrat API - Audit Log Controller

**Version:** 1.0.0  
**Date de création:** 2025-02-21  
**Dernière modification:** 2025-02-21  
**Responsable Backend:** À définir  
**Responsable Frontend:** À définir  

---

## Changelog

| Version | Date | Auteur | Modifications |
|:---|:---|:---|:---|
| 1.0.0 | 2025-02-21 | AI Developer | Création initiale (US-019) |

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

### 1. Lister les journaux d'audit

**Endpoint:** `GET /audit-logs`

**Rôle requis:** `superadmin` ou `tenant_admin`

**Description:** Retourne la liste paginée des modifications auditées (Stock, Sale, Product). Tenant Admin ne voit que les révisions de son tenant. Super Admin peut filtrer par tenant.

#### Request

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `page` (optional): Numéro de page (défaut: 0)
- `size` (optional): Taille de page (défaut: 20)
- `sort` (optional): Tri (ex: revtstmp,desc)
- `fromDate` (optional): Date de début (yyyy-MM-dd)
- `toDate` (optional): Date de fin (yyyy-MM-dd)
- `userId` (optional): Filtrer par utilisateur (Keycloak sub)
- `entityType` (optional): Filtrer par type d'entité — `Stock`, `Sale`, `Product`
- `tenantId` (optional): Filtrer par tenant (superadmin uniquement)

**Exemple:**
```
GET /audit-logs?page=0&size=20&fromDate=2025-02-01&toDate=2025-02-21&entityType=Stock
GET /audit-logs?tenantId=<UUID>&page=0&size=20
```

#### Response

**Success (200 OK):**
```json
{
  "content": [
    {
      "revisionId": 1,
      "timestamp": "2025-02-21T10:30:00Z",
      "userId": "keycloak-sub-id",
      "actionType": "UPDATE",
      "entityType": "Stock",
      "entityId": "uuid"
    }
  ],
  "page": {
    "size": 20,
    "number": 0,
    "totalElements": 42,
    "totalPages": 3
  }
}
```

**actionType:** `CREATE`, `UPDATE`, `DELETE`

**entityType:** `Stock`, `Sale`, `Product`

**Error (403 Forbidden):** Rôle insuffisant (superadmin ou tenant_admin requis).

---

## Modèles de données

### AuditLogEntry

| Champ | Type | Description |
|:---|:---|:---|
| `revisionId` | Integer | Numéro de révision |
| `timestamp` | DateTime (ISO 8601) | Date/heure de la modification |
| `userId` | String | Identifiant utilisateur (Keycloak sub) |
| `actionType` | String | CREATE, UPDATE, DELETE |
| `entityType` | String | Stock, Sale, Product |
| `entityId` | UUID | ID de l'entité modifiée |

---

## Codes d'erreur

| Code | Description |
|:---|:---|
| 200 | OK |
| 401 | Unauthorized |
| 403 | Forbidden |
| 500 | Internal Server Error |

---

## Notes d'implémentation

### Backend
- Données alimentées par Hibernate Envers (tables _aud + revision_info).
- Isolation tenant stricte pour tenant_admin.

### Frontend
- Lecture seule ; pas d’édition des logs.
- Table avec tri/filtres par date, utilisateur, type d’entité.

---

**Signature du contrat:**

| Rôle | Nom | Date | Signature |
|:---|:---|:---|:---|
| Backend Lead | ___________ | ___________ | ___________ |
| Frontend Lead | ___________ | ___________ | ___________ |
| Scrum Master | AI Developer | 2025-02-21 | ✅ |
