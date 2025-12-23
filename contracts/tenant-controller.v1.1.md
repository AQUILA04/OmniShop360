# API Contract - Tenant Controller

**Version:** 1.1.0  
**Creation Date:** 2025-12-08  
**Last Modified:** 2025-12-09  
**Backend Owner:** TBD  
**Frontend Owner:** TBD  

---

## Changelog

| Version | Date       | Author       | Modifications                                      |
|:--------|:-----------|:-------------|:---------------------------------------------------|
| 1.0.0   | 2025-12-08 | Scrum Master | Initial contract creation                          |
| 1.1.0   | 2025-12-09 | AI Developer | Added Update, Delete, and Status Change endpoints. |

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
Returns the updated Tenant object (see model below).

**Error (404 Not Found):**
If the tenant with the given ID does not exist.

### 5. Delete a Tenant

**Endpoint:** `DELETE /tenants/{tenantId}`
**Required Role:** `superadmin`
**Description:** Deletes a tenant. This should be a soft delete, changing the status to `DELETED`.

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

---

## Data Models

### TenantResponse

```json
{
  "id": "uuid",
  "companyName": "string",
  "contactEmail": "string",
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
