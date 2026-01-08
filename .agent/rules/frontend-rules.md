---
trigger: always_on
---

Règles d'Architecture et Standards de Développement (Frontend)
Ce document définit les règles strictes à suivre pour tout développement sur le projet OmniShop360. Ces règles garantissent l'uniformité, la maintenabilité et le respect des principes DRY (Don't Repeat Yourself).

1. Architecture des Composants
1.1 Listes (Data Tables)
Héritage Obligatoire : Tout composant de liste DOIT étendre BaseListComponent<T>.
Responsabilité :
La gestion du chargement, pagination, et tri est gérée par la classe parent.
Le composant enfant ne doit implémenter que la configuration spécifique (columnsConfig, injection du service).
Routing : Si l'édition ne suit pas le pattern standard (/edit/:id), surchargez la méthode 
editItem()
.
1.2 Formulaires (Forms)
Utilisation de GenericFormComponent :
NE JAMAIS recréer manuellement un formulaire standard. Utilisez le tag <app-generic-form>.
Configuration : Passez toute la structure du formulaire via l'input [config].
Mode Page : Pour les formulaires qui sont des pages entières, TOUJOURS utiliser [mode]="'page'". Cela garantit le centrage et les marges uniformes.
Validation : Définissez les validateurs dans le FormGroup TypeScript.
2. Abstraction des Services
Héritage Obligatoire : Tout service de données DOIT étendre BaseCrudService<T, ID>.
Appels HTTP :
INTERDIT d'utiliser HttpClient directement pour les méthodes CRUD standard (
getAll
, 
getById
, 
create
, 
update
, 
delete
).
Surchargez uniquement si l'API backend dévie du standard (ex: adaptation de pagination).
API URL : Utilisez toujours environment.apiUrl pour construire les endpoints.
3. Standards UI/UX & Styling
3.1 Principe DRY (CSS)
Interdiction : NE JAMAIS écrire de CSS/SCSS spécifique dans un composant enfant pour corriger un défaut d'un composant parent/générique.
Solution : Si un composant générique (ex: 
GenericFormComponent
) s'affiche mal, corrigez le style DANS le composant générique lui-même.
Exemple : Ne pas ajouter de display: flex sur un bouton dans category-form.scss. Corriger le 
generic-form.component.scss
 pour que TOUS les formulaires en bénéficient.
3.2 Alignement et Classes Utilitaires
Tailwind : Privilégiez les classes utilitaires (flex, items-center, gap-2) pour la mise en page.
Overrides : Si des styles globaux (ex: Material) interfèrent, utilisez des règles CSS spécifiques (voire !important de manière ciblée et justifiée) dans le composant générique pour forcer le comportement attendu.
3.3 Routing
Structure : /tenant/{feature} pour la liste, /tenant/{feature}/create pour la création, /tenant/{feature}/:id pour l'édition.
4. Workflow de Développement
Vérifier l'existant : Avant de coder, vérifiez si un composant générique ou une classe de base existe.
Étendre : Étendez les classes de base.
Configurer : Configurez les génériques plutôt que de coder du HTML sur mesure.
Corriger à la source : Tout bug visuel récurrent doit être fixé à la racine (composant partagé).