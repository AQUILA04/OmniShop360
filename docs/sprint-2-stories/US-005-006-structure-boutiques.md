# User Story Details : US-005 & US-006 - Création de Boutiques et Staff

## Description
Mise en place de la hiérarchie physique. Chaque boutique est une entité isolée de données au sein d'un même Tenant.

## Spécifications Techniques
- **Liaison Keycloak :**
    - Lors de la création d'un `Shop Admin`, l'application doit lui attribuer un attribut custom dans Keycloak (ex: `shop_id`).
    - Le backend doit vérifier cet attribut lors des appels API pour filtrer les données.
- **Isolation :** Un `Shop Admin` de la Boutique A ne doit pas pouvoir appeler l'ID de la Boutique B, même s'il connaît l'ID (Vérification de propriété côté serveur).

## Critères d'Acceptation
1. Une boutique ne peut être créée que par un Tenant Admin.
2. Un utilisateur créé en tant que Shop Admin est automatiquement lié à sa boutique.
3. La liste des boutiques affiche le nombre d'utilisateurs rattachés à chacune.