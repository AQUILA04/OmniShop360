# Contrat API - Cash Register Session Controller

**Version:** 1.0.0  
**Date de création:** 2026-04-11  
**Dernière modification:** 2026-04-11  
**Responsable Backend:** À définir  
**Responsable Frontend:** À définir

---

## Changelog

| Version | Date | Auteur | Modifications |
|:---|:---|:---|:---|
| 1.0.0 | 2026-04-11 | AI Developer | Création initiale du contrat ouverture/clôture de caisse |

---

## Endpoints

### 1. Ouvrir une caisse
- **Endpoint:** `POST /api/v1/cash-register-sessions/open`
- **Rôles:** `tenant_admin`, `shop_admin`, `cashier`
- **Body:**
```json
{
  "openingFloat": 25000.00
}
```

### 2. Clôturer une caisse
- **Endpoint:** `POST /api/v1/cash-register-sessions/close`
- **Rôles:** `tenant_admin`, `shop_admin`, `cashier`
- **Body:**
```json
{
  "countedCashAmount": 49500.00
}
```
- Si le reliquat est positif, un code d'avoir est généré (`generatedVoucherCode`).

### 3. Lister les sessions de caisse
- **Endpoint:** `GET /api/v1/cash-register-sessions`
- **Rôles:** `tenant_admin`, `shop_admin`, `cashier`
- **Query params:** `page`, `size`, `sort`, `status` (`OPEN`/`CLOSED`)

---

## Modèle de réponse (extrait)

```json
{
  "id": "uuid",
  "shopId": "uuid",
  "shopName": "Shop A",
  "openedBy": "keycloak-user-id",
  "openedAt": "2026-04-11T10:00:00",
  "openingFloat": 25000.00,
  "closedBy": "keycloak-user-id",
  "closedAt": "2026-04-11T20:00:00",
  "expectedCashAmount": 50000.00,
  "countedCashAmount": 49500.00,
  "remainderAmount": -500.00,
  "status": "CLOSED",
  "generatedVoucherCode": "VCH-AB12CD34"
}
```

---

**Signature:** Backend / Frontend
