# Story E.4: Multi-Paiement et Impression au choix

Status: drafted

## Story

As a Caissier,
I want pouvoir saisir plusieurs moyens de paiement et choisir l'imprimante (A4 ou thermique),
so that je puisse finaliser la vente selon le souhait du client.

## Acceptance Criteria

1. **Given** le montant total est défini
   **When** je saisis un montant pour l'espèce et un autre pour la carte
   **Then** la vente est clôturée.
2. **And** je peux choisir de l'imprimer au format A4 ou ticket thermique.

## Tasks / Subtasks

- [ ] Modifier la sélection du mode de paiement pour supporter les paiements combinés (liste de `{amount, method}`).
- [ ] Laisser le mode de règlement vide par défaut.
- [ ] Générer 2 vues (A4 et Ticket thermique) pour le reçu.
- [ ] Renseigner correctement tous les modes de paiement sur le reçu.

## Dev Notes

- La commande de l'API (Order / Sale endpoint) doit évoluer pour accepter une liste de paiements au lieu d'une énumération unique.
- CSS d'impression différent: `@media print` pour A4, et une version compacte fixe (ex 80mm) pour le thermique.

### References
- [Source: docs/epics-mvp-improvements.md#Epic E]

## Dev Agent Record
### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
