import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TenantCreateFormComponent } from './tenant-create-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TenantService } from '../../services/tenant.service';
import { of } from 'rxjs';

describe('TenantCreateFormComponent', () => {
  let component: TenantCreateFormComponent;
  let fixture: ComponentFixture<TenantCreateFormComponent>;
  let tenantServiceSpy: jasmine.SpyObj<TenantService>;

  beforeEach(async () => {
    tenantServiceSpy = jasmine.createSpyObj('TenantService', ['createTenant', 'getTenantById', 'updateTenant']);

    await TestBed.configureTestingModule({
      declarations: [TenantCreateFormComponent],
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSnackBarModule,
        NoopAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: TenantService, useValue: tenantServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form', () => {
    expect(component.tenantForm).toBeDefined();
    expect(component.tenantForm.get('companyName')).toBeDefined();
  });
});
