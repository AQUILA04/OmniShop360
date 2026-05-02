
---


#### 1. Architecture de communication

Le backend utilise **Spring Cloud Vault** pour intercepter le démarrage de l'application et injecter les secrets directement dans le contexte `Environment` de Spring, avant même que la base de données ne tente de se connecter.

#### 2. Configuration YAML (Bootstrap)

Ce fichier (`src/main/resources/bootstrap.yml`) est crucial car il définit comment l'application s'authentifie auprès du KMS.

```yaml
spring:
  cloud:
    vault:
      uri: https://vault.internal.corp:8200
      # Mode d'authentification recommandé pour le déploiement (AppRole ou Token)
      authentication: APPROLE
      app-role:
        role-id: ${VAULT_ROLE_ID}
        secret-id: ${VAULT_SECRET_ID}
      # Chemins des secrets dans Vault
      kv:
        enabled: true
        backend: secret
        default-context: retail-app-backend
      # Gestion dynamique des secrets de base de données (Rotation)
      database:
        enabled: true
        role: readonly-role
        backend: database

```

#### 3. Schéma de déploiement des secrets dans Vault

Voici comment les secrets doivent être organisés dans le moteur de stockage KV (Key-Value) de Vault :

| Path | Key | Value (Exemple) |
| --- | --- | --- |
| `secret/retail-app-backend` | `spring.datasource.password` | `Encrypted_Secret_Value` |
| `secret/retail-app-backend` | `keycloak.client-secret` | `bc23-4567-8901-...` |
| `secret/retail-app-backend` | `app.encryption.master-key` | `AES-256-Key-From-HSM` |

#### 4. Intégration du Transit Engine (Encryption as a Service)

Pour l'exigence de la Partie D concernant le **chiffrement au repos**, nous utilisons le moteur `Transit` de Vault. L'application ne stocke jamais la clé de chiffrement, elle envoie les données à Vault pour les chiffrer/déchiffrer.

**Exemple de Service Java :**

```java
@Service
public class EncryptionService {
    @Autowired
    private VaultOperations vaultOperations;

    public String encryptSensitiveData(String plainText) {
        // Envoie la donnée à Vault pour chiffrement via la clé 'retail-key'
        return vaultOperations.opsForTransit().encrypt("retail-key", plainText);
    }
}

```

---

### `docs/tech/V-018-hsm-strategy.md`

#### Approche HSM (Hardware Security Module) via KMS

Si vous utilisez un fournisseur Cloud ou un HSM physique, le principe de "Chiffrement Enveloppe" (Envelope Encryption) doit être appliqué pour les données de vente sensibles (ex: détails de paiement stockés) :

1. **Génération :** Vault demande au HSM de générer une **Master Key**.
2. **Protection :** Vault utilise cette clé pour chiffrer ses propres clés de stockage (Unseal keys).
3. **Isolation :** Les clés de données (DEK) utilisées par l'application sont isolées et tournées régulièrement sans intervention humaine.

---