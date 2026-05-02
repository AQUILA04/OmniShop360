# Contrat API - Customer Controller

**Version:** 1.1.0  
**Date de création:** 2025-01-24  
**Dernière modification:** 2026-04-11  
**Responsable Backend:** À définir  
**Responsable Frontend:** À définir

---

## Changelog

| Version | Date | Auteur | Modifications |
|:---|:---|:---|:---|
| 1.0.0 | 2025-01-24 | AI Developer | Contrat initial Customer |
| 1.1.0 | 2026-04-11 | AI Developer | Ajout endpoint Client Divers (`POST /api/v1/customers/walk-in`) |

---

## Endpoint ajouté (v1.1.0)

### 1. Récupérer ou créer le client divers
- **Endpoint:** `POST /api/v1/customers/walk-in`
- **Rôles:** `tenant_admin`, `shop_admin`, `cashier`
- **Description:** Retourne le client par défaut "Client Divers" du tenant courant; le crée s'il n'existe pas.

**Response 200 OK:**
```json
{
  "id": "uuid",
  "firstName": "Client",
  "lastName": "Divers",
  "active": true
}
```

---

**Signature:** Backend / Frontend
