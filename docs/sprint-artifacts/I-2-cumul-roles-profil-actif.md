# Story I.2: Cumul des rôles et profil actif

Status: drafted

## Story

As a Tenant Admin / Superadmin,
I want attribuer divers rôles (Caissier, Admin Boutique...) à un même utilisateur,
so that l'utilisateur puisse choisir sous quelle identité de rôle il se connecte sans créer de doubles comptes.

## Acceptance Criteria

1. **Given** un utilisateur possède 2 rôles ou plus
   **When** il se connecte
   **Then** le système lui demande de choisir le rôle actif et l'interface s'adapte en fonction sans conflit de permissions.

## Tasks / Subtasks

- [ ] Connecter Keycloak pour accepter des listes de rôles sur l'utilisateur.
- [ ] Implémenter une page/modal "Choix du Profil Actif" après le login réussie pour les utilisateurs multi-rôles.
- [ ] Stoker le `active_role` dans le Frontend State (ex: localStorage, NgRX).
- [ ] Ajouter un menu déroulant ou bouton dans la Navigation (Header) pour "Changer de Rôle" à la volée.

## Dev Notes

- Assurez-vous que le composant de navigation conditionne ses liens selon le `active_role` plutôt que la liste complète `roles`.
- Les permissions backend basées sur le JWT resteront les mêmes s'il contient tous les rôles, ou bien le front devra envoyer un header/claim spécifique pour signaler au back-end "j'agis en tant que X".

### References
- [Source: docs/epics-mvp-improvements.md#Epic I]

## Dev Agent Record
### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
