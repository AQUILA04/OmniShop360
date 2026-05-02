---

# Sprint 4 Backlog - Analytics, Reporting & Sécurité Avancée

**Objectif du Sprint :** Offrir une visibilité complète sur les performances commerciales via des tableaux de bord dynamiques et consolider la sécurité des données sensibles.

---

## User Stories (US)

### Epic: Business Intelligence & Reporting

| ID | User Story | Rôle | Priorité | Points | Dépendances |
| --- | --- | --- | --- | --- | --- |
| **US-015** | En tant que **Shop Admin**, je veux voir le **Chiffre d'Affaires (CA)** du jour en temps réel sur mon tableau de bord. | Admin | 🔴 Must | 5 | Sprint 3 |
| **US-016** | En tant que **Tenant Admin**, je veux consulter un rapport comparatif des ventes par boutique pour identifier les plus performantes. | Tenant | 🟡 Should | 8 | US-015 |
| **US-017** | En tant qu'**Utilisateur**, je veux exporter mes rapports de ventes au format **PDF/Excel** pour ma comptabilité. | Tous | 🟢 Could | 5 | US-016 |

### Epic: Sécurité & Audit (Partie D - Technique)

| ID | User Story | Rôle | Priorité | Points | Dépendances |
| --- | --- | --- | --- | --- | --- |
| **US-018** | En tant que **Responsable Sécurité**, je veux que les données sensibles (clés, secrets) soient gérées via un **KMS/HSM** pour garantir leur intégrité. | Sécurité | 🔴 Must | 8 | Infra |
| **US-019** | En tant qu'**Auditeur**, je veux consulter les **journaux d'accès (Audit Logs)** pour savoir qui a modifié les stocks ou annulé une vente. | Admin | 🟡 Should | 5 | Sprint 3 |

---

## Tâches Techniques (Sprint 4)

### 🔧 Backend (Spring Boot)

#### **Moteur de Reporting**

1. **[Task-BE-18]** Créer des requêtes SQL agrégées (JPQL/Native) pour calculer le CA par jour, semaine et mois.
2. **[Task-BE-19]** Implémenter un service d'exportation (utilisant des librairies comme *JasperReports* ou *Apache POI*).
3. **[Task-BE-20]** Créer des endpoints `GET /api/v1/analytics/summary` filtrables par `shop_id` et période.

#### **Sécurité Avancée (Spécifications Partie D)**

4. **[Task-BE-21]** Intégrer **HashiCorp Vault** (ou AWS KMS) pour la gestion des secrets et des clés de chiffrement des données au repos.
5. **[Task-BE-22]** Implémenter Spring Data Envers ou un `@EntityListener` pour capturer l'historique de toutes les modifications sur les tables `Stock` et `Sale`.

### 🎨 Frontend (Angular)

#### **Dashboard & Data Viz**

1. **[Task-FE-27]** Intégrer une librairie de graphiques (ex: **Ngx-charts** ou **Chart.js**).
2. **[Task-FE-28]** Créer le composant `DashboardComponent` : Cartes de synthèse (CA, Nombre de ventes, Articles phares).
3. **[Task-FE-29]** Développer des graphiques linéaires pour l'évolution des ventes et des graphiques à secteurs pour la répartition par catégorie.

#### **Filtres et Exports**

4. **[Task-FE-30]** Créer un panneau de filtres globaux (Sélecteur de date, Sélecteur de boutique).
5. **[Task-FE-31]** Ajouter les boutons d'exportation sur les tableaux de données.

---

## Focus Technique : Approche de Sécurité (HSM/KMS)

Pour répondre aux exigences de la Partie D, l'architecture doit suivre ces principes :

* **Principe du moindre privilège :** Le backend utilise des identités éphémères pour accéder au KMS.
* **Chiffrement Enveloppe (Envelope Encryption) :** Utilisation d'une *Master Key* dans le HSM pour chiffrer les *Data Encryption Keys* (DEK) qui protègent les données de vente.
* **Utilisation d'Open Source :** Priorité à l'intégration de **HashiCorp Vault** pour la gestion des secrets en environnement conteneurisé.

---

## Définition de "Fini" (Definition of Done)

* [ ] Les chiffres du Dashboard correspondent exactement aux transactions en base de données.
* [ ] Les graphiques sont responsives (mobiles/tablettes).
* [ ] Aucun secret (mot de passe BD, clés API) n'est stocké en clair dans les fichiers de config (passage par Vault/KMS).
* [ ] Les rapports exportés sont lisibles et correctement formatés.

---