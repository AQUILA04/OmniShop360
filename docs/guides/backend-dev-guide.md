# Guide de Développement Backend - OmniShop360

Ce guide fournit toutes les informations nécessaires pour développer les fonctionnalités backend du projet OmniShop360.

---

## Architecture

Le backend suit une **architecture hexagonale** (Ports & Adapters) avec les couches suivantes :

```
src/main/java/com/omnishop360/backend/
├── domain/          # Entités métier et logique métier
│   ├── entity/      # Entités JPA
│   ├── repository/  # Interfaces de repository
│   └── service/     # Services métier
├── application/     # Cas d'utilisation et DTOs
│   ├── dto/         # Data Transfer Objects
│   └── usecase/     # Cas d'utilisation
├── infrastructure/  # Implémentations techniques
│   ├── adapter/     # Adaptateurs externes (Keycloak, Email, etc.)
│   ├── config/      # Configurations Spring
│   └── persistence/ # Implémentations JPA
└── web/             # Couche présentation (REST API)
    ├── controller/  # Contrôleurs REST
    ├── dto/         # DTOs spécifiques à l'API
    └── exception/   # Gestion des exceptions
```

---

## Stack Technique

- **Framework** : Spring Boot 3.4
- **Langage** : Java 21
- **Base de données** : PostgreSQL 16
- **Cache** : Redis 7
- **Sécurité** : Spring Security + OAuth2 (Keycloak)
- **Migration DB** : Flyway
- **Tests** : JUnit 5, Mockito, Testcontainers
- **Build** : Maven

---

## Configuration de l'Environnement

### Prérequis

- Java 21 (OpenJDK ou Oracle JDK)
- Docker et Docker Compose
- IDE (IntelliJ IDEA recommandé)
- Maven (wrapper inclus)

### Démarrage Local

1. **Démarrer les services Docker** :
   ```bash
   cd deploy/dev
   docker-compose up -d postgres redis keycloak maildev
   ```

2. **Vérifier que les services sont prêts** :
   - PostgreSQL : `localhost:5432`
   - Redis : `localhost:6379`
   - Keycloak : `http://localhost:8081`
   - MailDev : `http://localhost:1080`

3. **Lancer le backend** :
   ```bash
   cd backend
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
   ```

4. **Accéder à l'API** :
   - API : `http://localhost:8080`
   - Swagger UI : `http://localhost:8080/swagger-ui.html`
   - Actuator : `http://localhost:8080/actuator`

---

## Conventions de Code

### Nommage

- **Packages** : `com.omnishop360.backend.{layer}.{feature}`
- **Classes** :
  - Entités : `{Entity}` (ex: `Tenant`, `User`)
  - Services : `{Entity}Service` (ex: `TenantService`)
  - Controllers : `{Entity}Controller` (ex: `TenantController`)
  - DTOs : `{Action}{Entity}Request/Response` (ex: `CreateTenantRequest`)
  - Repositories : `{Entity}Repository`

### Structure d'un Contrôleur

```java
@RestController
@RequestMapping("/api/v1/tenants")
@RequiredArgsConstructor
@Slf4j
public class TenantController {

    private final TenantService tenantService;

    @PostMapping
    @PreAuthorize("hasRole('superadmin')")
    public ResponseEntity<TenantResponse> createTenant(
            @Valid @RequestBody CreateTenantRequest request) {
        log.info("Creating tenant: {}", request.getCompanyName());
        TenantResponse response = tenantService.createTenant(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
```

### Structure d'un Service

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class TenantService {

    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final KeycloakAdminClient keycloakClient;
    private final EmailService emailService;

    @Transactional
    public TenantResponse createTenant(CreateTenantRequest request) {
        // 1. Validate
        validateTenantRequest(request);
        
        // 2. Create Tenant
        Tenant tenant = new Tenant();
        tenant.setCompanyName(request.getCompanyName());
        tenant.setContactEmail(request.getContactEmail());
        tenant.setStatus(TenantStatus.ACTIVE);
        tenant = tenantRepository.save(tenant);
        
        // 3. Create Admin User in Keycloak
        String keycloakId = keycloakClient.createUser(
            request.getAdminEmail(),
            request.getAdminFirstName(),
            request.getAdminLastName(),
            "tenant_admin"
        );
        
        // 4. Save User locally
        User admin = new User();
        admin.setTenantId(tenant.getId());
        admin.setEmail(request.getAdminEmail());
        admin.setFirstName(request.getAdminFirstName());
        admin.setLastName(request.getAdminLastName());
        admin.setKeycloakId(keycloakId);
        admin = userRepository.save(admin);
        
        // 5. Send invitation email
        emailService.sendInvitation(admin.getEmail(), keycloakId);
        
        // 6. Return response
        return TenantResponse.from(tenant, admin);
    }
}
```

---

## Tests

### Tests Unitaires

Les tests unitaires utilisent **Mockito** pour mocker les dépendances.

**Exemple** :

```java
@ExtendWith(MockitoExtension.class)
class TenantServiceTest {

    @Mock
    private TenantRepository tenantRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private KeycloakAdminClient keycloakClient;
    
    @Mock
    private EmailService emailService;
    
    @InjectMocks
    private TenantService tenantService;

