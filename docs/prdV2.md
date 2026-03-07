

---

# OmniShop 360 : Product Requirements Document (PRD)

## 1. Goals and Background Context (Objectifs et Contexte)

### Goals (Objectifs)

*
**Omnicanalité Totale** : Permettre une gestion unifiée entre boutiques physiques (POS) et boutiques en ligne.


*
**Écosystème B2B** : Digitaliser la relation Fournisseur-Détaillant via un système de "Tenants Hybrides".


*
**Spécialisation Sectorielle** : Offrir des templates métiers (Pharmacie, Mode, Alimentation) pour un déploiement instantané.


*
**Souveraineté des Données & Audit** : Garantir une traçabilité totale des stocks et des prix pour prévenir la fraude.


*
**Résilience Opérationnelle** : Assurer la vente en mode "Offline-first" pour pallier l'instabilité du réseau.



### Background (Contexte)

Le commerce en Afrique évolue de l'informel vers le formel. Les outils actuels sont soit trop basiques (simples caisses), soit trop complexes (ERPs occidentaux non adaptés). OmniShop 360 comble ce fossé en proposant une plateforme capable de gérer la complexité des prix (Gros/Détail), les réalités logistiques (fournisseurs externes via WhatsApp) et la synchronisation multi-boutiques.

### Change Log (Journal des modifications)

| Date | Version | Description | Auteur |
| --- | --- | --- | --- |
| 2024-03-20 | 1.0 | MVP Initial (Backlog Sprints 1-4) | Team Fullstack |
| 2025-05-15 | 2.0 | Version Opérationnelle (B2B, Multi-prix, Offline) | Peter (PM) |

---

## 2. Requirements (Exigences)

### Functional (Fonctionnel)

*
**FR1 : Gestion Multi-Tenant Hybride** : Un compte entreprise peut être Détaillant, Fournisseur ou les deux.


*
**FR2 : Moteur de Prix à 3 Niveaux** : Application automatique des prix Détail, Demi-gros et Gros selon les quantités.


*
**FR3 : Cycle d'Approvisionnement B2B** : Flux natif Bon de Commande (BC) -> Bon de Livraison (BL) -> Bon de Réception (BR) entre Tenants.


*
**FR4 : Templates de Catalogues** : Injection automatique de produits types par secteur à la création d'une boutique.


*
**FR5 : Point de Vente (POS) Offline** : Encaissement possible sans internet avec synchronisation en arrière-plan.


*
**FR6 : Export Logistique Externe** : Génération de BC en PDF/Image pour envoi aux fournisseurs hors-réseau (via WhatsApp/Email).



### Non Functional (Non Fonctionnel)

*
**NFR1 : Isolation Multi-Tenant** : Étanchéité absolue des données entre Tenants via Row-Level Security (RLS).


*
**NFR2 : Performance POS** : Ajout au panier en moins d'une seconde, même avec 10 000 SKUs en local.


*
**NFR3 : Sécurité des Coûts** : Seuls les admins voient le Prix de Revient Moyen Pondéré (PRMP).



---

## 3. User Interface Design Goals (Objectifs UI/UX)

*
**Overall UX Vision** : Une interface "zéro friction" privilégiant le tactile et le scan code-barre pour les opérations de terrain.


*
**Interaction Paradigms** : Utilisation du "Smart Pricing" (alertes de paliers de prix dans le panier).


* **Core Screens** :
* Terminal POS (Tablette/Desktop).
* Dashboard Provider (Gestion des commandes B2B).
* Boutique Mobile Client (E-commerce progressif).


*
**Target Platforms** : Web Responsive pour l'admin, Tablette pour le POS, Mobile pour les clients finaux.



---

## 4. Technical Assumptions (Hypothèses Techniques)

*
**Repository Structure** : Monorepo pour une cohérence maximale entre les modules.


*
**Service Architecture** : Monolithe Modulaire sous **Spring Boot 3**.


*
**Database** : **PostgreSQL** avec usage intensif du type **JSONB** pour les attributs de produits dynamiques.


*
**Frontend** : **Angular 16+** transformé en PWA pour le mode Offline.


*
**Sécurité** : Keycloak pour l'Identity Access Management (IAM).



---

## 5. Epic List (Liste des Epics)

*
**Epic 1 : Fondations Multi-Tenant** : Onboarding des entreprises et isolation des données.


*
**Epic 2 : Catalogue & Pricing Engine** : Gestion des matrices de prix et des templates sectoriels.


*
**Epic 3 : Procurement & Écosystème B2B** : Flux de commandes inter-tenants et export WhatsApp.


*
**Epic 4 : Ventes Omnicanales (POS/Web)** : Moteur de vente transactionnel et boutique en ligne.


*
**Epic 5 : Stock & Audit Opérationnel** : Inventaires tournants et traçabilité des mouvements.



---

## 6. Epic Details (Détails des Epics)

### Epic 2 : Catalogue & Pricing Engine

**Goal**: Permettre aux commerçants de configurer leurs produits avec une logique de prix complexe sans effort technique.

* **Story 2.1 : Injection de Template**
* As a **Tenant Admin**, I want to select my business sector (ex: Pharmacy) so that my catalog is pre-filled with common products.


*
**AC** : Les catégories et 100 produits de base sont créés à l'initialisation.




* **Story 2.2 : Matrice de Prix de Gros**
* As a **Shop Admin**, I want to define bulk price thresholds (6 units, 12 units) so that my revenue increases with volume.


*
**AC** : Le système applique le prix correct en temps réel dans le panier.





### Epic 3 : Procurement & B2B

**Goal**: Automatiser l'approvisionnement pour réduire les ruptures de stock.

* **Story 3.1 : Bon de Commande Inter-Tenant**
* As a **Retailer**, I want to order from a **Provider** on the platform so that my stock is updated automatically upon reception.




* **Story 3.2 : Commande Hors-Réseau**
* As a **Retailer**, I want to export a PO for a non-platform supplier so that I can send it via WhatsApp.





---
