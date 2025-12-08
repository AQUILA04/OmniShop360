import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TenantCreateFormComponent } from './tenant-create-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TenantService } from '../../services/tenant.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('TenantCreateFormComponent', () => {
  let component: TenantCreateFormComponent;
  let fixture: ComponentFixture<TenantCreateFormComponent>;
  let tenantServiceSpy: jasmine.SpyObj<TenantService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TenantService', ['createTenant']);

    await TestBed.configureTestingModule({
      declarations: [ TenantCreateFormComponent ],
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: TenantService, useValue: spy }
      ]
    })
    .compileComponents();

    tenantServiceSpy = TestBed.inject(TenantService) as jasmine.SpyObj<TenantService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.tenantForm.get('companyName')?.value).toBe('');
    expect(component.tenantForm.get('contactEmail')?.value).toBe('');
    expect(component.tenantForm.get('adminFirstName')?.value).toBe('');
    expect(component.tenantForm.get('adminLastName')?.value).toBe('');
    expect(component.tenantForm.get('adminEmail')?.value).toBe('');
  });

  it('should validate required fields', () => {
    component.tenantForm.markAllAsTouched();
    expect(component.tenantForm.valid).toBeFalse();
    expect(component.tenantForm.get('companyName')?.hasError('required')).toBeTrue();
  });

  it('should validate email format', () => {
    component.tenantForm.controls['contactEmail'].setValue('invalid-email');
    expect(component.tenantForm.controls['contactEmail'].hasError('email')).toBeTrue();

    component.tenantForm.controls['contactEmail'].setValue('valid@example.com');
    expect(component.tenantForm.controls['contactEmail'].hasError('email')).toBeFalse();
  });

  it('should call createTenant service when form is valid and submitted', () => {
    component.tenantForm.setValue({
      companyName: 'Test Company',
      contactEmail: 'contact@test.com',
      adminFirstName: 'John',
      adminLastName: 'Doe',
      adminEmail: 'john@test.com'
    });

    tenantServiceSpy.createTenant.and.returnValue(of({} as any));

    component.onSubmit();

    expect(tenantServiceSpy.createTenant).toHaveBeenCalledWith({
      companyName: 'Test Company',
      contactEmail: 'contact@test.com',
      adminFirstName: 'John',
      adminLastName: 'Doe',
      adminEmail: 'john@test.com'
    });
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error when creation fails', () => {
    component.tenantForm.setValue({
      companyName: 'Test Company',
      contactEmail: 'contact@test.com',
      adminFirstName: 'John',
      adminLastName: 'Doe',
      adminEmail: 'john@test.com'
    });

    tenantServiceSpy.createTenant.and.returnValue(throwError(() => ({ error: { message: 'Error' } })));

    component.onSubmit();

    expect(tenantServiceSpy.createTenant).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  });
});
