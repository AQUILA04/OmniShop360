# Product Requirements Document (PRD) : OmniShop 360

## 1. Structure de Rôles (RBAC)
(Voir tableau des rôles dans le Brief. L'accès aux fonctionnalités est régi par ces rôles.)

## 2. User Stories du MVP

### A. Administration Tenant & Multi-Tenant (Focus : Tenant Admin)
| ID | User Story | Critères d'Acceptation |
| :--- | :--- | :--- |
| **A.1** | En tant que **Tenant Admin**, je peux créer, activer et désactiver de nouvelles **Boutiques** afin d'étendre mon réseau. | L'ID de boutique est généré, et l'adresse est enregistrée. |
| **A.2** | En tant que **Tenant Admin**, je peux créer un **Shop Admin** et l'associer uniquement à sa boutique pour garantir la sécurité des données. | L'utilisateur Shop Admin est géré par Keycloak et ne doit pas voir les données des autres boutiques. |
| **A.3** | En tant que **Tenant Admin**, je peux paramétrer la **politique de prix** (Imposé Global ou Forçable Local) pour contrôler ma marge. | Un paramètre est persistant en base de données et est respecté par le POS. |

### B. Gestion du Catalogue, Coûts et Inventaire
| ID | User Story | Critères d'Acceptation |
| :--- | :--- | :--- |
| **B.1** | En tant que **Tenant Admin**, je peux créer un produit dans le **Catalogue Maître** avec son prix de référence et ses variantes. | La modification d'un produit maître n'affecte pas le stock avant une action de synchronisation. |
| **B.2** | En tant que **Gestionnaire de Stock**, je peux enregistrer une **Réception de Marchandises** dans ma boutique pour mettre à jour mon stock local. | Le stock de la boutique augmente, et l'historique est tracé. |
| **B.3** | En tant que **Tenant Admin**, je peux visualiser le **Stock Agrégé** de toutes les boutiques et le stock de chaque boutique individuellement. | Un tableau de bord montre la somme totale des produits en stock sur l'ensemble du Tenant. |
| **B.4** | En tant que **Tenant Admin**, je peux renseigner le **Prix d'Achat (Coût)** de chaque produit dans le Catalogue Maître pour permettre le calcul de la marge. | L'historique des coûts doit être tracé. |
| **B.5** | En tant que **Gestionnaire de Stock**, lors d'une réception, le système utilise par défaut le prix d'achat maître pour valoriser le stock entrant. | Une option de surcharge (avec justification) du coût réel d'acquisition doit exister. |

### C. Point de Vente (POS) Opérationnel
| ID | User Story | Critères d'Acceptation |
| :--- | :--- | :--- |
| **C.1** | En tant que **Caissier**, je peux scanner un produit et l'ajouter au panier rapidement. | L'ajout du produit au panier doit prendre < 1 seconde. |
| **C.2** | En tant que **Caissier**, je peux enregistrer un paiement (espèces, carte) et imprimer un reçu. | Le stock local est décrémenté immédiatement. |
| **C.3** | En tant que **Caissier**, je peux effectuer un **Retour de Produit** uniquement si l'achat a été fait dans ma boutique. | Un message d'erreur clair est affiché si le reçu provient d'une autre boutique. |
| **C.4** | En tant que **Caissier**, je peux associer un client à la vente. |

### D. Business Intelligence (BI) et Comptabilité
| ID | User Story | Critères d'Acceptation |
| :--- | :--- | :--- |
| **D.1** | En tant que **Tenant Admin**, je peux visualiser un **Tableau de Bord de Performance** comparatif de mes boutiques. | Les données sont agrégées et actualisées au moins toutes les heures. |
| **D.2** | En tant que **Comptable Tenant**, je peux exporter les **Données de Vente Consolidées** (CA, TVA, Méthode de Paiement) dans un format standard (CSV/Excel). | L'export couvre toutes les boutiques et les données validées. |
| **D.3** | En tant que **Tenant Admin** ou **Comptable Tenant**, je peux visualiser un **Rapport de Marge** consolidé (CA - Coût des ventes). | Le rapport affiche le CA total, le Coût des ventes (COGS), et la Marge Brute (€ et %). Accès refusé aux rôles Shop. |
