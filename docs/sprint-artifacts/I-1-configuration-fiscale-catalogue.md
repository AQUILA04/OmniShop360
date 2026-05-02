# Story I.1: Configuration Fiscale et Catalogue

Status: drafted

## Story

As a Tenant Admin,
I want paramétrer des taux de taxe spécifiques par boutique et créer des catalogues modèles (Templates),
so that je sois conforme selon la localisation et je puisse dupliquer rapidement mon offre.

## Acceptance Criteria

1. **Given** le panneau Tenant Admin
   **When** je configure la boutique X ou crée un catalogue modèle
   **Then** le POS de la boutique X applique les bonnes taxes sur ses produits et la boutique Y peut hériter du modèle de catalogue choisi.

## Tasks / Subtasks

- [ ] Adapter le service de taxes (TaxService) pour prendre en compte les surcharges locales de la boutique.
- [ ] Ajouter un écran de paramétrage des Taxes par boutique dans le panneau d'admin Tenant.
- [ ] Créer la notion de 'Catalogue Template' permettant à une nouvelle boutique d'importer une structure de catégories/produits.
- [ ] Mettre en place un Endpoint 'Import from Template' lors de la création de la boutique.

## Dev Notes

- Côté base de données, les taxes peuvent être définies au niveau Tenant, mais la configuration au niveau Shop prime toujours.

### References
- [Source: docs/epics-mvp-improvements.md#Epic I]

## Dev Agent Record
### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
