# Project Brief : OmniShop 360 (SaaS Multi-Tenant Retail)

## 1. Résumé Exécutif (Executive Summary)
**OmniShop 360** est une plateforme SaaS B2B de gestion de commerce unifiée, conçue pour les réseaux de boutiques et franchises. Elle offre une architecture multi-tenant stricte garantissant une **gouvernance centralisée** (Vue 360°, catalogue unifié) et une **autonomie opérationnelle** locale (stocks, ventes). Sa proposition de valeur réside dans sa capacité à piloter la marge et à optimiser les opérations.

## 2. Définition du Problème (Problem Statement)
* **Silos de données :** Manque de vision temps réel des performances et des stocks consolidés.
* **Gestion utilisateurs chaotique :** Difficulté à gérer les permissions (RBAC) entre le siège (Tenant) et les points de vente (Boutiques).
* **Manque de pilotage stratégique :** Difficulté à calculer et analyser la Marge Brute en temps réel par manque d'intégration des coûts d'achat.

## 3. Solution Proposée (Proposed Solution)
* **Architecture Hybride :** Catalogue produit "Maître" géré par le Tenant, avec gestion stricte du stock local par les Boutiques.
* **Sécurité des Données (Data Isolation) :** Isolation stricte des données par boutique pour les opérationnels.
* **POS Vendeur Augmenté :** Interface de caisse ultra-rapide, mobile-friendly.
* **BI Orientée Marge :** Consolidation automatique des données de ventes et de coûts pour un rapport de Marge Brute en temps réel, réservé au niveau Tenant.

## 4. Utilisateurs Cibles (Target Users)
| Rôle | Niveau d'Accès | Focus |
| :--- | :--- | :--- |
| **Tenant Admin** | Global (360°) | Gouvernance, Stratégie, Prix Maître, Marge. |
| **Comptable Tenant** | Global (Lecture seule + Export) | Consolidation des ventes et de la TVA. |
| **Shop Admin (Gérant)** | Local (Sa Boutique uniquement) | Gestion du personnel, stock local, rapports de boutique. |
| **Caissier (Vendeur)** | Local (POS uniquement) | Vente et encaissement rapide. |
| **Gestionnaire de Stock** | Local (Inventaire uniquement) | Réception de marchandises et inventaires. |

## 5. Objectifs & Indicateurs de Succès (Goals & Metrics)
* **Objectifs Business :** Mieux piloter la marge brute agrégée.
* **Métriques Utilisateurs :** Temps de passage en caisse < 30 secondes.

## 6. Périmètre MVP (MVP Scope)
* **Administration :** Création de Tenant et sous-boutiques, Rôles hiérarchiques (RBAC).
* **Catalogue/Stock :** Catalogue global (Tenant) vs Stock local (Boutique). Gestion des Prix d'Achat/Vente. Entrées/Sorties de stock de base.
* **Opérations :** Point de Vente (POS) Web, Paiement, Gestion des tickets.
* **Rapports :** Dashboard de CA consolidé, Rapport de Marge Brute (Tenant only).

## 7. Considérations Opérationnelles Clés
* **Politique de Prix :** Paramétrable par le Tenant Admin (Imposé Global ou Forçable Local).
* **Retours Produits :** Non-cross-boutiques. Les retours ne sont possibles que dans la boutique d'achat.

## 8. Considérations Techniques
* **Stack :** Backend Spring Boot, Frontend Angular.
* **Sécurité :** Utilisation de Keycloak pour la gestion des rôles (RBAC) et application obligatoire de la Row-Level Security (RLS) via le `tenant_id` et `shop_id`.
