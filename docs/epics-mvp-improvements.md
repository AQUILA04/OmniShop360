# OmniShop 360 - Epic Breakdown

**Author:** kahonsu
**Date:** 2026-03-27
**Project Level:** MVP Improvements
**Target Scale:** Multi-tenant POS & Back-Office

---

## Overview

This document provides the complete epic and story breakdown for OmniShop 360, decomposing the MVP improvement requirements from the [PRD](./prd.md) into implementable stories.

**Living Document Notice:** This is the initial version. It will be updated after UX Design and Architecture workflows add interaction and technical details to stories.

**Epics Summary:**
- **Epic E:** Caisse Avancée & Opérations de Vente (Point de Vente)
- **Epic F:** Back-Office Boutique & Opérations Administratives
- **Epic G:** Gestion Avancée des Stocks & Multi-emplacements
- **Epic H:** Opérations Financières & Administration Boutique (Shop Admin)
- **Epic I:** Administration Globale, Configurations Fiscales & Accès (Tenant Admin)

---

## Functional Requirements Inventory

**FR1 (Caissière):** Ouverture/Fermeture caisse, fond de caisse, reliquat.
**FR2 (Caissière):** Options de vente (filtres rapides, client divers, code promo, prix, sans stock).
**FR3 (Caissière):** Moyens de paiement multiples. Imprimer facture/ticket thermique.
**FR4 (Back Office):** Réimpression facture, création et modification client.
**FR5 (Back Office):** Suivi de caisse, inventaire journalier, journal des paiements.
**FR6 (Gest. Stock):** Mouvements complets, inventaires, dates limites (DLV), alertes stock minimum.
**FR7 (Gest. Stock):** Multi-emplacements (Magasin, Expo, Dépôt principal).
**FR8 (Shop Admin):** Journaux de ventes (Journalier, Hebdomadaire), corrections d'état des ventes et stocks.
**FR9 (Shop Admin):** Encaissements/décaissements, reçus de dépenses/recettes, relevés de caisse.
**FR10 (Super Admin / Global):** Taxes achat/vente configurables, catalogues modèles (Template), cumul des rôles.

---

## FR Coverage Map

- FR1, FR2, FR3 -> Epic E
- FR4, FR5 -> Epic F
- FR6, FR7 -> Epic G
- FR8, FR9 -> Epic H
- FR10 -> Epic I

---

## Epic E: Caisse Avancée & Opérations de Vente (Point de Vente)

Améliorer le parcours d'encaissement et la gestion de caisse pour permettre une vente plus rapide et flexible.

### Story E.1: Ouverture, Clôture et Gestion du Reliquat

As a Caissier,
I want gérer mon fond de caisse et le reliquat lors de mes ouvertures et clôtures,
So that je puisse tenir ma caisse de manière équilibrée et justifiée.

**Acceptance Criteria:**

**Given** la caisse est non ouverte
**When** je saisis un fond de caisse et que j'ouvre la caisse
**Then** l'ouverture est enregistrée.

**And** le reliquat final est calculable et transformable en moyen de règlement (avoir).

**Prerequisites:** Aucune
**Technical Notes:** S'assurer que le reliquat impacte les totaux journaliers et est associé au bon Tenant.

### Story E.2: Vente Flexible et Filtrage

As a Caissier,
I want utiliser une interface rapide de filtrage et attribuer une vente à un "Client Divers" ou sans stock,
So that je puisse encaisser les clients sans friction.

**Acceptance Criteria:**

**Given** je suis dans le panier d'encaissement
**When** je recherche un article (code, nom) ou je sélectionne un client
**Then** le résultat apparaît instantanément, et je peux forcer la vente même si le stock indique 0 (si paramétré).

**Prerequisites:** E.1
**Technical Notes:** La permission de vente "hors stock" doit être un flag dans les settings de la boutique.

### Story E.3: Application de Prix et Promotions

