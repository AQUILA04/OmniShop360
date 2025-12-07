# Frontend Application Structure

Cette structure suit les meilleures pratiques Angular pour une application modulaire, scalable et maintenable.

## Organisation des Dossiers

### `core/`
Contient les fonctionnalités singleton de l'application (services globaux, guards, interceptors).

**Règle :** Importé **une seule fois** dans `AppModule`.

```
core/
├── auth/           # Services d'authentification
├── guards/         # Route guards (AuthGuard, RoleGuard, etc.)
├── interceptors/   # HTTP interceptors (AuthInterceptor, ErrorInterceptor)
├── services/       # Services globaux (NotificationService, etc.)
└── core.module.ts  # Module core avec guard contre double import
```

### `shared/`
Contient les composants, directives, pipes et modèles réutilisables dans toute l'application.

**Règle :** Importé dans **tous les modules** qui en ont besoin.

```
shared/
├── components/     # Composants réutilisables
│   ├── data-table/
│   ├── loading-spinner/
│   ├── confirmation-dialog/
│   └── form-field/
├── directives/     # Directives personnalisées
├── pipes/          # Pipes personnalisés
├── models/         # Interfaces et types TypeScript globaux
└── shared.module.ts
```

### `features/`
Contient les modules fonctionnels de l'application, chargés en lazy loading.

**Règle :** Chaque feature est **autonome** et **lazy loaded**.

```
features/
├── tenant-management/
│   ├── components/
│   │   ├── tenant-list/
│   │   └── tenant-create/
│   ├── services/
│   │   └── tenant.service.ts
│   ├── models/
│   │   └── tenant.model.ts
│   ├── tenant-management-routing.module.ts
│   └── tenant-management.module.ts
├── shop-management/
├── product-catalog/
└── ...
```

### `layout/`
Contient les composants de mise en page (header, sidebar, footer).

```
layout/
├── header/
├── sidebar/
└── footer/
```

## Conventions de Nommage

| Type | Convention | Exemple |
|:---|:---|:---|
| Component | `{feature}-{type}.component.ts` | `tenant-list.component.ts` |
| Service | `{feature}.service.ts` | `tenant.service.ts` |
| Model | `{entity}.model.ts` | `tenant.model.ts` |
| Module | `{feature}.module.ts` | `tenant-management.module.ts` |
| Guard | `{feature}.guard.ts` | `auth.guard.ts` |
| Interceptor | `{feature}.interceptor.ts` | `auth.interceptor.ts` |
| Directive | `{name}.directive.ts` | `highlight.directive.ts` |
| Pipe | `{name}.pipe.ts` | `format-date.pipe.ts` |

## Flux de Données

```
Component
    ↓ (appelle)
Service
    ↓ (HTTP)
Backend API
    ↓ (réponse)
Service
    ↓ (Observable)
Component
    ↓ (affiche)
Template
```

## Bonnes Pratiques

### 1. Lazy Loading

Tous les modules fonctionnels doivent être lazy loaded :

```typescript
// app-routing.module.ts
const routes: Routes = [
  {
    path: 'tenants',
    loadChildren: () => import('./features/tenant-management/tenant-management.module')
      .then(m => m.TenantManagementModule),
    canActivate: [AuthGuard],
    data: { role: 'superadmin' }
  }
];
```

### 2. OnPush Change Detection

Utiliser `ChangeDetectionStrategy.OnPush` pour les composants réutilisables :

```typescript
@Component({
  selector: 'app-data-table',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent { }
```

### 3. Unsubscribe

Toujours unsubscribe des Observables (ou utiliser `async` pipe) :

```typescript
// Méthode 1 : async pipe (recommandé)
<div *ngIf="tenants$ | async as tenants">

// Méthode 2 : takeUntil
private destroy$ = new Subject<void>();

ngOnInit() {
  this.service.getData()
    .pipe(takeUntil(this.destroy$))
    .subscribe(...);
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

### 4. Typage Fort

Toujours typer les variables et les retours de fonction :

```typescript
// ❌ Mauvais
getData() {
  return this.http.get('/api/data');
}

// ✅ Bon
getData(): Observable<DataResponse[]> {
  return this.http.get<DataResponse[]>('/api/data');
}
```

### 5. Smart vs Dumb Components

- **Smart Components** (Container) : Gèrent la logique et les données
- **Dumb Components** (Presentational) : Affichent les données via `@Input()` et émettent des événements via `@Output()`

```typescript
// Smart Component
@Component({
  selector: 'app-tenant-list-container',
  template: '<app-tenant-list [tenants]="tenants$ | async" (create)="onCreate()"></app-tenant-list>'
})
export class TenantListContainerComponent {
  tenants$ = this.tenantService.getTenants();
  
  onCreate() { ... }
}

// Dumb Component
@Component({
  selector: 'app-tenant-list',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantListComponent {
  @Input() tenants: Tenant[] = [];
  @Output() create = new EventEmitter<void>();
}
```

## Checklist pour Nouveau Module

- [ ] Créer le dossier dans `features/`
- [ ] Créer le module avec routing
- [ ] Créer les modèles TypeScript dans `models/`
- [ ] Créer le service dans `services/`
- [ ] Créer les composants dans `components/`
- [ ] Ajouter le lazy loading dans `app-routing.module.ts`
- [ ] Ajouter les guards si nécessaire
- [ ] Créer les tests unitaires

## Ressources

- [Angular Style Guide](https://angular.io/guide/styleguide)
- [Angular Material](https://material.angular.io/)
- [RxJS Documentation](https://rxjs.dev/)

---

**Maintenu par :** Équipe Frontend  
**Dernière mise à jour :** 2025-12-08
