import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserFormComponent } from './user-form.component';
import { ShopAdminService } from '../../services/shop-admin.service';
import { ShopService } from '../../services/shop.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../../../shared/shared.module';
import { PagedResponse } from '../../../../shared/models/paged-response.model';
import { Shop } from '../../models/shop.model';

describe('UserFormComponent', () => {
    let component: UserFormComponent;
    let fixture: ComponentFixture<UserFormComponent>;
    let shopAdminServiceSpy: jasmine.SpyObj<ShopAdminService>;
    let shopServiceSpy: jasmine.SpyObj<ShopService>;

    const mockShops: Shop[] = [
        { id: '1', name: 'Shop 1', city: 'Paris', active: true, address: 'addr', postalCode: '75001' }
    ];

    const mockPagedShops: PagedResponse<Shop> = {
        content: mockShops,
        page: { size: 10, totalElements: 1, totalPages: 1, number: 0 }
    };

    beforeEach(async () => {
        shopAdminServiceSpy = jasmine.createSpyObj('ShopAdminService', ['create', 'getById', 'update']);
        shopServiceSpy = jasmine.createSpyObj('ShopService', ['getAll']);

        // Mock shop return
        shopServiceSpy.getAll.and.returnValue(of(mockPagedShops));

        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
                NoopAnimationsModule,
                SharedModule,
                UserFormComponent // Standalone component imported here
            ],
            providers: [
                { provide: ShopAdminService, useValue: shopAdminServiceSpy },
                { provide: ShopService, useValue: shopServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(UserFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load shops on init', () => {
        expect(shopServiceSpy.getAll).toHaveBeenCalled();
        // Check if options are populated in formConfig
        const shopSection = component.formConfig.find(s => s.fields.some(f => f.key === 'shopId'));
        const shopField = shopSection?.fields.find(f => f.key === 'shopId');

        expect(shopField?.options?.length).toBe(1);
        expect(shopField?.options?.[0].value).toBe('1');
    });

    it('should initialize form with required controls', () => {
        expect(component.form.contains('firstName')).toBeTrue();
        expect(component.form.contains('lastName')).toBeTrue();
        expect(component.form.contains('email')).toBeTrue();
        expect(component.form.contains('shopId')).toBeTrue();
        expect(component.form.contains('profile')).toBeTrue();
    });

    it('should have profile defaulted and disabled', () => {
        const profileControl = component.form.get('profile');
        expect(profileControl?.value).toBe('SHOP_ADMIN');
        expect(profileControl?.disabled).toBeTrue();
    });

    it('should call service create when submitting valid form', () => {
        // Set values
        component.form.patchValue({
            shopId: '1',
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean.dupont@test.com'
        });

        shopAdminServiceSpy.create.and.returnValue(of({}));

        component.onSubmit();

        expect(shopAdminServiceSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({
            shopId: '1',
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean.dupont@test.com',
            profile: 'SHOP_ADMIN'
        }));
    });

    it('should NOT call service create when submitting invalid form', () => {
        component.form.patchValue({
            firstName: '', // Invalid
            email: 'invalid-email' // Invalid
        });

        component.onSubmit();

        expect(shopAdminServiceSpy.create).not.toHaveBeenCalled();
    });
});
