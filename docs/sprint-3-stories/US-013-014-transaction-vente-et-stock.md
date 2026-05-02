# User Story Details : US-013 & US-014 - Finalisation et Décrémentation

## Description
C'est l'opération la plus critique du système. Elle lie la vente comptable au mouvement de stock physique.

## Spécifications Backend (Spring Boot)
- **Processus Transactionnel (`@Transactional`) :**
    1. Enregistrer l'entité `Sale`.
    2. Pour chaque article, enregistrer `SaleItem` avec le **prix de vente actuel** (ne pas faire de lien direct au catalogue pour le prix, car le prix du catalogue peut changer dans le futur).
    3. Appeler `StockService.removeStock(productId, shopId, quantity)`.
    4. Créer une `Stock_Entry` de type `'OUT'` avec la référence de la `sale_id`.
- **Atomicité :** Si la mise à jour du stock échoue, la vente doit être annulée (Rollback).

## Sécurité
- Valider que le montant total calculé par le backend correspond au montant total envoyé par le frontend pour éviter les fraudes.

## Critères d'Acceptation
1. Le stock est décrémenté exactement de la quantité vendue.
2. Un reçu (objet JSON) est retourné contenant l'ID de transaction et le timestamp.
3. En cas d'erreur (ex: rupture de stock entre-temps), un message d'erreur clair est retourné.