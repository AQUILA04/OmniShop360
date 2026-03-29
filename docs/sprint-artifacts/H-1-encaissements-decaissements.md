# Story H.1: Encaissements et Décaissements

Status: drafted

## Story

As a Shop Admin,
I want enregistrer les recettes et dépenses de ma boutique en générant des justificatifs,
so that la caisse finale intègre bien le flux de trésorerie hors ventes pures.

## Acceptance Criteria

1. **Given** une dépense locale (ex: fourniture)
   **When** je saisis un décaissement
   **Then** un mouvement de caisse est créé avec son document justificatif.

## Tasks / Subtasks

- [ ] Créer une entité/modèle pour les Operations de Caisse (CashFlow).
- [ ] Interface de saisie de dépense/recette avec motif, montant et intervenant.
- [ ] Générer un justificatif imprimable pour le décaissement (PDF ou ticket).
- [ ] Intégrer ces flux dans le solde final de la caisse à la clôture.

## Dev Notes

- Le calcul de clôture devient : Fond initial + Ventes(Espèces) - Décaissements + Encaissements = Solde Espèces Attendu.

### References
- [Source: docs/epics-mvp-improvements.md#Epic H]

## Dev Agent Record
### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
