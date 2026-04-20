# Contrat API - Sale Controller

**Version:** 1.4.0  
**Date de création:** 2025-01-24  
**Dernière modification:** 2026-04-11  
**Responsable Backend:** À définir  
**Responsable Frontend:** À définir

---

## Changelog

| Version | Date | Auteur | Modifications |
|:---|:---|:---|:---|
| 1.3.0 | 2026-04-11 | AI Developer | Promotions et niveaux de prix |
| 1.4.0 | 2026-04-11 | AI Developer | Multi-paiement, voucher code et impression A4/thermique |

---

## Endpoints ajoutés / mis à jour

### 1. Checkout (extension multi-paiement)
- **Endpoint:** `POST /api/v1/sales/checkout`
- **Nouveaux champs request:**
  - `payments`: liste de `{ "method": "CASH|CARD|MOBILE|VOUCHER", "amount": number, "reference": string }`
  - `voucherCode` (optionnel)
- **Compatibilité:** `paymentMethod` reste accepté pour un paiement unique.
- **Nouveaux champs response:**
  - `payments`
  - `voucherCode`
  - `voucherAmount`
  - `cashRegisterSessionId`

### 2. Données d'impression reçu
- **Endpoint:** `GET /api/v1/sales/{saleId}/receipt`
- **Query params:** `format` (`THERMAL` par défaut, ou `A4`)

**Response 200:**
```json
{
  "format": "THERMAL",
  "sale": {
    "id": "uuid",
    "payments": [
      { "method": "CASH", "amount": 2000.0 },
      { "method": "CARD", "amount": 3500.0 }
    ]
  }
}
```

---

**Signature:** Backend / Frontend
