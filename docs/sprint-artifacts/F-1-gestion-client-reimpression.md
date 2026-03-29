# Story F.1: Gestion Clientèle Rapide et Réimpression

Status: drafted

## Story

As an Admin Boutique ou Caissier,
I want rechercher des factures passées ou des clients pour modifications rapides,
so that je puisse éditer un duplicata ou maintenir la base client à jour.

## Acceptance Criteria

1. **Given** je suis sur le back-office de la boutique
   **When** je recherche une facture par ID ou un client par numéro
   **Then** je peux imprimer de nouveau le document ou modifier la fiche du client.

## Tasks / Subtasks

- [ ] Ajouter un écran de recherche des factures récentes sur le POS/Back-Office.
- [ ] Connecter le bouton d'impression d'une ancienne facture (reprint).
- [ ] Ajouter ou optimiser un formulaire rapide pour créer/modifier un client sans sortir du flux.
- [ ] Vérifier la sécurité (accès limité aux factures/clients de la boutique courante).

## Dev Notes

- Un duplicata doit être clairement estampillé "DUPLICATA".
- Les listes doivent utiliser `BaseListComponent` comme demandé dans les Frontend Rules.

### Project Structure Notes
- Composants de formulaires clients via `GenericFormComponent`.

### References
- [Source: docs/epics-mvp-improvements.md#Epic F]

## Dev Agent Record
### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
