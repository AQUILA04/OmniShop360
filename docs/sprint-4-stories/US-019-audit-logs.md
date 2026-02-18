# User Story Details : US-019 - Journaux d'Audit (Audit Logs)

## Description
Assurer la traçabilité de toutes les actions sensibles (modification de stock manuel, annulation de vente, changement de prix).

## Spécifications Techniques (Backend)
- **Outil :** Hibernate Envers.
- **Fonctionnement :** Création automatique de tables `_AUD` (ex: `product_aud`, `stock_entry_aud`).
- **Attributs capturés :**
    - `user_id` (Qui ?)
    - `timestamp` (Quand ?)
    - `action_type` (Quoi ? CREATE, UPDATE, DELETE)
    - `old_value` / `new_value`.

## Interface Admin
- Une table de log avec recherche par date et par utilisateur.
- Lecture seule (aucune modification possible des logs).

## Critères d'Acceptation
1. Chaque modification manuelle du stock génère une entrée d'audit.
2. L'accès aux logs est restreint au rôle `SUPER_ADMIN` ou `TENANT_ADMIN`.