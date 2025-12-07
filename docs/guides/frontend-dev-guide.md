# Guide de Développement Frontend - OmniShop360

Ce guide fournit toutes les informations nécessaires pour développer les fonctionnalités frontend du projet OmniShop360.

---

## Architecture

Le frontend suit une **architecture modulaire** avec lazy loading et réutilisation maximale des composants.

```
src/app/
├── core/                 # Fonctionnalités core (singleton)
│   ├── auth/            # Authentification et autorisation
│   ├── guards/          # Route guards
│   ├── interceptors/    # HTTP interceptors
│   └── services/        # Services globaux
├── shared/              # Composants et services partagés
│   ├── components/      # Composants réutilisables
│   ├── directives/      # Directives personnalisées
│   ├── pipes/           # Pipes personnalisés
│   └── models/          # Interfaces et types TypeScript
├── features/            # Modules fonctionnels (lazy loaded)
│   ├── tenant-management/
│   ├── shop-management/
│   ├── product-catalog/
│   └── ...
└── layout/              # Composants de layout (header, sidebar, etc.)
```

---

## Stack Technique

- **Framework** : Angular 17
- **UI Library** : Angular Material
- **State Management** : Services avec RxJS
- **Authentification** : angular-oauth2-oidc
- **HTTP Client** : Angular HttpClient
- **Tests** : Jasmine + Karma
- **Package Manager** : pnpm

---

## Configuration de l'Environnement

### Prérequis

- Node.js 22
- pnpm 10
- IDE (VS Code ou WebStorm recommandé)

### Démarrage Local

1. **Installer les dépendances** :
   ```bash
   cd frontend
   pnpm install
   ```

2. **Démarrer le serveur de développement** :
   ```bash
   pnpm start
   # ou
   pnpm run start
   ```

3. **Accéder à l'application** :
   - URL : `http://localhost:4200`
   - Hot reload activé

4. **Lancer les tests** :
   ```bash
   pnpm test          # Tests unitaires
   pnpm test:coverage # Avec couverture
   ```

---

## Conventions de Code

### Nommage

- **Composants** : `{feature}-{type}.component.ts` (ex: `tenant-list.component.ts`)
- **Services** : `{feature}.service.ts` (ex: `tenant.service.ts`)
- **Models** : `{entity}.model.ts` (ex: `tenant.model.ts`)
- **Guards** : `{feature}.guard.ts` (ex: `auth.guard.ts`)
- **Interceptors** : `{feature}.interceptor.ts` (ex: `auth.interceptor.ts`)

### Structure d'un Module Fonctionnel

```
features/tenant-management/
├── components/
│   ├── tenant-list/
│   │   ├── tenant-list.component.ts
│   │   ├── tenant-list.component.html
│   │   ├── tenant-list.component.scss
│   │   └── tenant-list.component.spec.ts
│   └── tenant-create/
│       ├── tenant-create.component.ts
│       ├── tenant-create.component.html
│       ├── tenant-create.component.scss
│       └── tenant-create.component.spec.ts
├── services/
│   └── tenant.service.ts
├── models/
│   └── tenant.model.ts
├── tenant-management-routing.module.ts
└── tenant-management.module.ts
```

---

## Composants Réutilisables

### Principes

1. **Un composant = Une responsabilité**
2. **Inputs/Outputs explicites**
3. **Pas de logique métier dans les composants**
4. **OnPush Change Detection** pour les performances

### Exemple de Composant Réutilisable

**shared/components/data-table/data-table.component.ts** :

```typescript
@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent<T> implements OnInit {
  @Input() data: T[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() loading = false;
  @Input() pageSize = 20;
  @Input() totalElements = 0;
  
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() sortChange = new EventEmitter<Sort>();
  @Output() rowClick = new EventEmitter<T>();

  dataSource = new MatTableDataSource<T>();
  displayedColumns: string[] = [];

  ngOnInit(): void {
    this.displayedColumns = this.columns.map(col => col.key);
    this.dataSource.data = this.data;
  }

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }

  onSortChange(sort: Sort): void {
    this.sortChange.emit(sort);
  }

  onRowClick(row: T): void {
    this.rowClick.emit(row);
  }
}
```

**Utilisation** :

```typescript
<app-data-table
  [data]="tenants"
  [columns]="columns"
  [loading]="loading"
  [totalElements]="totalElements"
  (pageChange)="onPageChange($event)"
  (sortChange)="onSortChange($event)"
  (rowClick)="onRowClick($event)">
</app-data-table>
```

---

## Services

### Structure d'un Service

```typescript
@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private readonly apiUrl = `${environment.apiUrl}/tenants`;

  constructor(private http: HttpClient) {}

  createTenant(request: CreateTenantRequest): Observable<TenantResponse> {
    return this.http.post<TenantResponse>(this.apiUrl, request).pipe(
      tap(response => console.log('Tenant created:', response)),
      catchError(this.handleError)
    );
  }

  getTenants(params: TenantQueryParams): Observable<PagedResponse<TenantResponse>> {
    const httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('size', params.size.toString())
      .set('sort', params.sort);

    return this.http.get<PagedResponse<TenantResponse>>(this.apiUrl, { params: httpParams }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
```

### Modèles TypeScript

Créer des interfaces correspondant aux contrats API :

```typescript
// models/tenant.model.ts
export interface TenantResponse {
  id: string;
  companyName: string;
  contactEmail: string;
  status: TenantStatus;
  createdAt: string;
  admin?: UserResponse;
}

export interface CreateTenantRequest {
  companyName: string;
  contactEmail: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
}

export enum TenantStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED'
}

export interface PagedResponse<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}
```

