import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserFormComponent } from './user-form.component';
import { ShopAdminService } from '../../services/shop-admin.service';
import { ShopService } from '../../services/shop.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../../../shared/shared.module';
import { PagedResponse } from '../../../../shared/models/paged-response.model';
import { Shop } from '../../models/shop.model';
import { NgxPermissionsService } from 'ngx-permissions';

describe('UserFormComponent', () => {
    let component: UserFormComponent;
    let fixture: ComponentFixture<UserFormComponent>;
    let shopAdminServiceSpy: jasmine.SpyObj<ShopAdminService>;
    let shopServiceSpy: jasmine.SpyObj<ShopService>;

    const mockShops: Shop[] = [
        {
            id: '1',
            name: 'Shop 1',
            city: 'Paris',
            active: true,
            address: 'addr',
            postalCode: '75001',
            phone: '0102030405',
            email: 'shop@test.com',
            tenantId: 't1'
        }
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

        const permissionsServiceSpy = jasmine.createSpyObj('NgxPermissionsService', ['getPermissions', 'loadPermissions']);
        permissionsServiceSpy.getPermissions.and.returnValue({});

        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                HttpClientTestingModule,
                NoopAnimationsModule,
                SharedModule,
                UserFormComponent
            ],
            providers: [
                { provide: ShopAdminService, useValue: shopAdminServiceSpy },
                { provide: ShopService, useValue: shopServiceSpy },
                { provide: ToastrService, useValue: jasmine.createSpyObj('ToastrService', ['success', 'error']) },
                { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            params: {},
                            data: {},
                            paramMap: { get: () => null }
                        },
                        paramMap: of({ get: () => null })
                    }
                },
                {
                    provide: NgxPermissionsService,
                    useValue: permissionsServiceSpy
                }
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
        const shopSection = component.formConfig.find(s => s.fields.some(f => f.key === 'shopId'));
        const shopField = shopSection?.fields.find(f => f.key === 'shopId');

        expect(shopField?.options?.length).toBe(1);
        expect(shopField?.options?.[0].value).toBe('1');
    });

    it('should initialize form with required controls', () => {
        console.log('Form keys:', Object.keys(component.form.controls));

        const hasFirst = component.form.contains('firstName');
        console.log('Has firstName:', hasFirst);
        expect(hasFirst).toBeTrue();

        const hasLast = component.form.contains('lastName');
        console.log('Has lastName:', hasLast);
        expect(hasLast).toBeTrue();

        const hasEmail = component.form.contains('email');
        console.log('Has email:', hasEmail);
        expect(hasEmail).toBeTrue();

        const hasShop = component.form.contains('shopId');
        console.log('Has shopId:', hasShop);
        expect(hasShop).toBeTrue();

        const hasProfile = component.form.contains('profile');
        console.log('Has profile:', hasProfile);
        // Using get check as well
        const profileCtrl = component.form.get('profile');
        console.log('Profile control:', profileCtrl);
        expect(profileCtrl).toBeDefined();
        expect(profileCtrl).not.toBeNull();
    });

    it('should have profile defaulted and enabled', () => {
        const profileControl = component.form.get('profile');
        expect(profileControl?.value).toBe('SHOP_ADMIN');
        expect(profileControl?.disabled).toBeFalse();
    });

    it('should call service create when submitting valid form', () => {
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
