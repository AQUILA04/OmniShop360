# Contrat API - Cash Register Session Controller

**Version:** 1.1.0  
**Date de création:** 2026-04-11  
**Dernière modification:** 2026-04-11  
**Responsable Backend:** À définir  
**Responsable Frontend:** À définir

---

## Changelog

| Version | Date | Auteur | Modifications |
|:---|:---|:---|:---|
| 1.0.0 | 2026-04-11 | AI Developer | Contrat initial ouverture/clôture de caisse |
| 1.1.0 | 2026-04-11 | AI Developer | Retrait génération automatique d’avoir à la clôture, ajout endpoint dédié de génération de reliquat |

---

## Endpoints

### 1. Ouvrir une caisse
- **Endpoint:** `POST /api/v1/cash-register-sessions/open`
- **Rôles:** `tenant_admin`, `shop_admin`, `cashier`

### 2. Clôturer une caisse
- **Endpoint:** `POST /api/v1/cash-register-sessions/close`
- **Rôles:** `tenant_admin`, `shop_admin`, `cashier`
- **Comportement v1.1:** calcule et enregistre le reliquat, sans générer automatiquement un avoir.

### 3. Générer un reliquat (avoir) manuellement
- **Endpoint:** `POST /api/v1/cash-register-sessions/remainder-vouchers`
- **Rôles:** `tenant_admin`, `shop_admin`, `cashier`
- **Body:**
```json
{
  "cashRegisterSessionId": "uuid",
  "amount": 1200.00,
  "customerId": "uuid"
}
```
- **Règles:** session ouverte ou clôturée, montant explicite > 0, isolation tenant/boutique.

### 4. Lister les sessions de caisse
- **Endpoint:** `GET /api/v1/cash-register-sessions`
- **Rôles:** `tenant_admin`, `shop_admin`, `cashier`

---

**Signature:** Backend / Frontend
