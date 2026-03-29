# Story E.3: Application de Prix et Promotions

Status: drafted

## Story

As a Caissier,
I want pouvoir modifier le niveau de prix ou appliquer des codes promo en caisse,
so that je puisse répondre aux offres commerciales.

## Acceptance Criteria

1. **Given** j'ai des articles dans le panier
   **When** j'applique un code promotionnel ou modifie le niveau de prix
   **Then** le total est recalculé immédiatement et la remise est affichée.

## Tasks / Subtasks

- [ ] Intégrer la logique des niveaux de prix dans l'entité Produit côté Backend/Frontend.
- [ ] Créer le flux de validation d'un Code Promotionnel dans le panier d'encaissement.
- [ ] Mettre à jour l'affichage des totaux pour inclure les remises explicites.
- [ ] Empêcher le cumul abusif selon le modèle métier.

## Dev Notes

- Il faudra exposer une API pour "Appliquer un code promo" et revérifier lors du checkout (backend).
- Vérifier la structure du modèle Product pour les paliers/niveaux.

### References
- [Source: docs/epics-mvp-improvements.md#Epic E]

## Dev Agent Record
### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
