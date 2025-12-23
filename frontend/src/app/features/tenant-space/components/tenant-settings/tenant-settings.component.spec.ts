import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TenantSettingsComponent } from './tenant-settings.component';
import { TenantSettingsService } from '../../services/tenant-settings.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { PricePolicy, TenantSettings } from '../../models/tenant-settings.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TenantSettingsComponent', () => {
    let component: TenantSettingsComponent;
    let fixture: ComponentFixture<TenantSettingsComponent>;
    let mockSettingsService: jasmine.SpyObj<TenantSettingsService>;
    let mockToastr: jasmine.SpyObj<ToastrService>;

    const mockSettings: TenantSettings = {
        pricePolicy: PricePolicy.GLOBAL_ENFORCED
    };

    beforeEach(async () => {
        mockSettingsService = jasmine.createSpyObj('TenantSettingsService', ['getSettings', 'updateSettings']);
        mockToastr = jasmine.createSpyObj('ToastrService', ['success', 'error']);

        mockSettingsService.getSettings.and.returnValue(of(mockSettings));
        mockSettingsService.updateSettings.and.returnValue(of(mockSettings));

        await TestBed.configureTestingModule({
            declarations: [TenantSettingsComponent],
            imports: [ReactiveFormsModule],
            providers: [
                FormBuilder,
                { provide: TenantSettingsService, useValue: mockSettingsService },
                { provide: ToastrService, useValue: mockToastr }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TenantSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load settings on init', () => {
        expect(mockSettingsService.getSettings).toHaveBeenCalled();
        expect(component.form.get('pricePolicy')?.value).toBe(PricePolicy.GLOBAL_ENFORCED);
    });

    it('should call updateSettings on submit', () => {
        component.form.patchValue({ pricePolicy: PricePolicy.LOCAL_ALLOWED });
        component.onSubmit();

        expect(mockSettingsService.updateSettings).toHaveBeenCalledWith({ pricePolicy: PricePolicy.LOCAL_ALLOWED });
        expect(mockToastr.success).toHaveBeenCalled();
    });

    it('should handle error on submit', () => {
        mockSettingsService.updateSettings.and.returnValue(throwError(() => new Error('Error')));
        component.onSubmit();

        expect(mockToastr.error).toHaveBeenCalled();
    });
});
