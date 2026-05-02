# Revue de code Sprint 4 Backend (Architect)

**Date:** 2025-02-21  
**Périmètre:** Analytics, Export, Audit Logs, Vault (US-015 à US-019, V-018)

## Cohérence architecture

- **Alignement avec l’existant:** Réutilisation de `Pageable`, `PageResponse`, `UserContextService`, `SecurityUtils`, DTOs en records, pattern Controller → Service → Repository. Pas de nouveau style ni de couche superflue.
- **Placement des composants:** Analytics et Export dans `AnalyticsController` pour limiter les contrôleurs. Audit dans un contrôleur dédié (volume et rôles différents). Services et DTOs dans les packages habituels.
- **Séparation des responsabilités:** Export (PDF/Excel) isolé dans `ExportService`; agrégations dans `AnalyticsService`; lecture Envers dans `AuditLogService`. Rôles et isolation tenant gérés au bon niveau.

## Sécurité

- **Contrôle d’accès:** `@PreAuthorize` cohérent avec les rôles (tenant_admin, shop_admin, cashier pour analytics/export; superadmin, tenant_admin pour audit). Aucun endpoint sensible exposé sans rôle.
- **Isolation tenant:**  
  - Analytics/Export: `UserContextService.getCurrentUserTenantId()` et, pour shop_admin, `getCurrentUserShopId()` imposé.  
  - Audit: `tenantId` issu du contexte pour tenant_admin; pour superadmin, `tenantId` optionnel en paramètre. Pas de contournement identifié.
- **Vault:** Config dans `bootstrap.yml`, activée uniquement si `VAULT_ENABLED` (ou équivalent) et credentials fournis. Dev sans Vault inchangé (`spring.cloud.vault.enabled: false` en dev).

## Maintenabilité

- **Lisibilité:** DTOs en records, noms explicites, peu de commentaires superflus. Requêtes natives dans `AuditLogService` construites par concaténation de fragments; à long terme, une extraction en méthodes (ex. construction de la clause `WHERE`) pourrait réduire la complexité perçue.
- **Évolutivité:** Ajout d’un nouveau type d’entité audité = nouveau fragment SQL + constante dans `AuditLogService`. Ajout d’un format d’export = nouvelle branche dans `ExportService`. Extension analytics possible via nouveaux DTOs et requêtes dans `SaleRepository`.
- **Tests:** Services et contrôleurs couverts par tests unitaires et d’intégration; mocks utilisés de façon cohérente (UserContextService, SecurityUtils en static mock).

## Régressions

- **Code existant:** Aucune modification d’indentation ou de formatage sur l’existant. Seuls des ajouts (annotations `@Audited` / `@NotAudited`, champs Envers) et de nouveaux fichiers.
- **Comportement:** Règles métier et rôles des ventes, stocks, utilisateurs et clients inchangés. Nouveaux endpoints uniquement en lecture (sauf appel indirect à l’export, qui reste côté serveur).
- **Base de données:** Migration Flyway V5 additive (tables `revision_info`, `*_aud`). Pas de changement sur les tables existantes.

## Recommandations

1. **Audit:** Si le volume de révisions augmente, envisager un index (ex. `(tenant_id, revtstmp)`) sur `revision_info` et/ou une stratégie d’archivage des anciennes révisions.
2. **Export:** La limite à 10 000 lignes est documentée dans le contrat; à conserver ou à rendre configurable si les besoins évoluent.
3. **Vault:** Documenter en détail (README ou runbook) l’activation en production (variables, profil, AppRole) pour éviter les erreurs de configuration.

**Verdict:** Implémentation conforme au plan, alignée avec l’architecture et les règles du projet. Aucun blocant identifié pour une mise en production après validation métier et déploiement.
