# User Story Details : US-018 - Sécurité de l'Infrastructure (KMS/HSM)

## Description
Spécification technique pour la gestion des secrets et le chiffrement des données sensibles, conformément aux exigences de la Partie D du PRD.

## Document Technique de Spécification
### 1. Librairie & Outil choisi
- **Outil :** HashiCorp Vault (Open Source).
- **Raison :** Permet une gestion centralisée des secrets, l'injection dynamique dans Spring Boot et le support du transit data encryption.

### 2. Normes de Sécurité Appliquées
- **FIPS 140-2 :** Conformité pour la génération des clés.
- **TLS 1.2+ :** Pour tous les échanges entre l'application et le KMS.
- **Secret Rotation :** Politique de rotation automatique des clés de base de données tous les 90 jours.

### 3. Approche d'Intégration (Enveloppe Encryption)
L'application ne stocke jamais la clé de chiffrement principale (Master Key).
1. Le KMS génère une **Data Encryption Key (DEK)**.
2. La DEK est chiffrée par la **Master Key (MK)** du HSM.
3. Seule la DEK chiffrée est stockée en base. Pour déchiffrer une donnée, l'app demande au KMS de déchiffrer la DEK.



## Critères d'Acceptation
1. Aucun mot de passe n'apparaît dans les fichiers `application.properties` ou `docker-compose.yml`.
2. L'application démarre en récupérant ses credentials via le token Vault.