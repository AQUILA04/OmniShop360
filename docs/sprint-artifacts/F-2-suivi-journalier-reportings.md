# Story F.2: Suivi Journalier et Reportings

Status: drafted

## Story

As an Admin Boutique,
I want consulter mon inventaire et les transactions de paiement de la journée avant de clôturer,
so that je puisse repérer une erreur de caisse.

## Acceptance Criteria

1. **Given** des ventes ont eu lieu
   **When** j'accède à la section des transactions
   **Then** un tableau de bord récapitule les paiements par mode et l'inventaire journalier (téléchargeables).

## Tasks / Subtasks

- [ ] Créer une vue (dashboard ou liste) pour les transactions de la journée, filtrée pour la caisse courante (ou la boutique).
- [ ] Calculer l'inventaire journalier (entrées/sorties du jour).
- [ ] Ajouter des agrégations par méthode de paiement (ex: Total Espèces, Total CB).
- [ ] Mettre en place la fonction d'export (CSV ou PDF).

## Dev Notes

- Privilégier des requêtes SQL backend optimisées (`@Query`) pour ne pas surcharger la mémoire du serveur Node/Java si les factures sont nombreuses.

### References
- [Source: docs/epics-mvp-improvements.md#Epic F]

## Dev Agent Record
### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
