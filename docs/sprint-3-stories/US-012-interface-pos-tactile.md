# User Story Details : US-012 - Interface POS (Caisse)

## Description
L'interface de caisse est le cœur de l'expérience en magasin. Elle doit être rapide, utilisable sans souris (si possible) et afficher les données en temps réel.

## Spécifications Frontend (Angular)
- **State Management :** Utiliser un service local (`CartService`) pour stocker le tableau d'objets `CartItem` avant l'envoi au backend.
- **Performance :** La recherche doit filtrer localement ou via un cache pour éviter des latences réseau à chaque touche frappée.
- **Composants :**
    - `ProductGrid` : Affiche les produits sous forme de cartes avec photo/nom/prix.
    - `CartSummary` : Liste des articles ajoutés avec bouton +/- pour les quantités.



## Critères d'Acceptation
1. Cliquer sur un produit l'ajoute instantanément au panier.
2. Le total (HT/TVA/TTC) se met à jour dynamiquement à chaque modification du panier.
3. Un bouton "Vider le panier" permet de réinitialiser la session de vente.