As a Caissier,
I want pouvoir modifier le niveau de prix ou appliquer des codes promo en caisse,
So that je puisse répondre aux offres commerciales.

**Acceptance Criteria:**

**Given** j'ai des articles dans le panier
**When** j'applique un code promotionnel ou modifie le niveau de prix
**Then** le total est recalculé immédiatement et la remise est affichée.

**Prerequisites:** E.2
**Technical Notes:** Vérifier les règles de cumul de promos.

### Story E.4: Multi-Paiement et Impression au choix

As a Caissier,
I want pouvoir saisir plusieurs moyens de paiement et choisir l'imprimante (A4 ou thermique),
So that je puisse finaliser la vente selon le souhait du client.

**Acceptance Criteria:**

**Given** le montant total est défini
**When** je saisis un montant pour l'espèce et un autre pour la carte
**Then** la vente est clôturée, et je peux choisir le format du ticket ou de la facture.

**Prerequisites:** E.3
**Technical Notes:** Le champ "moyen de paiement" par défaut doit être vide pour forcer l'usage actif du caissier.

---

## Epic F: Back-Office Boutique & Opérations Administratives

Fournir les outils administratifs nécessaires au bon suivi quotidien de la boutique.

### Story F.1: Gestion Clientèle Rapide et Réimpression

As an Admin Boutique ou Caissier,
I want rechercher des factures passées ou des clients pour modifications rapides,
So that je puisse éditer un duplicata ou maintenir la base client à jour.

**Acceptance Criteria:**

**Given** je suis sur le back-office de la boutique
**When** je recherche une facture par ID ou un client par numéro
**Then** je peux imprimer de nouveau le document ou modifier la fiche du client.

**Prerequisites:** EPIC E
**Technical Notes:** L'accès à l'historique de facturation se limite à cette boutique.

### Story F.2: Suivi Journalier et Reportings

As an Admin Boutique,
I want consulter mon inventaire et les transactions de paiement de la journée avant de clôturer,
So that je puisse repérer une erreur de caisse.

**Acceptance Criteria:**

**Given** des ventes ont eu lieu
**When** j'accède à la section des transactions
**Then** un tableau de bord récapitule les paiements par mode et l'inventaire journalier (téléchargeables).

**Prerequisites:** F.1
**Technical Notes:** Export CSV/PDF requis pour les listes de transactions.

---

## Epic G: Gestion Avancée des Stocks & Multi-emplacements

Offrir un suivi d'inventaire complet intégrant traçabilité, dates limites et emplacements multiples.

### Story G.1: Mouvements de Stock et Actualisation

As a Gestionnaire de Stock,
I want enregistrer précisément les entrées/sorties et effectuer des sondages,
So that le stock reflète fidèlement la réalité de la boutique.

**Acceptance Criteria:**

**Given** une réception ou un inventaire ponctel
**When** je fais un mouvement manuel ou importe une quantité
**Then** le stock est actualisé instantanément, et je peux définir la DLV du lot.

**Prerequisites:** Aucune
**Technical Notes:** Implémenter le suivi par lot/DLV en base de données.

### Story G.2: Alertes et Multi-Emplacements

As a Gestionnaire de Stock,
I want diviser le stock (Magasin/Expo/Dépôt) et voir des alertes pour le stock minimum,
So that je ne suis jamais en rupture et je sais où se trouve la marchandise.

**Acceptance Criteria:**

**Given** la gestion d'emplacements est activée
**When** je consulte le stock
**Then** je vois quelle quantité est allouée à l'Expo vs le Dépôt, et les items en alertes (stock < min) apparaissent en rouge.

**Prerequisites:** G.1
**Technical Notes:** La structure produit-stock doit permettre une relation n-n avec les emplacements d'une même boutique.

---

## Epic H: Opérations Financières & Administration Boutique (Shop Admin)

Permettre un pilotage financier de proximité incluant les décaissements et la correction des états.

