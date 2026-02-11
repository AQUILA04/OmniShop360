# Sprint 3 Backlog - Opérations de Stock et Ventes (POS)

**Objectif du Sprint :** Transformer le catalogue en inventaire réel par la réception de marchandises et permettre les transactions de vente via l'interface POS, tout en garantissant l'étanchéité des données par boutique.

---

## User Stories (US)

### Epic: Gestion des Stocks Locaux
| ID | User Story | Rôle | Priorité | Points | Dépendances |
|:---|:---|:---|:---|:---:|:---|
| **US-010** | En tant que **Gestionnaire de Stock**, je veux enregistrer une **Réception de Marchandises** pour mettre à jour les quantités disponibles dans ma boutique. | Stock Mgr | 🔴 Must | 5 | Sprint 2 |
| **US-011** | En tant que **Gestionnaire de Stock** ou **Shop Admin**, je veux consulter l'état des stocks de ma boutique en temps réel pour éviter les ruptures. | Stock Mgr, Shop Admin | 🔴 Must | 3 | US-010 |

**Note :** Le rôle Gestionnaire de Stock (stock_manager) est créé via `POST /api/v1/shops/{shopId}/stock-managers` par un tenant_admin ou shop_admin.

### Epic: Point de Vente (POS) & Ventes
| ID | User Story | Rôle | Priorité | Points | Dépendances |
|:---|:---|:---|:---|:---:|:---|
| **US-012** | En tant que **Caissier**, je veux rechercher un produit (nom/SKU) et l'ajouter au panier pour préparer une vente. | Caissier | 🔴 Must | 8 | US-11 |
| **US-013** | En tant que **Caissier**, je veux finaliser une vente (Espèces/Carte) et générer un ticket de caisse. | Caissier | 🔴 Must | 8 | US-012 |
| **US-014** | En tant que **Système**, je veux décrémenter automatiquement le stock local dès qu'une vente est validée. | Système | 🔴 Must | 5 | US-013 |

---

## Tâches Techniques (Sprint 3)

### 🔧 Backend (Spring Boot)
1. **[Task-BE-13]** Créer l'entité `Stock_Entry` (id, product_id, shop_id, quantity, type[IN/OUT], timestamp).
2. **[Task-BE-14]** Créer le service de mouvement de stock avec protection `@Transactional` (une vente = une décrémentation atomique).
3. **[Task-BE-15]** Implémenter l'API `POST /api/v1/stock/movements` pour les réceptions manuelles.
4. **[Task-BE-15b]** Implémenter l'API `POST /api/v1/shops/{shopId}/stock-managers` pour créer un Gestionnaire de Stock (comme pour les caissiers).
4. **[Task-BE-16]** Créer les entités `Sale` et `Sale_Item` (Stockage du prix de vente pratiqué au moment de l'achat).
5. **[Task-BE-17]** Développer l'API `POST /api/v1/sales/checkout` (Validation panier + Mise à jour stock).

### 🎨 Frontend (Angular)

#### **Gestion du Stock (Vue Admin Boutique)**
1. **[Task-FE-21]** Créer le composant `InventoryListComponent` : Table filtrable affichant `Nom Produit`, `SKU`, `Quantité Disponible`.
2. **[Task-FE-22]** Créer le formulaire `StockMovementForm` : Permettre de choisir un produit et de saisir une quantité entrante (Réception).
3. **[Task-FE-23]** Implémenter un indicateur visuel (couleur orange/rouge) pour les stocks bas.

#### **Interface POS (Caisse)**
4. **[Task-FE-24]** Développer le layout `POS` : Panier persistant à droite, grille de produits/recherche à gauche.
5. **[Task-FE-25]** Implémenter le `CartService` pour gérer l'ajout/suppression et le calcul du total TTC en local.
6. **[Task-FE-26]** Créer le dialogue de paiement (Choix du mode + Bouton de validation finale).

---

## Définition de "Fini" (Definition of Done)
- [ ] Une réception de stock augmente le compteur visible dans l'inventaire.
- [ ] Une vente décrémente le stock en temps réel.
- [ ] L'isolation est respectée : Le stock de la Boutique A n'est pas impacté par une vente en Boutique B.
- [ ] Le ticket de caisse virtuel affiche les bons articles et le total correct.