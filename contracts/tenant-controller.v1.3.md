# API Contract - Tenant Controller

**Version:** 1.3.0  
**Creation Date:** 2025-12-08  
**Last Modified:** 2026-02-21  
**Backend Owner:** TBD  
**Frontend Owner:** TBD  

---

## Changelog

| Version | Date       | Author       | Modifications                                      |
|:--------|:-----------|:-------------|:---------------------------------------------------|
| 1.0.0   | 2025-12-08 | Scrum Master | Initial contract creation                          |
| 1.1.0   | 2025-12-09 | AI Developer | Added Update, Delete, and Status Change endpoints. |
| 1.2.0   | 2025-12-09 | AI Developer | Added Pricing Policy update endpoint.              |
| 1.3.0   | 2026-02-21 | AI Developer | Backend implementation of PUT, PATCH status, DELETE (v1.1) verified and aligned. |

---

## Base URL

```
Development: http://localhost:8080/api/v1
Production: https://api.omnishop360.com/api/v1
```

---

## Authentication

All requests require a valid JWT in the `Authorization` header:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## Endpoints

### 1. Create a new Tenant

**Endpoint:** `POST /tenants`
**Required Role:** `superadmin`
(Unchanged from v1.0.0)

### 2. List all Tenants

**Endpoint:** `GET /tenants`
**Required Role:** `superadmin`
(Unchanged from v1.0.0)

### 3. Get Tenant by ID

**Endpoint:** `GET /tenants/{tenantId}`
**Required Role:** `superadmin`
(Unchanged from v1.0.0)

### 4. Update a Tenant

**Endpoint:** `PUT /tenants/{tenantId}`
**Required Role:** `superadmin`
**Description:** Updates the information of a specific tenant.

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
  "contactEmail": "string"
}
```

#### Response

**Success (200 OK):**
Returns the updated Tenant object (see TenantResponse model).

**Error (404 Not Found):**
If the tenant with the given ID does not exist.

### 5. Delete a Tenant

**Endpoint:** `DELETE /tenants/{tenantId}`
**Required Role:** `superadmin`
**Description:** Soft delete; tenant status is set to `DELETED`.

#### Response

**Success (204 No Content):**
Indicates successful deletion.

**Error (404 Not Found):**
If the tenant with the given ID does not exist.

### 6. Update Tenant Status

**Endpoint:** `PATCH /tenants/{tenantId}/status`
**Required Role:** `superadmin`
**Description:** Activates or suspends a tenant.

#### Request

**Body:**
```json
{
  "status": "ACTIVE"
}
```
or
```json
{
  "status": "SUSPENDED"
}
```

#### Response

**Success (200 OK):**
Returns the updated Tenant object.

**Error (400 Bad Request):**
If status is not ACTIVE or SUSPENDED (e.g. DELETED).

**Error (404 Not Found):**
If the tenant with the given ID does not exist.

### 7. Update Tenant Pricing Policy

**Endpoint:** `PATCH /tenants/pricing-policy`
**Required Role:** `tenant_admin`
**Description:** Updates the pricing policy for the current tenant.

#### Request

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Body:**
```json
{
  "pricingPolicy": "GLOBAL_ENFORCED"
}
```
or
```json
{
  "pricingPolicy": "LOCAL_ALLOWED"
}
```

**Validation:**
- `pricingPolicy`: Required, must be either "GLOBAL_ENFORCED" or "LOCAL_ALLOWED"

#### Response

**Success (200 OK):**
```json
{
  "id": "uuid",
  "companyName": "string",
  "contactEmail": "string",
  "pricingPolicy": "GLOBAL_ENFORCED",
  "status": "ACTIVE",
  "createdAt": "2025-12-09T10:30:00Z",
  "updatedAt": "2025-12-09T10:30:00Z",
  "adminCount": 1,
  "shopCount": 0
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
      "field": "pricingPolicy",
      "message": "Pricing policy must be either GLOBAL_ENFORCED or LOCAL_ALLOWED"
    }
  ],
  "path": "/api/v1/tenants/pricing-policy"
}
```

**Error (403 Forbidden):**
```json
{
  "timestamp": "2025-12-09T10:30:00Z",
  "status": 403,
  "error": "Forbidden",
  "message": "Insufficient permissions. Required role: tenant_admin",
  "path": "/api/v1/tenants/pricing-policy"
}
```

---

## Data Models

### TenantResponse

```json
{
  "id": "uuid",
  "companyName": "string",
  "contactEmail": "string",
  "pricingPolicy": "GLOBAL_ENFORCED" | "LOCAL_ALLOWED",
  "status": "ACTIVE" | "SUSPENDED" | "DELETED",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "adminCount": "integer",
  "shopCount": "integer"
}
```

### PagedResponse<TenantResponse>

```json
{
  "content": [
    // Array of TenantResponse objects
  ],
  "page": {
    "size": "integer",
    "number": "integer",
    "totalElements": "integer",
    "totalPages": "integer"
  }
}
```

### Pricing Policy Values

- **GLOBAL_ENFORCED**: The selling price in shops must strictly equal the master catalog `sale_price`. No local overrides allowed.
- **LOCAL_ALLOWED**: The system will allow (in future sprints) creating price overrides per shop.

---

## Notes d'implémentation

### Backend
- The pricing policy is stored in the `pricing_policy` column of the `tenants` table
- Default value is `GLOBAL_ENFORCED`
- The endpoint uses the current user's tenant ID from the security context
- PUT and PATCH status require superadmin; DELETE performs soft delete (deleted=true, status=DELETED)

### Frontend
- Display a toggle button or dropdown in tenant settings to switch between policies
- Show a tooltip explaining the difference between the two policies
- The change should be immediate and reflected in the tenant response

---

## Exemples d'utilisation

### Update Tenant (cURL)

```bash
curl -X PUT http://localhost:8080/api/v1/tenants/{tenantId} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "companyName": "New Company Name",
    "contactEmail": "contact@newcompany.com"
  }'
```

### Update Status (cURL)

```bash
curl -X PATCH http://localhost:8080/api/v1/tenants/{tenantId}/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"status": "SUSPENDED"}'
```

### Update Pricing Policy (cURL)

```bash
curl -X PATCH http://localhost:8080/api/v1/tenants/pricing-policy \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "pricingPolicy": "LOCAL_ALLOWED"
  }'
```

---

**Signature du contrat:**

| Rôle | Nom | Date | Signature |
|:---|:---|:---|:---|
| Backend Lead | ___________ | ___________ | ___________ |
| Frontend Lead | ___________ | ___________ | ___________ |
| Scrum Master | AI Developer | 2026-02-21 | ✅ |
