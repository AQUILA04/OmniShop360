# Contrats API - OmniShop360

Ce dossier contient les contrats d'interface entre le backend et le frontend. Chaque fichier représente un contrat pour un contrôleur spécifique de l'API REST.

## Objectif

Les contrats API permettent de :
- **Synchroniser** le développement parallèle frontend/backend
- **Documenter** précisément les endpoints, les formats de données et les comportements attendus
- **Versionner** les changements d'API pour éviter les breaking changes
- **Tester** les implémentations contre une spécification commune

## Convention de Nommage

Les fichiers de contrat suivent la convention :

```
{controller-name}.v{version}.md
```

**Exemples :**
- `tenant-controller.v1.md`
- `shop-controller.v1.md`
- `product-controller.v2.md` (après une mise à jour majeure)

## Versioning

Le versioning suit les principes de **Semantic Versioning** :

- **Version Majeure (v1 → v2)** : Changements incompatibles (breaking changes)
  - Suppression d'un endpoint
  - Modification du format de réponse
  - Changement de type de données
  
- **Version Mineure (ajout dans le changelog)** : Ajout de fonctionnalités rétro-compatibles
  - Ajout d'un nouveau champ optionnel
  - Ajout d'un nouvel endpoint
  
- **Version Patch (ajout dans le changelog)** : Corrections de bugs
  - Correction de documentation
  - Clarification de comportement

## Structure d'un Contrat

Chaque contrat doit contenir les sections suivantes :

1. **En-tête** : Version, date, responsables
2. **Changelog** : Historique des modifications
3. **Base URL** : URLs de développement et production
4. **Authentification** : Méthode d'authentification requise
5. **Endpoints** : Liste détaillée de tous les endpoints
   - Méthode HTTP
   - Path
   - Rôles requis
   - Request (headers, body, query params)
   - Response (success et erreurs)
6. **Modèles de Données** : Schémas des objets JSON
7. **Codes d'erreur** : Liste des codes HTTP utilisés
8. **Notes d'implémentation** : Conseils pour backend et frontend
9. **Tests** : Stratégie de test recommandée
10. **Exemples** : Exemples d'utilisation (cURL, etc.)
11. **Signature** : Validation par les responsables

## Workflow de Mise à Jour

### 1. Proposition de Changement

Lorsqu'un développeur (backend ou frontend) identifie un besoin de modification :

1. Créer une branche `feature/contract-update-{controller-name}`
2. Modifier le fichier de contrat
3. Incrémenter la version dans le changelog
4. Créer une Pull Request avec le label `contract-update`

### 2. Revue et Validation

La PR doit être revue et approuvée par :
- Le développeur backend responsable
- Le développeur frontend responsable
- Le Scrum Master (pour validation de cohérence)

### 3. Communication

Une fois le contrat validé :
- Notifier l'équipe via le canal de communication (Slack, Teams, etc.)
- Mettre à jour la documentation si nécessaire
- Planifier l'implémentation dans le sprint

### 4. Implémentation

Les développeurs implémentent en parallèle :
- **Backend** : Implémente l'API selon le contrat
- **Frontend** : Implémente les appels API selon le contrat

### 5. Validation

Avant de merger :
- Les tests backend passent (unitaires + intégration)
- Les tests frontend passent
- Une démo conjointe valide que l'intégration fonctionne

## Bonnes Pratiques

### Pour le Backend

- ✅ Implémenter **exactement** ce qui est dans le contrat
- ✅ Ajouter des tests d'intégration qui valident le contrat
- ✅ Documenter les endpoints avec Swagger/OpenAPI (en complément)
- ✅ Respecter les codes HTTP définis
- ✅ Valider les données d'entrée selon les contraintes

### Pour le Frontend

- ✅ Créer des **interfaces TypeScript** correspondant aux modèles de données
- ✅ Implémenter un **service dédié** par contrôleur
- ✅ Gérer **tous les cas d'erreur** définis dans le contrat
- ✅ Utiliser un **intercepteur** pour ajouter le token JWT automatiquement
- ✅ Mocker les réponses API pour les tests unitaires

### Pour Tous

- ✅ Ne **jamais** dévier du contrat sans le mettre à jour
- ✅ Communiquer **immédiatement** si un problème est détecté
- ✅ Proposer des améliorations via le processus de mise à jour
- ✅ Garder les contrats **à jour** et **synchronisés** avec le code

## Liste des Contrats Disponibles

| Fichier | Version | Description | Status |
|:---|:---:|:---|:---:|
| `tenant-controller.v1.md` | 1.0.0 | Gestion des Tenants | 🟢 Actif |
| `tenant-controller.v1.1.md` | 1.1.0 | Gestion des Tenants (Update, Delete, Status) | 🟢 Actif |
| `tenant-controller.v1.2.md` | 1.2.0 | Gestion des Tenants (Pricing Policy) | 🟢 Actif |
| `shop-controller.v1.md` | 1.0.0 | Gestion des Boutiques | 🟢 Actif |
| `shop-controller.v1.1.md` | 1.1.0 | Gestion des Boutiques (Création de Caissiers) | 🟢 Actif |
| `shop-controller.v1.2.md` | 1.2.0 | Gestion des Boutiques (Création de Gestionnaires de Stock) | 🟢 Actif |
| `product-controller.v1.md` | 1.0.0 | Gestion du Catalogue de Produits | 🟢 Actif |
| `category-controller.v1.md` | 1.0.0 | Gestion des Catégories de Produits | 🟢 Actif |
| `stock-controller.v1.md` | 1.1.0 | Gestion des Stocks et Inventaires (rôle stock_manager) | 🟢 Actif |
| `sale-controller.v1.md` | 1.0.0 | Gestion des Ventes et Transactions POS | 🟢 Actif |
| `sale-controller.v1.1.md` | 1.1.0 | Ventes – Recherche produits pour la vente (avec stock) | 🟢 Actif |
| `customer-controller.v1.md` | 1.0.0 | Gestion des Clients | 🟢 Actif |
| `user-controller.v1.md` | 1.0.0 | Gestion des Utilisateurs | 🟢 Actif |

---

**Légende des Status :**
- 🟢 **Actif** : Contrat validé et en cours d'implémentation
- 🟡 **En révision** : Contrat en cours de modification
- 🔴 **Déprécié** : Contrat obsolète, ne plus utiliser
- ⚪ **Brouillon** : Contrat en cours de rédaction

---

**Maintenu par :** Scrum Master  
**Dernière mise à jour :** 2025-12-09
