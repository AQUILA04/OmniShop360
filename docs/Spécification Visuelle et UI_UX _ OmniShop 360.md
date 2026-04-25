# Spécification Visuelle et UI/UX : OmniShop 360

**Projet** : OmniShop 360 (SaaS Multi-Tenant Retail)
**Auteur** : Manus AI (basé sur les travaux de Francis AHONSU)
**Date** : Avril 2026
**Version** : 2.0 (Intégration complète POS, Back-Office et Tendances 2026)

---

## Table des Matières

1. [Vision et Philosophie de Design](#1-vision-et-philosophie-de-design)
2. [Design System et Recommandations Techniques](#2-design-system-et-recommandations-techniques)
3. [Layouts, Breakpoints et Wireframes](#3-layouts-breakpoints-et-wireframes)
4. [Parcours Utilisateurs et Pages Détaillées](#4-parcours-utilisateurs-et-pages-détaillées)
5. [Gestion des Rôles et Profil Actif](#5-gestion-des-rôles-et-profil-actif)
6. [Inventaire Complet des Pages et Composants](#6-inventaire-complet-des-pages-et-composants)
7. [Références](#7-références)

---

## 1. Vision et Philosophie de Design

OmniShop 360 ambitionne de révolutionner la gestion du commerce unifié en offrant une plateforme SaaS B2B où la gouvernance centralisée rencontre l'autonomie opérationnelle locale. L'interface utilisateur (UI) et l'expérience utilisateur (UX) doivent refléter cette ambition à travers un design **premium, moderne, fluide et hautement fonctionnel**.

L'approche globale s'articule autour d'une esthétique SaaS contemporaine, caractérisée par un minimalisme dynamique, des interfaces claires et une hiérarchie visuelle stricte. Le système s'éloigne résolument des designs obsolètes (type Bootstrap 3 des années 2016) pour embrasser des principes modernes tels que le *Glassmorphism* subtil, les micro-interactions de feedback et une typographie généreuse. L'objectif est double : minimiser la charge cognitive des utilisateurs (notamment les caissiers sous pression) et offrir un environnement de travail valorisant qui rivalise avec les meilleures applications SaaS du marché.

Conformément aux exigences du projet, l'ensemble de l'application adopte une stratégie **Mobile-First**. Chaque écran, du Point de Vente (POS) au tableau de bord d'administration globale, est conçu initialement pour les terminaux mobiles et tablettes, garantissant une réactivité parfaite et une ergonomie sans compromis sur tous les appareils. L'application web est destinée à être fortement utilisée sur téléphones et tablettes ; par conséquent, les adaptations mobiles suivent une spécification définie et non une implémentation aléatoire.

### 1.1. Principes Fondamentaux

Le design d'OmniShop 360 repose sur quatre piliers essentiels qui guident chaque décision de conception.

**Clarté et Hiérarchie Visuelle.** L'information essentielle (prix, totaux, alertes de stock) doit être identifiable instantanément, même à une distance de 80 cm pour un caissier. L'utilisation judicieuse de l'espace blanc (whitespace) et des contrastes élevés guide l'oeil de l'utilisateur vers les éléments prioritaires. Les standards d'accessibilité WCAG sont respectés pour garantir un ratio de contraste minimum de 4.5:1 pour le texte courant.

**Efficacité Opérationnelle (POS).** Le design du Point de Vente est optimisé pour la vitesse. L'interface doit répondre en moins de 100 millisecondes. Les raccourcis clavier, les zones tactiles généreuses (minimum 60 pixels de hauteur) et la réduction drastique du nombre de clics sont impératifs. Le flux de vente standard ne doit pas dépasser 3 étapes : sélection produit, choix du paiement, confirmation.

**Cohérence Multi-Tenant.** Le système de design doit supporter une personnalisation poussée (marque blanche) tout en conservant son intégrité structurelle. Les couleurs de la marque du tenant s'intègrent via des *design tokens* CSS sans altérer la lisibilité ni la hiérarchie visuelle. Cela signifie que les couleurs sémantiques (Success, Warning, Error) restent inchangées, tandis que la couleur Primary et les éléments de branding (logo, nom) sont personnalisables.

**Prévention et Gestion des Erreurs.** Les actions critiques (clôture de caisse, décaissements, modifications administratives) requièrent des confirmations visuelles distinctes via des modales de confirmation. Les erreurs (rupture de stock, retour invalide) sont communiquées de manière non bloquante mais évidente, par des notifications Toast positionnées en haut à droite de l'écran.

### 1.2. Facteurs Clés de l'Expérience Caissier

L'analyse des systèmes POS existants, notamment la refonte de Shopify POS Version 10 [4], révèle que l'expérience du personnel de vente est le facteur déterminant de la qualité du service client. Le tableau suivant synthétise les problématiques spécifiques au contexte POS et les solutions de design retenues.

| Facteur | Problématique | Solution de Design |
| :--- | :--- | :--- |
| **Pression Temporelle** | Les caissiers opèrent à une vitesse 2x supérieure à la normale, sous le regard des clients. | Interface ultra-réactive (<100ms), feedback instantané, flux optimisé pour un minimum d'étapes. |
| **Distance à l'Écran** | L'écran est souvent à plus de 80 cm, contre 40 cm pour un usage personnel. | Typographie large et contrastée, boutons de grande taille (min. 60px), iconographie claire. |
| **Charge Cognitive** | Le caissier doit gérer l'interface, le client, les produits physiques et le paiement simultanément. | Layout fixe (split-screen) pour éviter les changements de contexte, hiérarchie visuelle forte, informations clés toujours visibles. |
| **Prévention des Erreurs** | Les erreurs coûtent cher en temps et peuvent être une source de fraude. | Actions destructrices demandant confirmation, design qui guide vers l'action correcte, journal d'activité clair. |
| **Multi-Appareil** | L'écosystème peut inclure des tablettes, des postes fixes et des appareils mobiles. | Approche Mobile-First avec une interface responsive qui s'adapte à tous les formats. |

---

## 2. Design System et Recommandations Techniques

La cohérence visuelle d'OmniShop 360 repose sur un Design System robuste, conçu pour être facilement implémenté au sein de l'architecture Angular du projet. Ce Design System définit les fondations visuelles (couleurs, typographie, espacements) et les composants réutilisables qui constituent l'ensemble de l'interface.

### 2.1. Librairies et Frameworks Recommandés

Pour atteindre le niveau de qualité "premium" exigé tout en respectant les contraintes techniques (Angular, Eager/Lazy loading), la stack UI suivante est fortement recommandée. Le choix de chaque outil est motivé par sa compatibilité avec l'écosystème Angular et sa capacité à produire une esthétique SaaS moderne.

| Catégorie | Outil Recommandé | Justification |
| :--- | :--- | :--- |
| **Framework CSS** | **Tailwind CSS** | Personnalisation granulaire et rapide, approche utilitaire moderne, gestion native du Mobile-First et des thèmes via variables CSS. Évite les designs standardisés. |
| **Librairie de Composants** | **PrimeNG** | Plus de 80 composants Angular robustes (DataTable, Dialog, Toast, AutoComplete, Calendar, etc.). Librairie la plus complète pour Angular, sous licence MIT [1]. |
| **Template de Base** | **Sakai (PrimeNG)** ou **TailAdmin Angular** | Sakai offre une base open-source propre, minimaliste et parfaitement intégrée à PrimeNG [2]. TailAdmin propose une esthétique SaaS très moderne basée sur Tailwind [3]. La recommandation est de fusionner la puissance des composants PrimeNG avec le stylisme utilitaire de Tailwind CSS. |
| **Icônes** | **Lucide Icons** ou **Phosphor Icons** | Trait net, moderne et professionnel, style cohérent (outline ou filled), supérieur aux classiques FontAwesome. |
| **Graphiques (BI)** | **Chart.js** (via PrimeNG Charts) ou **ngx-charts** | Graphiques interactifs et responsifs pour les dashboards de performance et les rapports de marge. |
| **Animations** | **Angular Animations** + **Tailwind transitions** | Micro-interactions fluides (transitions de 150ms à 300ms) pour les ouvertures de modales, les changements d'état et les notifications. |

> **Note d'intégration** : PrimeNG et Tailwind CSS coexistent parfaitement. PrimeNG fournit la logique et la structure des composants complexes (DataTable, TreeSelect, etc.), tandis que Tailwind CSS gère le stylisme utilitaire (marges, paddings, couleurs personnalisées, responsive). Le thème PrimeNG doit être personnalisé via ses *design tokens* pour s'aligner sur la palette OmniShop 360.

### 2.2. Palette de Couleurs (Thème de Base)

La palette de couleurs est conçue pour être professionnelle et apaisante, réduisant la fatigue visuelle lors d'une utilisation prolongée. Elle respecte les ratios de contraste WCAG AA.

| Rôle Visuel | Nom de la Couleur | Code HEX | Utilisation Spécifique |
| :--- | :--- | :--- | :--- |
| **Surface (Fond)** | White | `#FFFFFF` | Arrière-plan principal de l'application et des conteneurs majeurs. |
| **Background (Cartes)** | Cultured | `#FCFDFD` | Fond des cartes, des modales et des sections secondaires pour créer de la profondeur. |
| **Background (Sidebar)** | Ghost White | `#F8F9FA` | Fond du menu latéral de navigation et des zones secondaires. |
| **Border (Séparateurs)** | Light Gray | `#C6D1D7` | Bordures légères des composants, séparateurs de listes et de tableaux. |
| **Text Primary** | Gunmetal | `#555663` | Typographie principale pour le contenu textuel et les titres. |
| **Text Secondary** | Slate Gray | `#676C73` | Labels de formulaires, textes d'aide, métadonnées et icônes inactives. |
| **Primary (Action)** | Blue Jeans | `#2F7EDA` | Boutons principaux, liens, focus states et éléments interactifs clés. Personnalisable par le Tenant. |
| **Primary Hover** | Dark Blue | `#1A5FB4` | État hover des boutons et liens Primary. |
| **Success (Validation)** | Ocean Green | `#51BC8F` | Messages de succès, boutons de paiement, badges de stock disponible. |
| **Warning (Alerte)** | Orange Web | `#FCA103` | Alertes de stock minimum, avertissements non bloquants, reliquats. |
| **Error (Critique)** | Vermilion | `#D93E3E` | Messages d'erreur, ruptures de stock, actions destructrices (suppression). |

Les couleurs Primary, Success, Warning et Error doivent être déclinées en variables CSS (Design Tokens) pour permettre la personnalisation par le Tenant Admin. La structure recommandée est la suivante :

```css
:root {
  --color-primary: #2F7EDA;
  --color-primary-hover: #1A5FB4;
  --color-primary-light: #EBF3FC;
  --color-success: #51BC8F;
  --color-success-light: #E8F8F0;
  --color-warning: #FCA103;
  --color-warning-light: #FFF5E0;
  --color-error: #D93E3E;
  --color-error-light: #FDECEC;
  --color-surface: #FFFFFF;
  --color-background: #FCFDFD;
  --color-sidebar: #F8F9FA;
  --color-border: #C6D1D7;
  --color-text-primary: #555663;
  --color-text-secondary: #676C73;
}
```

### 2.3. Typographie

La lisibilité est le critère numéro un. La famille de polices choisie doit exceller sur les écrans haute densité comme sur les terminaux POS d'ancienne génération.

**Police Principale : Inter.** Cette police sans-serif est privilégiée pour son excellente lisibilité des chiffres (crucial pour un POS), ses caractères distinctifs (le "1", le "l" et le "I" sont clairement différenciés) et son aspect très contemporain. Elle est disponible gratuitement via Google Fonts.

**Police Alternative : Roboto.** Si Inter n'est pas disponible, Roboto offre une alternative solide et largement supportée.

| Niveau | Taille | Poids | Interligne | Utilisation |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | 48px | Bold (700) | 56px | Total à Payer sur le POS. Doit être l'élément le plus visible de l'écran. |
| **Heading 1** | 32px | SemiBold (600) | 40px | Titres de pages (Tableau de Bord, Catalogue, etc.). |
| **Heading 2** | 24px | Medium (500) | 32px | Titres de cartes, de sections ou de formulaires. |
| **Heading 3** | 20px | Medium (500) | 28px | Sous-titres, titres de colonnes de tableaux importants. |
| **Body** | 16px | Regular (400) | 24px | Texte courant, descriptions, contenu des tableaux. Taille minimale pour le texte de lecture. |
| **Small** | 14px | Medium (500) | 20px | En-têtes de tableaux (DataTable), labels de champs de formulaire, badges. |
| **Caption** | 12px | Regular (400) | 16px | Textes d'aide sous les champs, horodatages, métadonnées secondaires. |

### 2.4. Espacements et Grille

Le système d'espacement utilise une échelle de 4px pour garantir une cohérence parfaite :

| Token | Valeur | Utilisation |
| :--- | :--- | :--- |
| `space-1` | 4px | Espacement minimal entre icône et texte. |
| `space-2` | 8px | Padding interne des badges, espacement entre éléments compacts. |
| `space-3` | 12px | Padding interne des boutons compacts. |
| `space-4` | 16px | Padding interne standard des cartes et des champs de formulaire. |
| `space-5` | 20px | Espacement entre les sections d'un formulaire. |
| `space-6` | 24px | Padding principal des cartes et des conteneurs. |
| `space-8` | 32px | Espacement entre les sections majeures d'une page. |
| `space-10` | 40px | Marge supérieure des titres de page. |

### 2.5. Composants et Principes d'Interaction

L'interface applique les principes du Material Design modernisé pour la structure, tout en conservant une esthétique "Flat" et épurée. Chaque composant est décrit avec ses spécifications visuelles.

**Cartes et Conteneurs.** Les éléments de contenu (tableaux de bord, formulaires) résident dans des cartes. Celles-ci possèdent des coins arrondis (`border-radius: 12px`), un fond légèrement distinct de la surface (`#FCFDFD`), une bordure fine (`1px solid #C6D1D7`) et une ombre portée très subtile (`box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06)`) pour créer une hiérarchie en Z (élévation). Les cartes de KPI sur les dashboards utilisent une variante avec une bordure gauche colorée (4px) correspondant à la couleur sémantique du KPI (Success pour le CA, Primary pour les transactions, etc.).

**En-têtes (Headers).** L'en-tête principal de l'application comporte une bordure inférieure légère (`1px solid #C6D1D7`) couplée à une ombre douce (`box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04)`), avec une couleur de fond très légèrement plus grise que la surface principale (`#F8F9FA`) pour délimiter clairement l'espace de navigation de l'espace de travail. La hauteur du header est fixée à 64px sur desktop et 56px sur mobile.

**Boutons.** Le système de boutons suit une hiérarchie stricte :

| Type | Style | Utilisation | Hauteur |
| :--- | :--- | :--- | :--- |
| **Primary** | Fond plein (couleur Primary), texte blanc, `border-radius: 8px` | Actions principales : Payer, Enregistrer, Créer | 48px (POS), 40px (Back-Office) |
| **Secondary / Outlined** | Fond transparent, bordure Primary, texte Primary | Actions secondaires : Annuler, Filtrer, Exporter | 40px |
| **Ghost / Text** | Fond transparent, pas de bordure, texte Primary | Actions tertiaires : Voir plus, Lien interne | 36px |
| **Danger** | Fond plein Error, texte blanc | Actions destructrices : Supprimer, Annuler une vente | 40px |
| **Success (POS)** | Fond plein Success, texte blanc, très grand | Bouton "Payer" sur le POS | 56px |

La couleur de la bordure des boutons d'action rapide (Quick Actions) doit correspondre à la couleur de fond de l'icône qu'ils contiennent, garantissant une cohérence visuelle immédiate.

**Formulaires (GenericFormComponent).** Les champs de saisie adoptent le style "Outlined" (bordure complète `1px solid #C6D1D7`, `border-radius: 8px`) plutôt que la ligne inférieure simple du Material classique, offrant une meilleure affordance. Le focus est marqué par une bordure de couleur Primary (`2px solid #2F7EDA`) et une légère ombre externe (ring : `box-shadow: 0 0 0 3px rgba(47, 126, 218, 0.15)`). Les labels sont positionnés au-dessus du champ (style "Floating Label" ou "Top-aligned Label") pour une meilleure lisibilité sur mobile.

**Tableaux de Données (DataTable / BaseListComponent).** Les DataTables PrimeNG sont le composant central du Back-Office. Elles doivent être configurées avec : un header sticky (fixe lors du scroll), un tri par colonne, une pagination (20 lignes par défaut), un filtre global en haut à droite, et des lignes alternées (striped) avec un fond très léger (`#FAFBFC`) pour faciliter la lecture. Sur mobile (< 640px), les DataTables complexes sont remplacées par des listes de cartes empilées verticalement, chaque carte représentant une ligne du tableau avec les informations clés et un menu d'actions contextuel (icône trois points verticaux).

**Notifications (Toasts).** Les messages de feedback (succès, erreur, avertissement) utilisent le composant Toast de PrimeNG, positionné en haut à droite de l'écran. Ils disparaissent automatiquement après 5 secondes (3 secondes pour les succès). Chaque toast est accompagné d'une icône sémantique et d'une couleur de fond correspondant à son type (Success light, Error light, Warning light).

**Modales et Overlays.** Les modales sont utilisées pour les actions qui nécessitent une attention focalisée (paiement, confirmation de suppression, ouverture de caisse). Elles possèdent un fond semi-transparent (backdrop : `rgba(0, 0, 0, 0.4)`), des coins arrondis (`border-radius: 16px`), et une animation d'entrée en fondu + légère translation vers le haut (150ms). Sur mobile, les modales de contenu riche (panier, formulaires) utilisent un pattern "Bottom Sheet" (tiroir glissant depuis le bas).

**Micro-interactions.** Le survol (hover) des éléments interactifs provoque un changement de couleur subtil (assombrissement de 10%) et un changement de curseur (`cursor: pointer`). Les clics déclenchent un léger enfoncement visuel (`transform: scale(0.98)`, durée 100ms) pour confirmer l'action. Les transitions entre états (ouvert/fermé, actif/inactif) utilisent une courbe d'accélération `ease-in-out` sur 200ms.

---

## 3. Layouts, Breakpoints et Wireframes

La stratégie Mobile-First dicte que la conception commence par la contrainte de l'écran le plus petit, pour ensuite s'étendre vers les résolutions supérieures. Cette section définit les points de rupture, les structures de layout et les wireframes textuels pour chaque module.

### 3.1. Breakpoints Responsifs

Le système utilise les points de rupture standards de Tailwind CSS, adaptés aux besoins spécifiques d'OmniShop 360 :

| Breakpoint | Largeur | Comportement | Cible |
| :--- | :--- | :--- | :--- |
| **Base (Mobile)** | < 640px | 1 colonne, navigation par menu hamburger ou barre inférieure, DataTables remplacées par des listes de cartes. | Smartphones |
| **sm (Tablet Portrait)** | 640px - 767px | 1-2 colonnes, navigation latérale rétractable (overlay). | Tablettes en portrait |
| **md (Tablet Landscape)** | 768px - 1023px | 2 colonnes, POS en split-screen réduit (55/45). | Tablettes en paysage |
| **lg (Desktop)** | 1024px - 1279px | Navigation latérale fixe, split-screen POS complet (65/35), grilles de données complètes. | Écrans desktop |
| **xl (Large Desktop)** | >= 1280px | Layout étendu avec marges latérales, grilles de 4+ colonnes pour les KPIs. | Grands écrans, terminaux POS fixes |

### 3.2. Layout Back-Office (Admin-Shop et Admin-Tenant)

Le layout du Back-Office s'inspire des meilleures pratiques des dashboards SaaS modernes. Il est composé de trois zones persistantes sur desktop : un header supérieur, un menu latéral de navigation et une zone de contenu principale.

```text
[Layout Desktop - >= 1024px]
┌──────────────────────┬────────────────────────────────────────────────────────┐
│ [Logo OmniShop 360]  │ [Recherche Globale]            [Notifs] [Rôle] [Avatar]│
│ ─────────────────────┼────────────────────────────────────────────────────────┤
│                      │                                                        │
│ ⌂ Tableau de Bord    │  H1 Titre de la Page           [Bouton Action Primaire]│
│                      │                                                        │
│ 📦 Catalogue         │  ┌──────────────────────────┐ ┌──────────────────────┐ │
│                      │  │ Carte KPI                │ │ Carte KPI            │ │
│ 🏪 Boutiques         │  │ CA Jour: 12 450€         │ │ Transactions: 87     │ │
│                      │  └──────────────────────────┘ └──────────────────────┘ │
│ 👥 Utilisateurs      │                                                        │
│                      │  ┌───────────────────────────────────────────────────┐ │
│ 💰 Mouvements Caisse │  │ DataTable (PrimeNG) avec pagination et filtres    │ │
│                      │  │ [Filtre Global]                    [Export CSV/PDF]│ │
│ 📊 Rapports          │  │ ─────────────────────────────────────────────────  │ │
│                      │  │ Heure | ID Facture | Client | Montant | Statut    │ │
│ ⚙️ Paramètres        │  │ 14:35 | #F-0042   | Dupont | 42.50€  | ✅ Payée  │ │
│                      │  │ 14:22 | #F-0041   | Divers | 8.90€   | ✅ Payée  │ │
│                      │  └───────────────────────────────────────────────────┘ │
└──────────────────────┴────────────────────────────────────────────────────────┘

Sidebar : Largeur fixe 260px, fond #F8F9FA, bordure droite 1px #C6D1D7.
Header  : Hauteur 64px, fond #F8F9FA, bordure inférieure + ombre.
Contenu : Padding 24px, fond #FFFFFF.
```

```text
[Layout Mobile - < 640px]
┌────────────────────────────────────────────────────────┐
│ [☰ Menu] [Logo OmniShop]               [Notifs] [Avatar]│
├────────────────────────────────────────────────────────┤
│                                                        │
│ H1 Titre de la Page                                    │
│ [Bouton Action Primaire] (Largeur 100%)                │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Carte KPI - CA Jour: 12 450€                       │ │
│ └────────────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Carte KPI - Transactions: 87                       │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Liste de Cartes (remplace la DataTable)             │ │
│ │ ┌──────────────────────────────────────────────┐   │ │
│ │ │ #F-0042 | Dupont | 42.50€ | ✅      [⋮]     │   │ │
│ │ └──────────────────────────────────────────────┘   │ │
│ │ ┌──────────────────────────────────────────────┐   │ │
│ │ │ #F-0041 | Divers | 8.90€  | ✅      [⋮]     │   │ │
│ │ └──────────────────────────────────────────────┘   │ │
│ └────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘

Menu hamburger : Ouvre un Drawer latéral (overlay) avec la navigation complète.
Cartes KPI    : Empilées verticalement, largeur 100%.
DataTable     : Remplacée par des cartes empilées avec menu contextuel [⋮].
```

### 3.3. Layout Point de Vente (POS)

Le POS exige une ergonomie radicalement différente, centrée sur la transaction. Il n'utilise pas le layout standard du Back-Office (pas de sidebar de navigation). La navigation est minimale et intégrée au header.

```text
[Layout POS Desktop/Tablet Paysage - Split Screen (>= 768px)]
┌──────────────────────────────────────┬───────────────────────────────────────┐
│ [Logo] Boutique Paris Centrale       │ 14:35 | Caissier: Jean | [🔄] [🚪]   │
├──────────────────────────────────────┼───────────────────────────────────────┤
│ [🔍 Rechercher code, nom, catégorie] │ 👤 Client Divers [Modifier]           │
│ [Alimentation] [Boissons] [Divers]   │ ──────────────────────────────────────│
│ [Hygiène] [Électro] [Tous]           │ 1x Coca-Cola 33cl               1.50€│
│                                      │    [-] [1] [+]                   [🗑] │
│ ┌────────┐ ┌────────┐ ┌────────┐     │ 2x Baguette Pain                2.00€│
│ │ 📷     │ │ 📷     │ │ 📷     │     │    [-] [2] [+]                   [🗑] │
│ │Produit1│ │Produit2│ │Produit3│     │                                      │
│ │ 1.50€  │ │ 2.00€  │ │ 5.00€  │     │                                      │
│ │ 🟢 45  │ │ 🟡 3   │ │ 🟢 120 │     │                                      │
│ └────────┘ └────────┘ └────────┘     │ ─────────────────────────────────────│
│ ┌────────┐ ┌────────┐ ┌────────┐     │ Sous-total:                    3.50€ │
│ │ 📷     │ │ 📷     │ │ 📷     │     │ Taxes (20%):                   0.70€ │
│ │Produit4│ │Produit5│ │Produit6│     │ [🏷️ Ajouter Promo]                    │
│ │ 10.00€ │ │ 1.00€  │ │ 3.50€  │     │                                      │
│ │ 🔴 0   │ │ 🟢 80  │ │ 🟢 55  │     │ TOTAL À PAYER:                 4.20€ │
│ └────────┘ └────────┘ └────────┘     │                                      │
│                                      │ [  ANNULER  ]  [ 💳 PAYER (4.20€) ]  │
└──────────────────────────────────────┴───────────────────────────────────────┘

Zone Produits : 65% de la largeur, fond #FFFFFF, scroll vertical sur la grille.
Zone Panier   : 35% de la largeur, fond #FCFDFD, bordure gauche 1px #C6D1D7.
Résumé        : Fixé en bas de la zone panier (sticky bottom).
Pastilles stock : 🟢 Normal, 🟡 Alerte (< min_stock), 🔴 Rupture (= 0).
```

```text
[Layout POS Mobile - < 640px - Barre Flottante Panier]
┌──────────────────────────────────────┐
│ [☰] Boutique Paris | 14:35  [Avatar] │
├──────────────────────────────────────┤
│ [🔍 Rechercher produit...]           │
│ [Alimentation] [Boissons] [Divers]   │
│                                      │
│ ┌────────┐ ┌────────┐               │
│ │Produit1│ │Produit2│               │
│ │ 1.50€  │ │ 2.00€  │               │
│ └────────┘ └────────┘               │
│ ┌────────┐ ┌────────┐               │
│ │Produit3│ │Produit4│               │
│ │ 5.00€  │ │ 10.00€ │               │
│ └────────┘ └────────┘               │
│                                      │
│                                      │
├──────────────────────────────────────┤
│ 🛒 Panier (3 articles)        4.20€ │  <-- Tap déploie le Bottom Sheet
└──────────────────────────────────────┘

Grille produits : 2 colonnes sur mobile, 3 sur tablette portrait.
Barre flottante : Hauteur 56px, fond Primary (#2F7EDA), texte blanc, position fixed bottom.
Bottom Sheet    : Couvre 85% de l'écran, contient la liste des articles, le résumé et le bouton Payer.
```

---

## 4. Parcours Utilisateurs et Pages Détaillées

Cette section détaille l'interface utilisateur pour chaque module clé, en intégrant les User Stories définies dans les Epics MVP (E à I) et les stories de base (A à D).

### 4.1. Module Point de Vente (POS) - Epic E

Le POS est le coeur opérationnel d'OmniShop 360. Son interface est un **Split-Screen persistant** sur desktop et tablette paysage, garantissant l'absence de changement de contexte. Le module POS est chargé en mode **Eager Loading** pour des performances maximales.

#### 4.1.1. Structure Générale du POS (Desktop/Tablet)

L'écran est divisé en trois zones principales. Le **Header** (hauteur 56px) contient le logo de la boutique, le nom de l'utilisateur actif (Caissier), l'heure en temps réel, le statut de connexion (indicateur vert/rouge pour En ligne/Hors ligne), un bouton de changement de rôle (icône de rotation, Story I.2) et le bouton de déconnexion.

La **Zone Produits** (gauche, 65% de l'écran) comprend une barre de recherche globale (large champ de saisie avec icône loupe, placeholder "Rechercher par code-barres, nom ou catégorie..."), des filtres rapides sous forme de pilules (chips) cliquables pour les catégories principales, et une grille de produits scrollable. Chaque carte produit affiche l'image (si disponible, sinon un placeholder avec l'initiale du produit), le nom tronqué à 2 lignes, le prix en gras et une pastille de stock colorée. Si le stock est faible (inférieur au seuil `min_stock`), la pastille est Warning (`#FCA103`). Si le stock est à 0, la carte est visuellement atténuée (opacité 60%) mais reste cliquable si le paramètre "Vente sans stock" est actif dans les paramètres de la boutique (Story E.2).

La **Zone Panier** (droite, 35% de l'écran) comprend en haut un sélecteur de client (par défaut "Client Divers", un clic ouvre un panneau de recherche rapide par Nom, Email ou Téléphone, ou de création de client via un formulaire compact), puis la liste scrollable des articles ajoutés au panier (chaque ligne affichant le nom, la quantité avec boutons + / -, le prix unitaire, les remises appliquées et un bouton de suppression), et enfin la zone de résumé financier fixée en bas (sous-total, bouton "Ajouter Promo / Remise", taxes appliquées, et le TOTAL À PAYER en typographie Display 48px). Deux larges boutons de finalisation complètent la zone : "Annuler" (style Ghost/Secondary) et "Payer" (style Success, très grand, affichant le montant total).

#### 4.1.2. Adaptation Mobile-First du POS

Sur smartphone, le split-screen est remplacé par une approche en couches. L'écran principal est entièrement dédié à la Zone Produits et à la recherche, avec une grille de 2 colonnes. La Zone Panier devient une barre flottante persistante en bas de l'écran (fond Primary, texte blanc, hauteur 56px), affichant le nombre d'articles et le total. Un tap sur cette barre déploie le panier complet sous forme de **Bottom Sheet** (tiroir glissant vers le haut), couvrant 85% de l'écran pour permettre la modification des quantités, l'ajout de client et l'accès au bouton "Payer".

#### 4.1.3. Ouverture et Clôture de Caisse (Story E.1)

**Ouverture.** À la première connexion de la journée, le POS est verrouillé. Une modale centrée "Ouverture de Caisse" apparaît avec un fond semi-transparent, exigeant la saisie du **Fond de Caisse** initial (champ numérique avec pavé virtuel) avant de débloquer l'interface. Un bouton "Ouvrir la Caisse" (Primary) valide l'opération. L'heure et le montant sont enregistrés dans l'audit.

**Clôture.** Accessible via le menu utilisateur (icône engrenage ou menu hamburger). L'interface affiche un récapitulatif complet sous forme de tableau :

| Élément | Montant |
| :--- | :--- |
| Fond de Caisse Initial | 200.00 EUR |
| + Ventes Espèces | 1 250.00 EUR |
| + Encaissements | 50.00 EUR |
| - Décaissements | -35.00 EUR |
| **= Solde Espèces Attendu** | **1 465.00 EUR** |

Le caissier saisit le montant réel compté physiquement. Le système calcule le **Reliquat** (positif ou négatif). Si le reliquat est significatif, un avertissement Warning s'affiche. Le caissier doit valider ce reliquat, qui est alors enregistré dans l'audit journalier et peut être transformé en avoir client si nécessaire.

#### 4.1.4. Vente Flexible et Filtrage (Story E.2)

La recherche de produits est le point d'entrée principal de la vente. Le champ de recherche supporte trois modes : la saisie manuelle du nom (recherche en temps réel avec debounce de 300ms), le scan de code-barres (via un lecteur USB ou la caméra du terminal), et la navigation par catégorie via les filtres rapides (chips). Les résultats de recherche apparaissent instantanément dans la grille, remplaçant l'affichage par défaut.

Le client par défaut est "Client Divers", assigné automatiquement à chaque nouvelle vente. Pour le modifier, le caissier clique sur le sélecteur client en haut du panier. Un panneau latéral (Drawer) s'ouvre avec un champ de recherche (Nom, Email, Téléphone) et un bouton "Nouveau Client" pour une création rapide sans quitter le flux de vente.

#### 4.1.5. Application de Prix et Promotions (Story E.3)

Lorsque des articles sont dans le panier, le bouton "Ajouter Promo / Remise" dans la zone de résumé ouvre une modale dédiée. Cette modale propose deux onglets : "Code Promotionnel" (saisie d'un code alphanumérique avec validation en temps réel) et "Niveau de Prix" (sélection parmi les niveaux configurés par le Tenant Admin, ex: Prix Standard, Prix Professionnel, Prix Employé). L'application d'une promotion recalcule immédiatement le total. La remise est affichée de manière explicite sur chaque ligne d'article concernée (prix barré + nouveau prix) et dans le résumé (ligne "Remise" avec le montant en vert).

#### 4.1.6. Flux d'Encaissement et Multi-Paiement (Story E.4)

Lors du clic sur "Payer", une modale plein écran (ou un panneau latéral sur desktop) s'ouvre, recouvrant la zone produits mais laissant le résumé du panier visible.

L'interface de paiement se compose de trois zones. En haut, le **Montant Restant à Payer** est affiché en typographie Display. Au centre, un **pavé numérique virtuel** large et tactile permet la saisie du montant. En bas, une rangée de **boutons de modes de paiement** (Espèces, Carte Bancaire, Mobile Money, Avoir, Chèque) est présentée sous forme de larges boutons avec icônes.

Le flux de multi-paiement fonctionne comme suit : le caissier saisit un montant partiel sur le pavé numérique, puis clique sur "Espèces". Le montant est enregistré et le reste à payer est mis à jour. Il sélectionne ensuite "Carte Bancaire" pour le solde. Une liste des paiements saisis s'affiche clairement sous forme de chips supprimables. Une fois le solde atteint 0 EUR, un bouton "Valider la Vente" (Success) apparaît.

Après validation, un **écran de succès** s'affiche avec une animation de confirmation (icône check verte), le rendu de monnaie (si espèces), et deux boutons d'action principaux : "Imprimer Ticket Thermique" (icône imprimante) et "Imprimer Facture A4" (icône document). Un bouton "Nouvelle Vente" (Primary) permet d'enchaîner rapidement. L'impression utilise des feuilles de style CSS dédiées : `@media print` pour le format A4, et une version compacte fixe (largeur 80mm) pour le ticket thermique.

### 4.2. Module Back-Office Boutique (Admin-Shop) - Epic F et H

Ce module est destiné au Gérant (Shop Admin) et au Caissier (avec des vues restreintes selon les permissions). Il utilise le layout standard du Dashboard avec menu latéral de navigation, header supérieur et zone de contenu centrale. Le module est chargé en **Lazy Loading**.

#### 4.2.1. Tableau de Bord Journalier (Story F.2)

La page d'accueil du Back-Office Boutique présente un tableau de bord synthétique de la journée en cours.

**Cartes de KPIs** : Trois à quatre cartes alignées horizontalement (empilées sur mobile) affichent les indicateurs clés : Chiffre d'Affaires du Jour (avec variation par rapport à la veille en pourcentage), Nombre de Transactions, Panier Moyen, et Solde de Caisse Actuel. Chaque carte possède une bordure gauche colorée (Success pour le CA positif, Warning si en baisse).

**Graphique des Ventes** : Un graphique en barres (Chart.js via PrimeNG Charts) montre l'évolution des ventes par tranche horaire. Le graphique est interactif (tooltip au survol) et responsive.

**Tableau des Transactions Récentes** : Une DataTable PrimeNG listant les dernières ventes avec les colonnes Heure, ID Facture, Client, Montant, Mode de Paiement et Statut. Un filtre global permet la recherche rapide. Un bouton "Export" en haut à droite propose le téléchargement en CSV ou PDF.

**Inventaire Journalier** : Un onglet ou une section dédiée résumant les entrées et sorties de stock de la journée, avec un tableau simplifié (Produit, Entrées, Sorties, Stock Actuel).

#### 4.2.2. Gestion des Factures et Réimpression (Story F.1)

**Page Historique des Ventes.** Une DataTable avancée permettant de rechercher une facture par ID, date, nom de client ou montant. Les colonnes affichent la Date, l'ID Facture, le Client, le Montant Total, le Mode de Paiement, le Statut (Payée, Annulée, Corrigée) et une colonne Actions.

Chaque ligne de facture possède un menu d'action contextuel (icône trois points verticaux) avec les options : "Voir le Détail", "Réimprimer (Duplicata)" et "Corriger" (visible uniquement pour le Shop Admin). Le clic sur "Réimprimer" génère un document avec un filigrane "DUPLICATA" clairement visible en diagonale, conformément aux exigences légales.

**Page Clients.** Liste des clients de la boutique dans une DataTable avec Nom, Email, Téléphone, Date de Création et Nombre d'Achats. Un bouton "Nouveau Client" en haut à droite ouvre un formulaire latéral (Sidebar/Drawer) utilisant le `GenericFormComponent` pour une saisie sans quitter la page. Les champs incluent : Nom, Prénom, Email, Téléphone, Adresse (optionnel) et Notes (optionnel).

#### 4.2.3. Opérations de Caisse - Encaissements et Décaissements (Story H.1)

**Page Mouvements de Caisse.** Cette page est divisée en deux sections. La partie supérieure affiche un résumé du solde de caisse actuel (Fond Initial + Ventes Espèces + Encaissements - Décaissements = Solde Théorique). La partie inférieure liste les mouvements de la journée dans une DataTable avec les colonnes : Heure, Type (Entrée/Sortie, avec un badge coloré Success/Error), Montant, Motif, Intervenant et Actions.

Un bouton "Nouveau Mouvement" ouvre un formulaire demandant le Type (sélecteur Entrée/Sortie), le Montant (champ numérique), le Motif (liste déroulante prédéfinie : Fournitures, Transport, Remboursement, Autre + champ texte libre) et l'Intervenant (nom de la personne concernée). La validation génère automatiquement un reçu justificatif imprimable (format ticket thermique) et met à jour le solde théorique de la caisse.

#### 4.2.4. Corrections Administratives (Story H.2)

**Interface d'Édition Sécurisée.** Accessible uniquement au Shop Admin via le menu d'actions d'une facture. Lorsqu'il active le mode correction sur une vente passée, l'interface affiche un bandeau d'avertissement persistant en haut de la page (fond Warning light `#FFF5E0`, bordure Warning `#FCA103`) avec le texte : "Mode Correction Active - Toute modification sera tracée dans la piste d'audit".

Les champs modifiables sont clairement identifiés (bordure en pointillés) et les champs non modifiables sont grisés. Après validation, un dialogue de confirmation demande un motif de correction obligatoire.

**Piste d'Audit.** Dans le détail de toute facture ou mouvement de stock modifié, un onglet "Historique des Modifications" liste chronologiquement chaque correction avec : la Date et l'Heure, l'Utilisateur ayant effectué la modification, le Champ Modifié, la Valeur Avant, la Valeur Après et le Motif. Un badge "Corrigée par Admin" (fond Warning light) est affiché sur la facture dans les listes.

### 4.3. Module Gestion des Stocks - Epic G

Destiné au Gestionnaire de Stock, ce module privilégie les formulaires de saisie rapide et les tableaux de données denses. Il est accessible depuis le menu latéral du Back-Office Boutique.

#### 4.3.1. Vue Globale et Multi-Emplacements (Story G.2)

**Page Inventaire.** Une DataTable dense listant tous les produits de la boutique. Les colonnes clés sont : Image (miniature), Nom, SKU, Catégorie, Stock Total, et une colonne spécifique par emplacement activé (Magasin, Expo, Dépôt Principal). Si le stock d'un produit passe sous le seuil d'alerte (`min_stock`), la cellule de stock est surlignée avec un fond Error light (`#FDECEC`) et un texte en rouge. Un filtre rapide "Alertes uniquement" permet d'afficher exclusivement les produits en rupture ou sous le seuil.

**Widget d'Alertes.** Sur le Dashboard Boutique, un widget dédié (carte avec bordure Error) liste les 5 produits les plus critiques (stock le plus bas par rapport au seuil) avec un lien direct vers la fiche produit.

#### 4.3.2. Mouvements de Stock et DLV (Story G.1)

**Page Réception de Marchandises.** Un formulaire structuré en deux parties. La partie supérieure contient les métadonnées du bon de réception (Fournisseur, Date, Référence). La partie inférieure est un tableau éditable (inline editing) permettant d'ajouter des lignes de produits. Pour chaque ligne, l'utilisateur saisit ou scanne le produit, puis renseigne la Quantité, l'Emplacement de destination (sélecteur : Magasin, Expo, Dépôt), le Prix d'Achat Unitaire (pré-rempli depuis le catalogue maître, modifiable avec justification) et la Date Limite de Validité (DLV) via un DatePicker. La validation du bon met à jour instantanément les stocks.

**Page Inventaire / Sondage.** Une interface optimisée pour tablette permettant au gestionnaire de se déplacer dans les rayons. L'écran affiche un champ de recherche/scan en haut, et pour chaque produit sélectionné, une fiche compacte montre le stock théorique (lecture seule) et un champ de saisie pour le stock physique compté. Un indicateur visuel (vert si concordance, rouge si écart) permet de repérer immédiatement les anomalies. Un bouton "Valider le Sondage" enregistre les écarts et génère un rapport.

### 4.4. Module Administration Globale (Admin-Tenant) - Epic A, B, D, I

L'espace réservé au Tenant Admin (le siège de l'entreprise). L'esthétique y est plus analytique et orientée données. Le module utilise le même layout Back-Office mais avec un menu latéral adapté aux fonctions d'administration globale.

#### 4.4.1. Tableau de Bord de Performance (BI) (Story D.1, D.3)

**Dashboard Exécutif.** La page d'accueil du Tenant Admin présente une vue consolidée de l'ensemble du réseau. Les cartes de KPI affichent le Chiffre d'Affaires Global (avec tendance), la Marge Brute Totale (en valeur et en pourcentage), le Nombre de Boutiques Actives et le Nombre Total de Transactions.

**Graphiques Comparatifs.** Deux graphiques principaux occupent la section centrale : un graphique en barres comparant le CA par boutique (classement décroissant), et un graphique en courbes montrant l'évolution du CA global sur les 30 derniers jours. Un sélecteur de période (Aujourd'hui, 7 jours, 30 jours, Personnalisé) permet d'ajuster la vue.

**Rapport de Marge.** Accessible via un onglet dédié ou une page séparée (également accessible au Comptable Tenant). Ce rapport présente un tableau détaillé avec les colonnes : Boutique, CA Total, Coût des Ventes (COGS), Marge Brute (EUR), Marge Brute (%), et un indicateur visuel (barre de progression colorée). Un bouton "Exporter" permet le téléchargement en CSV ou Excel. L'accès est strictement refusé aux rôles Shop Admin et Caissier.

#### 4.4.2. Gestion du Catalogue Maître (Story B.1, B.4, I.1)

**Page Catalogue.** Liste de tous les produits du réseau dans une DataTable avec filtres avancés (par catégorie, par statut actif/inactif, par fourchette de prix). Un bouton "Nouveau Produit" ouvre la fiche produit en mode création.

**Fiche Produit Maître.** Un formulaire complet divisé en onglets :

| Onglet | Contenu |
| :--- | :--- |
| **Informations Générales** | Nom, Description, SKU, Catégorie (TreeSelect PrimeNG), Images (upload drag-and-drop), Statut (Actif/Inactif). |
| **Prix et Coûts** | Prix de Référence (vente), Coût d'Achat (avec historique des modifications), Politique de Prix (Imposé Globalement / Modifiable Localement), Niveaux de Prix additionnels. |
| **Variantes** | Gestion des variantes (Taille, Couleur, etc.) avec prix et SKU spécifiques par variante. |
| **Stock Agrégé** | Vue en lecture seule du stock total par boutique (Story B.3). |

**Catalogues Templates (Story I.1).** Une page dédiée permettant de créer des modèles de catalogues. L'interface permet de sélectionner des catégories et des produits du catalogue maître, de les regrouper sous un nom (ex: "Template Alimentation Générale", "Template Électroménager") et de les sauvegarder. Lors de la création d'une nouvelle boutique, un sélecteur propose d'importer un template existant.

#### 4.4.3. Gestion des Boutiques et Configurations (Story A.1, A.2, I.1)

**Page Réseau de Boutiques.** Un tableau de bord listant toutes les boutiques du tenant avec les colonnes : Nom, Adresse, Statut (Active/Suspendue, avec badge coloré), Shop Admin Assigné, CA du Mois et Nombre d'Employés. Un bouton "Nouvelle Boutique" ouvre un formulaire de création (Nom, Adresse, Template de Catalogue à importer, Shop Admin à assigner).

**Page Configuration Boutique.** Accessible en cliquant sur une boutique dans la liste. Un formulaire à onglets permet de configurer :

| Onglet | Contenu |
| :--- | :--- |
| **Informations** | Nom, Adresse, Téléphone, Email de contact, Logo spécifique. |
| **Fiscalité** | Taux de TVA par défaut, Taxes spécifiques à la boutique (surcharges locales). La configuration boutique prime sur la configuration tenant. |
| **Paramètres POS** | Autoriser la vente sans stock (toggle), Modes de paiement activés, Format de ticket par défaut. |
| **Personnel** | Liste des employés assignés à cette boutique avec leurs rôles. |

#### 4.4.4. Gestion des Utilisateurs et Rôles (Story A.2, I.3)

**Page Utilisateurs et Rôles.** Une DataTable listant tous les utilisateurs du tenant avec les colonnes : Nom, Email, Rôle(s) (affichés sous forme de badges colorés), Boutique(s) Assignée(s) et Statut (Actif/Inactif). Un bouton "Nouvel Utilisateur" ouvre un formulaire demandant les informations de base et permettant l'assignation de un ou plusieurs rôles (multi-select) et de une ou plusieurs boutiques.

#### 4.4.5. Export des Ventes Consolidées (Story D.2)

**Page Export.** Une interface simple avec un sélecteur de plage de dates (DateRangePicker PrimeNG), des filtres optionnels (par boutique, par mode de paiement) et un bouton "Générer l'Export". Le fichier généré (CSV ou Excel) est téléchargé directement. Un indicateur de progression (spinner) s'affiche pendant la génération pour les exports volumineux.

---

## 5. Gestion des Rôles et Profil Actif (Story I.2)

La gestion de l'identité est un point critique de l'UX, gérée via Keycloak en backend et implémentée côté frontend via un mécanisme de "rôle actif".

**Écran de Connexion.** Interface épurée et centrée, avec le logo OmniShop 360 en haut, un formulaire d'authentification (Email/Mot de passe) et un lien "Mot de passe oublié". Le fond utilise un dégradé subtil ou une image de marque. Le formulaire est contenu dans une carte centrée (`max-width: 420px`).

**Sélecteur de Profil Actif.** Si l'utilisateur authentifié possède plusieurs rôles (ex: Tenant Admin ET Shop Admin de la boutique Paris), le système intercepte la navigation juste après le login. Une modale "Sélectionnez votre espace de travail" apparaît, listant les profils disponibles sous forme de grandes cartes cliquables. Chaque carte affiche l'icône du rôle, le nom du rôle, et le contexte associé (nom de la boutique pour les rôles locaux). Le rôle sélectionné est stocké dans le `localStorage` ou le state management (NgRx) sous la clé `active_role`.

**Changement à la Volée.** Une fois connecté, le profil actif est affiché dans le Header supérieur (badge avec le nom du rôle). Un menu déroulant permet de basculer vers un autre rôle autorisé sans avoir à ressaisir ses identifiants. L'interface (menu latéral, accès aux pages, permissions sur les actions) se reconfigure dynamiquement en fonction du rôle sélectionné. Si nécessaire, un header `x-active-role` est envoyé aux APIs backend pour signaler le contexte d'action.

---

## 6. Inventaire Complet des Pages et Composants

Pour garantir une couverture exhaustive des exigences fonctionnelles (Epics A à I), voici l'inventaire complet des pages à développer, classées par module Angular, avec la référence aux stories correspondantes.

### 6.1. Module Authentification (Core et Auth)

| Page / Composant | Description | Story |
| :--- | :--- | :--- |
| **Page de Connexion** | Formulaire Email/Mot de passe, lien "Mot de passe oublié". | - |
| **Modale "Choix du Profil Actif"** | Affiche les rôles disponibles sous forme de cartes cliquables pour les utilisateurs multi-rôles. | I.2 |
| **Page Mot de passe oublié** | Formulaire de réinitialisation via email. | - |
| **Page Initialisation Mot de passe** | Pour les nouveaux utilisateurs (Superadmin, Shop Admin créés par un admin). | - |

### 6.2. Module Point de Vente (POS) - Eager Loading

| Page / Composant | Description | Story |
| :--- | :--- | :--- |
| **Modale d'Ouverture de Caisse** | Saisie du fond de caisse initial avec pavé numérique. | E.1 |
| **Écran Principal POS** | Split-screen (desktop) ou vue mobile avec catalogue produits et panier. | C.1, E.2 |
| **Panneau "Recherche/Création Client"** | Drawer latéral pour rechercher ou créer un client en remplacement du "Client Divers". | C.4, F.1 |
| **Modale "Ajouter Promo / Remise"** | Onglets pour saisir un code promo ou sélectionner un niveau de prix. | E.3 |
| **Modale "Paiement Multiple"** | Pavé numérique, sélection des modes de paiement, affichage du reste à payer. | E.4 |
| **Écran "Succès et Impression"** | Confirmation de vente, rendu monnaie, choix du format d'impression (A4 / Thermique). | E.4 |
| **Modale de Clôture de Caisse** | Récapitulatif financier, saisie du montant compté, calcul et validation du reliquat. | E.1 |

### 6.3. Module Back-Office Boutique (Admin-Shop) - Lazy Loading

| Page / Composant | Description | Story |
| :--- | :--- | :--- |
| **Dashboard Boutique** | KPIs journaliers, graphique des ventes par heure, tableau des dernières transactions. | F.2 |
| **Page "Historique des Factures"** | DataTable de recherche avec filtres, bouton "Réimprimer Duplicata", menu d'actions. | F.1 |
| **Détail d'une Facture** | Affichage complet de la facture, bouton "Corriger" (Shop Admin), onglet "Piste d'Audit". | F.1, H.2 |
| **Page "Clients de la Boutique"** | DataTable des clients, formulaire de création/édition rapide en Drawer latéral. | F.1 |
| **Page "Mouvements de Caisse"** | Résumé du solde, liste des encaissements/décaissements, formulaire de saisie. | H.1 |
| **Page "Inventaire Local"** | DataTable des stocks par emplacement, alertes visuelles de stock minimum. | G.2 |
| **Page "Réception de Marchandises"** | Formulaire de bon de réception avec tableau éditable (produit, quantité, DLV, emplacement). | G.1, B.2 |
| **Page "Inventaire / Sondage"** | Interface optimisée tablette pour le comptage physique en rayon. | G.1 |
| **Page "Journaux de Ventes"** | Vue journalière et hebdomadaire des ventes avec agrégations par mode de paiement. | H.2 |
| **Page "Relevé de Caisse"** | Document imprimable récapitulant la journée de caisse (fond, ventes, mouvements, solde). | H.1 |

### 6.4. Module Administration Globale (Admin-Tenant) - Lazy Loading

| Page / Composant | Description | Story |
| :--- | :--- | :--- |
| **Dashboard Exécutif (BI)** | KPIs globaux consolidés, graphiques comparatifs des boutiques, tendances. | D.1 |
| **Rapport de Marge** | Tableau d'analyse CA vs COGS par boutique, marge brute en valeur et pourcentage. | D.3 |
| **Page "Export des Ventes"** | Sélecteur de dates, filtres, génération et téléchargement CSV/Excel. | D.2 |
| **Page "Réseau de Boutiques"** | Liste des boutiques avec statut, CA, bouton "Nouvelle Boutique". | A.1 |
| **Page "Configuration Boutique"** | Formulaire à onglets (Infos, Fiscalité, Paramètres POS, Personnel). | A.1, I.1 |
| **Page "Catalogue Maître"** | DataTable globale des produits avec filtres avancés. | B.1 |
| **Fiche Produit Maître** | Formulaire à onglets (Infos, Prix/Coûts, Variantes, Stock Agrégé). | B.1, B.4 |
| **Page "Catalogues Templates"** | Création et gestion de modèles de catalogues pour déploiement rapide. | I.1 |
| **Page "Utilisateurs et Rôles"** | DataTable des utilisateurs, assignation multi-rôles et multi-boutiques. | A.2, I.3 |
| **Page "Politique de Prix"** | Configuration globale (Imposé / Modifiable Localement) et niveaux de prix. | A.3 |
| **Page "Journaux Système"** | Consultation des logs globaux d'activité et d'audit. | I.4 |

---

## 7. Références

[1]: https://www.syncfusion.com/blogs/post/angular-component-libraries-in-2026 "Syncfusion. (2026). Top 10 Angular Component Libraries You Can't Miss in 2026."
[2]: https://www.primefaces.org/blog/sakai-free-angular-admin-template/ "PrimeFaces. (n.d.). Sakai - Free Angular Admin Template."
[3]: https://tailadmin.com/angular "TailAdmin. (n.d.). Free Angular Tailwind Admin Dashboard Template."
[4]: https://www.shopify.com/blog/shopify-pos-design-update "Shopify. (2025). Shopify POS: Designed for Your Brand, Built for Modern Retail."
