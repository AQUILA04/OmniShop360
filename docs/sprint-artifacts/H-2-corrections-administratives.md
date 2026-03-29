# Story H.2: Corrections Administratives

Status: drafted

## Story

As a Shop Admin,
I want avoir la possibilité de corriger les états de vente ou d'inventaire,
so that en cas d'erreur de saisie non rectifiable par le caissier, je puisse rééquilibrer la caisse ou le stock.

## Acceptance Criteria

1. **Given** j'ai les permissions Shop Admin
   **When** je modifie le statut d'une vente finalisée ou annule un mouvement de stock
   **Then** la base enregistre cette correction en l'attribuant à mon profil (audit).

## Tasks / Subtasks

- [ ] Ajouter une permission spéciale "Admin Override" sur l'édition des factures et du stock.
- [ ] Implémenter l'enregistrement strict en piste d'audit (AuditLog) de chaque champ avant/après correction.
- [ ] Afficher visuellement sur l'interface qu'une vente a été "Corrigée par Admin".

## Dev Notes

- La piste d'audit est cruciale pour éviter les abus ou fraudes internes. Utiliser un mécanisme global ou AOP si existant pour tracer l'entité.

### References
- [Source: docs/epics-mvp-improvements.md#Epic H]

## Dev Agent Record
### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