### Story H.1: Encaissements et Décaissements

As a Shop Admin,
I want enregistrer les recettes et dépenses de ma boutique en générant des justificatifs,
So that la caisse finale intègre bien le flux de trésorerie hors ventes pures.

**Acceptance Criteria:**

**Given** une dépense locale (ex: fourniture)
**When** je saisis un décaissement
**Then** un mouvement de caisse est créé avec son document justificatif.

**Prerequisites:** F.2
**Technical Notes:** Il faut s'assurer que ces flux remontent sur le journal de caisse lors de la clôture.

### Story H.2: Corrections Administratives

As a Shop Admin,
I want avoir la possibilité de corriger les états de vente ou d'inventaire,
So that en cas d'erreur de saisie non rectifiable par le caissier, je puisse rééquilibrer la caisse.

**Acceptance Criteria:**

**Given** j'ai les permissions Shop Admin
**When** je modifie le statut d'une vente finalisée ou annule un mouvement de stock
**Then** la base enregistre cette correction en l'attribuant à mon profil (audit).

**Prerequisites:** H.1
**Technical Notes:** Piste d'audit (AuditLog) obligatoire pour ces corrections afin d'éviter la fraude.

---

## Epic I: Administration Globale, Configurations Fiscales & Accès (Tenant Admin)

Gérer la stratégie commerciale et fiscale pour l'ensemble du tenant de manière unifiée et permettre à un utilisateur de porter plusieurs casquettes.

### Story I.1: Configuration Fiscale et Catalogue

As a Tenant Admin,
I want paramétrer des taux de taxe spécifiques par boutique et créer des catalogues modèles (Templates),
So that je sois conforme selon la localisation et je puisse dupliquer rapidement mon offre.

**Acceptance Criteria:**

**Given** le panneau Tenant Admin
**When** je configure la boutique X ou crée un catalogue
**Then** le POS de la boutique X applique les bonnes taxes sur ses produits et la boutique Y peut hériter du modèle de catalogue choisi.

**Prerequisites:** Aucune
**Technical Notes:** S'assurer que le service des taxes prime les règles de boutique avant les règles du tenant au niveau des priorités.

### Story I.2: Cumul des rôles et profil actif

As a Tenant Admin / Superadmin,
I want attribuer divers rôles (Caissier, Admin Boutique...) à un même utilisateur,
So that l'utilisateur puisse choisir sous quelle identité de rôle il se connecte sans créer de doubles comptes.

**Acceptance Criteria:**

**Given** un utilisateur possède 2 rôles ou plus
**When** il se connecte
**Then** le système lui demande de choisir le rôle actif et l'interface s'adapte en fonction sans conflit de permissions.

**Prerequisites:** Keycloak.
**Technical Notes:** Keycloak gère les rôles multiples. Côté client (Angular/React), il faut stocker le 'rôle actif' dans le local storage ou session, et l'injecter dans un header `x-active-role` ou similaire aux APIs si besoin absolu, ou simplement restreindre le frontend.

---

## FR Coverage Matrix

| FR ID | Epics & Stories | Status |
| :--- | :--- | :--- |
| FR1 | E.1 | Defined |
| FR2 | E.2, E.3 | Defined |
| FR3 | E.4 | Defined |
| FR4 | F.1 | Defined |
| FR5 | F.2 | Defined |
| FR6 | G.1 | Defined |
| FR7 | G.2 | Defined |
| FR8 | H.2 | Defined |
| FR9 | H.1 | Defined |
| FR10| I.1, I.2 | Defined |

---

## Summary

This Epic Breakdown incorporates all the advanced Point of Sale, Back Office, Stock Management, and Financial Admin feedback required to finalize a truly robust and deployable MVP for the OmniShop 360 multi-tenant application.

---

_For implementation: Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown._

_This document will be updated after UX Design and Architecture workflows to incorporate interaction details and technical decisions._
