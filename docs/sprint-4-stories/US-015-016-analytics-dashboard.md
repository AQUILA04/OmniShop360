# User Story Details : US-015 & US-016 - Tableaux de Bord et Analytics

## Description
Transformer les lignes de vente en indicateurs visuels. Le système doit agréger les données de la table `Sale` pour fournir une aide à la décision.

## Spécifications Techniques (Backend)
- **Requêtes d'agrégation :** Utiliser des projections DTO pour éviter de charger des entités lourdes.
    - `SELECT SUM(total_amount) FROM Sale WHERE shop_id = :id AND created_at = TODAY`
- **Fréquence :** Les données doivent être rafraîchies à chaque chargement de page (pas besoin de temps réel par WebSocket pour cette phase).

## Détails UI/UX (Frontend)
- **Librairie :** Chart.js ou Ngx-Charts.
- **Widgets attendus :**
    - **KPI Cards :** CA du jour, Panier moyen, Nombre de transactions.
    - **Line Chart :** Évolution des ventes sur les 7 derniers jours.
    - **Top Products :** Liste des 5 articles les plus vendus (en volume).

## Critères d'Acceptation
1. L'Admin de la Boutique A ne voit QUE les statistiques de sa boutique.
2. Le Tenant Admin peut filtrer par boutique ou voir un cumul global.
3. Les graphiques gèrent le cas "Données vides" (affichage d'un état "No data available").