# Spécifications UX/UI : OmniShop 360

## 1. POS (Point of Sale) - L'Outil du Caissier
* **Layout :** Design "3 Colonnes Fixes" (Catalogue/Recherche, Panier/Résumé, Actions).
* **Recherche :** Optimisée pour le scan de codes-barres (Focus automatique).
* **Feedback :** Affichage du stock **local** uniquement pour chaque produit.
* **Actions :** Bouton principal "Payer" très visible. Actions secondaires (Retour, Remise) via un menu 'Plus'.
* **Gestion du Retour (C.3) :** En cas d'essai de retour d'une autre boutique, un message d'erreur clair indique la restriction des retours à la boutique d'achat.

## 2. Dashboard de Gouvernance Tenant - La Vue 360°
* **Filtrage :** Filtres centraux pour la Période et le **Sélecteur de Boutique** (pour drill-down).
* **KPIs Primaires (D.1, D.3) :** Trois grandes cartes : CA Total, Marge Brute (€), Marge Brute (%).
* **Widget de Comparaison :** Graphique affichant le CA vs la Marge Brute par boutique pour identifier les anomalies.
* **Alerte :** Panneau d'alerte pour le Tenant Admin sur les déviations de prix forcés localement.
* **Export (D.2) :** Lien d'export clair pour le Comptable Tenant.

## 3. Gestion du Catalogue Maître
* **Séparation des Coûts (B.4) :** Le formulaire de création/édition de produit doit séparer visuellement le **Prix de Vente** (général) et les **Coûts (Prix d'Achat)**.
* **Accès :** La section "Coûts" doit être visible uniquement pour les rôles Tenant.
* **Vue Stock (B.3) :** Affichage du "Stock total actuel" (Tenant) et une liste détaillée du stock par boutique.
