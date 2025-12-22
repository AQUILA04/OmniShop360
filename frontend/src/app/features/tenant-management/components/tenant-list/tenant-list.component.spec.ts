import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TenantListComponent } from './tenant-list.component';
import { TenantService } from '../../services/tenant.service';
import { of } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TenantListComponent', () => {
  let component: TenantListComponent;
  let fixture: ComponentFixture<TenantListComponent>;
  let tenantServiceSpy: jasmine.SpyObj<TenantService>;

  beforeEach(async () => {
    tenantServiceSpy = jasmine.createSpyObj('TenantService', ['getTenants', 'deleteTenant', 'updateTenantStatus']);
    tenantServiceSpy.getTenants.and.returnValue(of({
      content: [],
      page: { size: 10, number: 0, totalElements: 0, totalPages: 0 }
    }));

    await TestBed.configureTestingModule({
      declarations: [TenantListComponent],
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatSnackBarModule,
        MatDialogModule,
        MatIconModule,
        MatMenuModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: TenantService, useValue: tenantServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tenants on init', () => {
    expect(tenantServiceSpy.getTenants).toHaveBeenCalled();
  });
});
