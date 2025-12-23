import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TenantListComponent } from './tenant-list.component';
import { TenantService } from '../../services/tenant.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '../../../../shared/shared.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastService } from '../../../../shared/services/toast.service';

describe('TenantListComponent', () => {
  let component: TenantListComponent;
  let fixture: ComponentFixture<TenantListComponent>;
  let tenantServiceSpy: jasmine.SpyObj<TenantService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    tenantServiceSpy = jasmine.createSpyObj('TenantService', ['getAll', 'delete', 'updateTenantStatus']);
    tenantServiceSpy.getAll.and.returnValue(of({
      content: [],
      page: { size: 10, number: 0, totalElements: 0, totalPages: 0 }
    }));

    toastServiceSpy = jasmine.createSpyObj('ToastService', ['showSuccess', 'showError']);

    await TestBed.configureTestingModule({
      declarations: [TenantListComponent],
      imports: [
        SharedModule,
        RouterTestingModule,
        HttpClientTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: TenantService, useValue: tenantServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy }
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
    expect(tenantServiceSpy.getAll).toHaveBeenCalled();
  });
});
