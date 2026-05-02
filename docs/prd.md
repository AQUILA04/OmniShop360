# Product Requirements Document (PRD) : OmniShop 360

## 1. Structure de Rôles (RBAC)

| Rôle | Description | Permissions Clés |
| :--- | :--- | :--- |
| **Superadmin** | Administrateur global de la plateforme. | - Créer des `tenants`.<br>- Créer des `Tenant Admins`.<br>- Configurer les paramètres globaux de l'application. |
| **Tenant Admin** | Administrateur d'un tenant (une entreprise). | - Gérer les `boutiques` (créer, activer, désactiver).<br>- Gérer les `Shop Admins`.<br>- Gérer le `Catalogue Maître` et les politiques de prix.<br>- Accéder aux rapports de BI consolidés. |
| **Shop Admin** | Administrateur d'une boutique spécifique. | - Gérer le personnel de sa boutique (`Caissiers`, `Gestionnaires de Stock`).<br>- Gérer les paramètres de sa boutique. |
| **Gestionnaire de Stock** | Employé responsable de la gestion des stocks. | - Gérer les réceptions de marchandises.<br>- Gérer les inventaires. |
| **Caissier** | Employé responsable des ventes. | - Utiliser le Point de Vente (POS) pour enregistrer les ventes et les retours. |
| **Comptable Tenant** | Employé responsable de la comptabilité du tenant. | - Exporter les données de vente consolidées.<br>- Accéder aux rapports de marge. |


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

## 3. Nouvelles Epics & Améliorations MVP

### E. Caisse Avancée & Opérations de Vente (Point de Vente)
| ID | User Story | Critères d'Acceptation |
| :--- | :--- | :--- |
| **E.1** | En tant que **Caissier**, je peux gérer l'ouverture et la clôture de caisse avec le fond de caisse et le reliquat. | Le reliquat est calculable et utilisable comme avoir/règlement. |
| **E.2** | En tant que **Caissier**, je bénéficie d'une interface de vente fluide avec filtrages (code, nom, catégorie) et un client par défaut (Divers) modifiable. | Autorisation (configurable) de vendre sans stock. Recherche client par Nom, Email ou Tel. |
| **E.3** | En tant que **Caissier**, je peux appliquer des prix promotionnels, un niveau de prix ou des codes promo sur ma vente. | Modification immédiate du total. |
| **E.4** | En tant que **Caissier**, je peux choisir et accumuler divers moyens de paiement (champ vide par défaut). | Le reçu indique les modes de règlement exacts. |
| **E.5** | En tant que **Caissier**, je peux imprimer une facture au format A4 ou au format ticket thermique selon le besoin. | |

### F. Back-Office Boutique & Opérations Administratives
| ID | User Story | Critères d'Acceptation |
| :--- | :--- | :--- |
| **F.1** | En tant que **Caissier / Admin**, je peux réimprimer une facture existante (duplicata). | |
| **F.2** | En tant que **Caissier / Admin**, je peux créer rapidement ou modifier un client. | |
| **F.3** | En tant qu'**Admin Boutique**, je peux consulter l'inventaire et les transactions de la journée depuis la caisse. | Possibilité de télécharger ces transactions. |
| **F.4** | En tant qu'**Admin Boutique**, je peux éditer un journal des paiements et le consulter avant clôture. | |

### G. Gestion Avancée des Stocks & Multi-emplacements
| ID | User Story | Critères d'Acceptation |
| :--- | :--- | :--- |
| **G.1** | En tant que **Gestionnaire de Stock**, je peux enregistrer et tracer les entrées/sorties et mouvements de stocks. | |
| **G.2** | En tant que **Gestionnaire de Stock**, je peux effectuer des inventaires complets ou ponctuels (sondage). | |
| **G.3** | En tant que **Gestionnaire de Stock**, je peux gérer les dates limites de validité (DLV) et la traçabilité produit. | Historique détaillé par produit. |
| **G.4** | En tant que **Gestionnaire de Stock**, je reçois des alertes pour les stocks minimums (stock d'alerte). | |
| **G.5** | En tant que **Gestionnaire de Stock**, je peux gérer un stock réparti sur de multiples emplacements (Magasin, Expo, Dépôts). | |

### H. Opérations Financières & Administration Boutique (Shop Admin)
| ID | User Story | Critères d'Acceptation |
| :--- | :--- | :--- |
| **H.1** | En tant que **Shop Admin**, je peux traiter les encaissements et décaissements de ma boutique. | Génération systématique de document/reçu. |
| **H.2** | En tant que **Shop Admin**, je peux consulter des journaux de ventes (journalier/hebdomadaire). | |
| **H.3** | En tant que **Shop Admin**, je peux imprimer et valider les relevés de caisse. | |
| **H.4** | En tant que **Shop Admin**, je possède les droits pour corriger les états de ventes ou de stocks (ajustements). | |

### I. Administration Globale, Configurations Fiscales & Accès (Tenant Admin)
| ID | User Story | Critères d'Acceptation |
| :--- | :--- | :--- |
| **I.1** | En tant que **Tenant Admin**, je peux configurer les taxes à l'achat et à la vente pour chaque boutique. | |
| **I.2** | En tant que **Tenant Admin**, je peux préparer un catalogue maître/template (ex. modèle alimentation). | |
| **I.3** | En tant que **Tenant Admin / Superadmin**, je peux attribuer plusieurs rôles à un utilisateur. | Choix du profil actif à la connexion ; interface dynamique. |
| **I.4** | En tant que **Tenant Admin**, je peux accéder aux journaux système (logs) globaux. | |
