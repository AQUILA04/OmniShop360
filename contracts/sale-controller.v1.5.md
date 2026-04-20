# Contrat API - Sale Controller

**Version:** 1.5.0  
**Date de création:** 2025-01-24  
**Dernière modification:** 2026-04-11  
**Responsable Backend:** À définir  
**Responsable Frontend:** À définir

---

## Changelog

| Version | Date | Auteur | Modifications |
|:---|:---|:---|:---|
| 1.4.0 | 2026-04-11 | AI Developer | Multi-paiement, voucher, impression |
| 1.5.0 | 2026-04-11 | AI Developer | Ajout endpoint dédié de création de code promo (tenant_admin, shop_admin) |

---

## Endpoint ajouté (v1.5.0)

### 1. Créer un code promotionnel
- **Endpoint:** `POST /api/v1/sales/promotions`
- **Rôles:** `tenant_admin`, `shop_admin`
- **Description:** crée un code promo avec scope tenant; un `shop_admin` crée uniquement pour sa boutique.

**Body:**
```json
{
  "code": "PROMO1000",
  "discountType": "FIXED",
  "discountValue": 1000.0,
  "maxDiscountAmount": 1000.0,
  "startsAt": "2026-04-11T00:00:00",
  "endsAt": "2026-04-30T23:59:59",
  "allowWithPriceLevel": false,
  "active": true,
  "shopId": "uuid"
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "code": "PROMO1000",
  "discountType": "FIXED",
  "discountValue": 1000.0,
  "maxDiscountAmount": 1000.0,
  "active": true,
  "allowWithPriceLevel": false,
  "startsAt": "2026-04-11T00:00:00",
  "endsAt": "2026-04-30T23:59:59",
  "shopId": "uuid"
}
```

---

**Signature:** Backend / Frontend
