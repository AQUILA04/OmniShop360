# User Story Details : US-017 - Export PDF et Excel

## Description
Permettre l'extraction des données pour usage externe (comptabilité, archivage physique).

## Spécifications Techniques
- **Format PDF :** Utilisation d'iText ou JasperReports. Génération côté serveur pour garantir l'intégrité.
- **Format Excel :** Utilisation d'Apache POI.
- **Structure du fichier :** En-tête avec logo de la boutique, période sélectionnée, tableau des ventes, et total final.

## Flux Utilisateur
1. L'utilisateur filtre ses ventes sur le dashboard.
2. Clique sur "Exporter".
3. Le backend génère le flux binaire (Blob).
4. Le frontend déclenche le téléchargement du fichier.

## Critères d'Acceptation
1. Le PDF est formaté en A4 avec pagination correcte.
2. Le fichier Excel contient des colonnes typées (dates, nombres) exploitables directement.