    @Test
    @DisplayName("Should create tenant successfully")
    void shouldCreateTenantSuccessfully() {
        // Given
        CreateTenantRequest request = new CreateTenantRequest(
            "ACME Corp", "contact@acme.com",
            "John", "Doe", "john@acme.com"
        );
        
        Tenant savedTenant = new Tenant();
        savedTenant.setId(UUID.randomUUID());
        savedTenant.setCompanyName("ACME Corp");
        
        when(tenantRepository.save(any(Tenant.class)))
            .thenReturn(savedTenant);
        when(keycloakClient.createUser(anyString(), anyString(), anyString(), anyString()))
            .thenReturn("keycloak-id-123");
        
        // When
        TenantResponse response = tenantService.createTenant(request);
        
        // Then
        assertNotNull(response);
        assertEquals("ACME Corp", response.getCompanyName());
        verify(tenantRepository).save(any(Tenant.class));
        verify(keycloakClient).createUser(
            eq("john@acme.com"),
            eq("John"),
            eq("Doe"),
            eq("tenant_admin")
        );
        verify(emailService).sendInvitation(eq("john@acme.com"), eq("keycloak-id-123"));
    }
}
```

### Tests d'Intégration

Les tests d'intégration utilisent **Testcontainers** pour démarrer PostgreSQL et Keycloak.

**Exemple** :

```java
@SpringBootTest
@Testcontainers
@ActiveProfiles("test")
class TenantControllerIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
        .withDatabaseName("omnishop_test")
        .withUsername("test")
        .withPassword("test");
    
    @Container
    static GenericContainer<?> keycloak = new GenericContainer<>("quay.io/keycloak/keycloak:23.0")
        .withExposedPorts(8080)
        .withEnv("KEYCLOAK_ADMIN", "admin")
        .withEnv("KEYCLOAK_ADMIN_PASSWORD", "admin")
        .withCommand("start-dev");

    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private TenantRepository tenantRepository;

    @BeforeEach
    void setUp() {
        tenantRepository.deleteAll();
    }

    @Test
    @WithMockUser(roles = "superadmin")
    @DisplayName("POST /api/v1/tenants should create tenant")
    void shouldCreateTenant() throws Exception {
        // Given
        String requestBody = """
            {
              "companyName": "ACME Corp",
              "contactEmail": "contact@acme.com",
              "adminFirstName": "John",
              "adminLastName": "Doe",
              "adminEmail": "john@acme.com"
            }
            """;
        
        // When & Then
        mockMvc.perform(post("/api/v1/tenants")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.companyName").value("ACME Corp"))
            .andExpect(jsonPath("$.admin.email").value("john@acme.com"));
        
        // Verify in database
        List<Tenant> tenants = tenantRepository.findAll();
        assertEquals(1, tenants.size());
        assertEquals("ACME Corp", tenants.get(0).getCompanyName());
    }
}
```

### Lancer les Tests

```bash
# Tests unitaires uniquement
./mvnw test

# Tests d'intégration uniquement
./mvnw verify -Dskip.unit.tests=true

# Tous les tests
./mvnw verify

# Avec couverture de code
./mvnw verify jacoco:report
```

---

## Gestion des Erreurs

Utiliser `@ControllerAdvice` pour centraliser la gestion des exceptions :

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(EntityNotFoundException ex) {
        log.warn("Entity not found: {}", ex.getMessage());
        ErrorResponse error = new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.NOT_FOUND.value(),
            "Not Found",
            ex.getMessage(),
            null
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors()
            .stream()
            .map(err -> new FieldError(err.getField(), err.getDefaultMessage()))
            .toList();
        
        ErrorResponse error = new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.BAD_REQUEST.value(),
            "Bad Request",
            "Validation failed",
            fieldErrors
        );
        return ResponseEntity.badRequest().body(error);
    }
}
```

---

## Sécurité

### Authentification

L'authentification est gérée par **Keycloak** via OAuth2/JWT.

### Autorisation

Utiliser `@PreAuthorize` pour sécuriser les endpoints :

```java
@PreAuthorize("hasRole('superadmin')")
@PostMapping
public ResponseEntity<TenantResponse> createTenant(...) { }

@PreAuthorize("hasAnyRole('superadmin', 'tenant_admin')")
@GetMapping("/{id}")
public ResponseEntity<TenantResponse> getTenant(...) { }
```

### Multi-Tenancy

Utiliser le `TenantContext` pour isoler les données :

```java
@Component
public class TenantContext {
    private static final ThreadLocal<UUID> currentTenant = new ThreadLocal<>();
    
    public static void setTenantId(UUID tenantId) {
        currentTenant.set(tenantId);
    }
    
    public static UUID getTenantId() {
        return currentTenant.get();
    }
    
    public static void clear() {
        currentTenant.remove();
    }
}
```

---

## Checklist avant Pull Request

- [ ] Le code compile sans erreur
- [ ] Tous les tests passent (unitaires + intégration)
- [ ] La couverture de code est maintenue/augmentée
- [ ] Le code respecte les conventions de nommage
- [ ] Les logs sont appropriés (INFO pour les actions importantes, DEBUG pour les détails)
- [ ] Les exceptions sont gérées correctement
- [ ] La documentation est à jour (JavaDoc, README, contrats API)
- [ ] Les migrations Flyway sont créées si nécessaire
- [ ] Le contrat API est respecté
- [ ] Les secrets ne sont pas hardcodés

---

**Maintenu par :** Scrum Master  
**Dernière mise à jour :** 2025-12-08
