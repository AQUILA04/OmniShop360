# OmniShop360 - Configuration Keycloak (IaC avec Terraform)

Ce dossier contient la configuration Infrastructure as Code (IaC) pour Keycloak, utilisant Terraform pour automatiser la création et la gestion du realm, des clients, des rôles et des utilisateurs.

## Contenu

- **`main.tf`**: Configuration principale du realm OmniShop360, des clients OAuth2, des rôles et de l'utilisateur superadmin.
- **`variables.tf`**: Définition des variables Terraform.
- **`outputs.tf`**: Définition des outputs (IDs des clients, secrets, etc.).
- **`terraform.tfvars.example`**: Exemple de fichier de variables à copier et personnaliser.

## Prérequis

- Terraform 1.0+
- Keycloak en cours d'exécution (via Docker Compose ou autre)

## Configuration

1.  **Copier le fichier d'exemple** :

    ```bash
    cp terraform.tfvars.example terraform.tfvars
    ```

2.  **Modifier `terraform.tfvars`** :

    Ajustez les valeurs selon votre environnement. Les valeurs par défaut sont prévues pour un environnement de développement local.

    ```hcl
    keycloak_url            = "http://localhost:8080"
    keycloak_admin_username = "admin"
    keycloak_admin_password = "admin"

    superadmin_username         = "superadmin"
    superadmin_email            = "admin@omnishop360.com"
    superadmin_initial_password = "ChangeMe123!"
    ```

## Déploiement

1.  **Initialiser Terraform** :

    ```bash
    terraform init
    ```

2.  **Planifier les changements** :

    ```bash
    terraform plan
    ```

3.  **Appliquer la configuration** :

    ```bash
    terraform apply
    ```

    Terraform créera le realm `omnishop360`, les clients OAuth2 pour le frontend, le POS et le backend, les rôles, et l'utilisateur superadmin.

## Ressources Créées

- **Realm** : `omnishop360`
- **Clients OAuth2** :
    - `omnishop-frontend` (Public)
    - `omnishop-pos` (Public)
    - `omnishop-backend` (Confidential)
- **Rôles** :
    - `superadmin`
    - `tenant_admin`
    - `shop_admin`
    - `stock_manager`
    - `cashier`
    - `accountant`
- **Utilisateur** : `superadmin` (avec le rôle `superadmin`)

## Récupération du Secret du Backend

Le secret du client backend est sensible et n'est pas affiché par défaut. Pour le récupérer :

```bash
terraform output -raw backend_client_secret
```

## Mise à Jour de la Configuration

Pour mettre à jour la configuration Keycloak, modifiez les fichiers `.tf` et réexécutez `terraform apply`.
