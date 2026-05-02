# Story E.1: Ouverture, Clôture et Gestion du Reliquat

Status: drafted

## Story

As a Caissier,
I want gérer mon fond de caisse et le reliquat lors de mes ouvertures et clôtures,
so that je puisse tenir ma caisse de manière équilibrée et justifiée.

## Acceptance Criteria

1. **Given** la caisse est non ouverte
   **When** je saisis un fond de caisse et que j'ouvre la caisse
   **Then** l'ouverture est enregistrée.
2. **And** le reliquat final est calculable et transformable en moyen de règlement (avoir).

## Tasks / Subtasks

- [ ] Créer ou mettre à jour le composant d'ouverture de caisse (saisie initiale du fond de caisse).
- [ ] Adapter le processus de clôture pour le calcul du reliquat (caisse attendue vs saisie).
- [ ] Implémenter la transformation d'un reliquat client en "avoir" ou autre moyen de règlement.
- [ ] Valider que les montants (fond, reliquat) entrent dans l'audit journalier de la caisse.

## Dev Notes

- Relevant architecture patterns and constraints: Suivre l'architecture frontend Angular avec GenericFormComponent pour les formulaires.
- Source tree components to touch: `frontend/src/app/features/tenant-space/components/...`
- Testing standards summary: Vérifier que le reliquat s'ajoute bien aux avoirs sans doubler le flux financier.

### Project Structure Notes

- Alignment with unified project structure: Les routes POS doivent être sous le module Tenant ou POS.

### References

- [Source: docs/epics-mvp-improvements.md#Epic E]
- [Source: docs/prd.md]

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
