# Story G.1: Mouvements de Stock et Actualisation

Status: drafted

## Story

As a Gestionnaire de Stock,
I want enregistrer précisément les entrées/sorties et effectuer des sondages,
so that le stock reflète fidèlement la réalité de la boutique.

## Acceptance Criteria

1. **Given** une réception ou un inventaire ponctuel
   **When** je fais un mouvement manuel ou importe une quantité
   **Then** le stock est actualisé instantanément.
2. **And** je peux définir la DLV (Date Limite de Validité) du lot.

## Tasks / Subtasks

- [ ] Adapter l'entité Produit/Stock pour gèrer la DLV.
- [ ] Créer une interface pour les ajustements de stock (Entrées manuelles / Sorties pour perte).
- [ ] Implémenter le processus d'inventaire complet et de "sondage" par sélection d'articles.
- [ ] Loguer chaque mouvement dans un historique (Product Audit/Movement).

## Dev Notes

- La structure du stock nécessite de gérer des "lots" (batches) de produits si l'on veut respecter les DLV différentes pour un même produit.

### References
- [Source: docs/epics-mvp-improvements.md#Epic G]

## Dev Agent Record
### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
