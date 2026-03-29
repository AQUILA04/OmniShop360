# Story G.2: Alertes et Multi-Emplacements

Status: drafted

## Story

As a Gestionnaire de Stock,
I want diviser le stock (Magasin/Expo/Dépôt) et voir des alertes pour le stock minimum,
so that je ne suis jamais en rupture et je sais où se trouve la marchandise.

## Acceptance Criteria

1. **Given** la gestion d'emplacements est activée
   **When** je consulte le stock
   **Then** je vois quelle quantité est allouée à l'Expo vs le Dépôt.
2. **And** les items en alertes (stock < min) apparaissent en rouge ou dans une liste dédiée.

## Tasks / Subtasks

- [ ] Créer le concept d'`Emplacement` de stock (Location) lié à une Boutique.
- [ ] Mettre à jour l'affichage des stocks pour détailler les montants par emplacement.
- [ ] Ajouter une propriété `min_stock` au produit ou stock pour générer les seuils d'alerte.
- [ ] Créer un composant ou un widget dashboard listant les produits proches de la rupture ou en rupture.

## Dev Notes

- Relation `Product` -> `Stock` -> `Location`.
- La somme des stocks de tous les emplacements de la boutique définit le stock disponible total.

### References
- [Source: docs/epics-mvp-improvements.md#Epic G]

## Dev Agent Record
### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
