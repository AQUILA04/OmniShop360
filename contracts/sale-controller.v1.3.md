# Contrat API - Sale Controller

**Version:** 1.3.0  
**Date de création:** 2025-01-24  
**Dernière modification:** 2026-04-11  
**Responsable Backend:** À définir  
**Responsable Frontend:** À définir

---

## Changelog

| Version | Date | Auteur | Modifications |
|:---|:---|:---|:---|
| 1.2.0 | 2026-04-11 | AI Developer | Vente flexible et filtrage |
| 1.3.0 | 2026-04-11 | AI Developer | Ajout promo code, niveau de prix, validation promo |

---

## Endpoints ajoutés / mis à jour

### 1. Validation promotion
- **Endpoint:** `GET /api/v1/sales/promotions/validate`
- **Query params:** `code` (string), `subtotal` (number)

**Response 200:**
```json
{
  "code": "PROMO10",
  "discountAmount": 500.0
}
```

### 2. Checkout (extension)
- **Endpoint:** `POST /api/v1/sales/checkout`
- **Nouveaux champs request:**
  - `promoCode` (string, optionnel)
  - `items[].priceLevel` (`BASE`, `LEVEL_1`, `LEVEL_2`, `LEVEL_3`)
- **Nouveaux champs response:**
  - `promoCode`
  - `promoDiscountAmount`

---

**Signature:** Backend / Frontend
