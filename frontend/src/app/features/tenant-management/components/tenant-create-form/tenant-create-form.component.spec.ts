import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TenantCreateFormComponent } from './tenant-create-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TenantService } from '../../services/tenant.service';
import { SharedModule } from '../../../../shared/shared.module';
import { ToastService } from '../../../../shared/services/toast.service';

describe('TenantCreateFormComponent', () => {
  let component: TenantCreateFormComponent;
  let fixture: ComponentFixture<TenantCreateFormComponent>;
  let tenantServiceSpy: jasmine.SpyObj<TenantService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    tenantServiceSpy = jasmine.createSpyObj('TenantService', ['create', 'getById', 'update']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['showSuccess', 'showError']);

    await TestBed.configureTestingModule({
      declarations: [TenantCreateFormComponent],
      imports: [
        SharedModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: TenantService, useValue: tenantServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy }
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

  it('should initialize form config', () => {
    component.initForm();
    expect(component.formConfig.length).toBeGreaterThan(0);
  });
});
