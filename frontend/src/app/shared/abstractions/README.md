# Guide d'Architecture CRUD Générique

Ce module fournit une architecture **DRY (Don't Repeat Yourself)** pour accélérer le développement des fonctionnalités CRUD (Create, Read, Update, Delete) dans OmniShop360.

L'objectif est de minimiser le code boilerplate en utilisant l'héritage pour la logique et la composition pour l'affichage.

---

## 1. Service (API)

Votre service doit étendre `BaseCrudService`. Cela fournit automatiquement les méthodes `getAll`, `getById`, `create`, `update`, et `delete`.

**Exemple :**
```typescript
@Injectable({ providedIn: 'root' })
export class ShopService extends BaseCrudService<ShopResponse, string> {
  protected override get baseUrl(): string {
    return `${environment.apiUrl}/shops`;
  }
  
  constructor(http: HttpClient) { super(http); }
}
```

---

## 2. Liste (Vue Tableau)

### Étape A : Le Composant (TypeScript)
Votre composant doit étendre `BaseListComponent`. Il ne gère que la configuration.

**Exemple :**
```typescript
@Component({ ... })
export class ShopListComponent extends BaseListComponent<ShopResponse> {
  pageTitle = 'Gestion des Boutiques';
  
  columnsConfig: ColumnConfig[] = [
    { key: 'name', label: 'Nom', sortable: true },
    { key: 'city', label: 'Ville', sortable: true },
    { key: 'status', label: 'Statut', type: 'status' } // type: 'text' | 'date' | 'datetime' | 'status'
  ];

  constructor(protected shopService: ShopService) {
    super(shopService);
  }
}
```

### Étape B : Le Template (HTML)
Utilisez le composant `<app-generic-list>`.

**Exemple :**
```html
<app-generic-list
  [pageTitle]="pageTitle"
  [isLoading]="isLoading"
  [data]="data" 
  [columnsConfig]="columnsConfig"
  [resultsLength]="resultsLength"
  (pageChange)="onPageChange($event)"
  (sortChange)="onSortChange($event)"
  (searchChange)="onSearchChange($event)"
  (action)="onAction($event)">
</app-generic-list>
```

### Actions Spécifiques (Optionnel)
Pour ajouter des actions personnalisées dans le menu (ex: "Suspendre"), utilisez un `ng-template` :

```html
<app-generic-list ... [specificActionsTemplate]="myActions">
</app-generic-list>

<ng-template #myActions let-item>
  <button mat-menu-item (click)="myCustomAction(item)">
    <mat-icon>star</mat-icon> Favori
  </button>
</ng-template>
```

---

## 3. Détails (Vue Lecture Seule)

Votre composant doit étendre `BaseDetailsComponent`. Il définit les sections et les champs à afficher.

**Exemple :**
```typescript
@Component({
  templateUrl: '../../../../shared/abstractions/base-details.component.html', // Template générique
  styleUrls: ['../../../../shared/abstractions/base-details.component.scss']
})
export class ShopDetailsComponent extends BaseDetailsComponent<ShopResponse> {
  get pageTitle(): string { return `Détails : ${this.item?.name}`; }
  get backLink(): string { return '/shops'; }

  get sections(): SectionConfig[] {
    return [
      {
        title: 'Info Générale',
        fields: [
          { key: 'name', label: 'Nom', type: 'text' },
          { key: 'createdAt', label: 'Créé le', type: 'date' }
        ]
      }
    ];
  }
  
  constructor(protected shopService: ShopService) { super(shopService); }
}
```

---

## 4. Formulaire (Création / Édition)

Votre composant doit étendre `BaseFormComponent`. Il gère l'initialisation du `FormGroup` et le mapping des données.

**Exemple :**
```typescript
export class ShopFormComponent extends BaseFormComponent<ShopResponse> {
  constructor(protected shopService: ShopService) { super(shopService); }

  initForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      city: ['']
    });
  }

  patchForm(item: ShopResponse): void {
    this.form.patchValue(item);
  }

  getRedirectUrl(): string { return '/shops'; }
}
```

*Note : Le HTML du formulaire doit être écrit manuellement pour l'instant.*

---

## Résumé des Types de Configuration

### ColumnConfig (Liste)
- `key`: Nom de la propriété (ex: 'user.email')
- `label`: Titre de la colonne
- `type`: 'text', 'date', 'datetime', 'status', 'currency'
- `sortable`: boolean

### FieldConfig (Détails)
- `key`: Nom de la propriété
- `label`: Libellé
- `type`: Idem ColumnConfig
- `mapValue`: Fonction optionnelle pour transformer la valeur
