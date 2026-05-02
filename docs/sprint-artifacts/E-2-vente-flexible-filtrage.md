# Story E.2: Vente Flexible et Filtrage

Status: drafted

## Story

As a Caissier,
I want utiliser une interface rapide de filtrage et attribuer une vente à un "Client Divers" ou sans stock,
so that je puisse encaisser les clients sans friction.

## Acceptance Criteria

1. **Given** je suis dans le panier d'encaissement
   **When** je recherche un article (code, nom) ou je sélectionne un client
   **Then** le résultat apparaît instantanément, et je peux forcer la vente même si le stock indique 0 (si paramétré).

## Tasks / Subtasks

- [ ] Implémenter le filtrage d'articles par Code, Nom, et Catégorie sur le POS.
- [ ] Assigner automatiquement un "Client Divers" par défaut au démarrage d'une vente.
- [ ] Ajouter un moteur de recherche client (Nom, Email, Téléphone) au POS.
- [ ] Vérifier la configuration "autoriser vente sans stock" pour bloquer ou permettre l'ajout au panier.

## Dev Notes

- L'UX doit rester fluide (réponse < 1s). Le filtrage doit idéalement se faire côté frontend si le catalogue est préchargé, ou via une recherche backend performante.
- L'option "vente sans stock" nécessite de faire remonter le paramètre depuis les paramètres du Tenant / Boutique.

### Project Structure Notes
- S'intègre au module caisse existant.

### References
- [Source: docs/epics-mvp-improvements.md#Epic E]

## Dev Agent Record
### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
