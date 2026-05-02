import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPermissionsModule } from 'ngx-permissions';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Components
import { GenericListComponent } from './components/generic-list/generic-list.component';
import { GenericFormComponent } from './components/generic-form/generic-form.component';
import { UiButtonComponent } from './components/ui-button/ui-button.component';
import { UiCardComponent } from './components/ui-card/ui-card.component';
import { UiInputComponent } from './components/ui-input/ui-input.component';
import { UiKpiCardComponent } from './components/ui-kpi-card/ui-kpi-card.component';
import { UiActionChipComponent } from './components/ui-action-chip/ui-action-chip.component';
import { MobileCardListComponent } from './components/mobile-card-list/mobile-card-list.component';
import {NgSelectModule} from "@ng-select/ng-select";

const MATERIAL_MODULES = [
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatIconModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatMenuModule,
  MatMenuModule,
  MatSelectModule,
  MatTabsModule,
  MatRadioModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSlideToggleModule
];

const DECLARATIONS = [
  GenericListComponent,
  GenericFormComponent
];

const STANDALONE_COMPONENTS = [
  UiButtonComponent,
  UiCardComponent,
  UiInputComponent,
  UiKpiCardComponent,
  UiActionChipComponent,
  MobileCardListComponent
];

@NgModule({
  declarations: [
    ...DECLARATIONS
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    ...MATERIAL_MODULES,
    ...STANDALONE_COMPONENTS
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    NgxPermissionsModule,
    NgSelectModule,
    ...MATERIAL_MODULES,
    ...DECLARATIONS,
    ...STANDALONE_COMPONENTS
  ]
})
export class SharedModule { }