---

## Authentification

### Configuration OAuth2

**core/auth/auth.service.ts** :

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private oauthService: OAuthService) {
    this.configure();
  }

  private configure(): void {
    const authConfig: AuthConfig = {
      issuer: environment.keycloakUrl + '/realms/omnishop360',
      redirectUri: window.location.origin,
      clientId: 'omnishop-frontend',
      responseType: 'code',
      scope: 'openid profile email',
      showDebugInformation: !environment.production
    };

    this.oauthService.configure(authConfig);
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  login(): void {
    this.oauthService.initCodeFlow();
  }

  logout(): void {
    this.oauthService.logOut();
  }

  isAuthenticated(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  getUserProfile(): UserProfile | null {
    const claims = this.oauthService.getIdentityClaims();
    if (!claims) return null;

    return {
      id: claims['sub'],
      email: claims['email'],
      firstName: claims['given_name'],
      lastName: claims['family_name'],
      roles: claims['realm_access']?.roles || []
    };
  }

  hasRole(role: string): boolean {
    const profile = this.getUserProfile();
    return profile?.roles.includes(role) || false;
  }
}
```

### Auth Guard

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      this.authService.login();
      return false;
    }

    const requiredRole = route.data['role'];
    if (requiredRole && !this.authService.hasRole(requiredRole)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}
```

### HTTP Interceptor

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private oauthService: OAuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.oauthService.getAccessToken();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req);
  }
}
```

---

## Gestion des Formulaires

### Reactive Forms avec Validation

```typescript
@Component({
  selector: 'app-tenant-create',
  templateUrl: './tenant-create.component.html'
})
export class TenantCreateComponent implements OnInit {
  tenantForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private tenantService: TenantService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tenantForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(3)]],
      contactEmail: ['', [Validators.required, Validators.email]],
      adminFirstName: ['', [Validators.required, Validators.minLength(2)]],
      adminLastName: ['', [Validators.required, Validators.minLength(2)]],
      adminEmail: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.tenantForm.invalid) {
      this.tenantForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const request: CreateTenantRequest = this.tenantForm.value;

    this.tenantService.createTenant(request).subscribe({
      next: (response) => {
        this.snackBar.open('Tenant created successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/tenants']);
      },
      error: (error) => {
        this.snackBar.open(error.message, 'Close', { duration: 5000 });
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.tenantForm.get(fieldName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'This field is required';
    if (control.errors['email']) return 'Invalid email format';
    if (control.errors['minlength']) {
      return `Minimum ${control.errors['minlength'].requiredLength} characters`;
    }

    return 'Invalid field';
  }
}
```

---

## Tests

### Test d'un Service

```typescript
describe('TenantService', () => {
  let service: TenantService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TenantService]
    });

    service = TestBed.inject(TenantService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create tenant', () => {
    const mockRequest: CreateTenantRequest = {
      companyName: 'ACME',
      contactEmail: 'contact@acme.com',
      adminFirstName: 'John',
      adminLastName: 'Doe',
      adminEmail: 'john@acme.com'
    };

    const mockResponse: TenantResponse = {
      id: '123',
      companyName: 'ACME',
      contactEmail: 'contact@acme.com',
      status: TenantStatus.ACTIVE,
      createdAt: '2025-12-08T10:00:00Z'
    };

    service.createTenant(mockRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tenants`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  });
});
```

### Test d'un Composant

```typescript
describe('TenantListComponent', () => {
  let component: TenantListComponent;
  let fixture: ComponentFixture<TenantListComponent>;
  let tenantService: jasmine.SpyObj<TenantService>;

  beforeEach(async () => {
    const tenantServiceSpy = jasmine.createSpyObj('TenantService', ['getTenants']);

    await TestBed.configureTestingModule({
      declarations: [TenantListComponent],
      imports: [MatTableModule, MatPaginatorModule],
      providers: [
        { provide: TenantService, useValue: tenantServiceSpy }
      ]
    }).compileComponents();

    tenantService = TestBed.inject(TenantService) as jasmine.SpyObj<TenantService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantListComponent);
    component = fixture.componentInstance;
  });

  it('should load tenants on init', () => {
    const mockTenants: TenantResponse[] = [
      { id: '1', companyName: 'ACME', contactEmail: 'contact@acme.com', status: TenantStatus.ACTIVE, createdAt: '2025-12-08' }
    ];

    tenantService.getTenants.and.returnValue(of({
      content: mockTenants,
      page: { size: 20, number: 0, totalElements: 1, totalPages: 1 }
    }));

    fixture.detectChanges();

    expect(component.tenants).toEqual(mockTenants);
    expect(tenantService.getTenants).toHaveBeenCalled();
  });
});
```

---

## Checklist avant Pull Request

- [ ] Le code compile sans erreur
- [ ] Tous les tests passent
- [ ] Les composants suivent la structure modulaire
- [ ] Les composants réutilisables sont dans `shared/`
- [ ] Les services utilisent des Observables
- [ ] Les formulaires ont une validation appropriée
- [ ] Les erreurs sont gérées et affichées à l'utilisateur
- [ ] Les modèles TypeScript correspondent aux contrats API
- [ ] Le code respecte les conventions de nommage Angular
- [ ] Les imports sont organisés (Angular, RxJS, Material, app)
- [ ] Pas de `any` sans justification
- [ ] Les souscriptions sont unsubscribe (ou async pipe)

---

**Maintenu par :** Scrum Master  
**Dernière mise à jour :** 2025-12-08
