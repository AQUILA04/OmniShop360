import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShopFormComponent } from './shop-form.component';
import { ShopService } from '../../services/shop.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from '../../../../shared/shared.module';

describe('ShopFormComponent', () => {
    let component: ShopFormComponent;
    let fixture: ComponentFixture<ShopFormComponent>;
    let shopServiceSpy: jasmine.SpyObj<ShopService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

    beforeEach(async () => {
        shopServiceSpy = jasmine.createSpyObj('ShopService', ['create', 'update', 'getById']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

        await TestBed.configureTestingModule({
            imports: [ShopFormComponent, ReactiveFormsModule, NoopAnimationsModule, SharedModule], // Standalone component imported
            providers: [
                { provide: ShopService, useValue: shopServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: MatSnackBar, useValue: snackBarSpy },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { params: {} },
                        paramMap: of({ get: () => null })
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ShopFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with correct form config', () => {
        expect(component.formConfig).toBeDefined();
        expect(component.formConfig.length).toBeGreaterThan(0);
        // Check first section title
        expect(component.formConfig[0].title).toContain('Informations Générales');
    });

    it('should call create on submit when form is valid', () => {
        // Fill form
        component.form.patchValue({
            name: 'Test Shop',
            city: 'Test City',
            address: '123 Test St',
            phone: '123456789'
        });

        shopServiceSpy.create.and.returnValue(of({ id: '1', name: 'Test Shop' } as any));

        component.onSubmit();

        expect(shopServiceSpy.create).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/tenant/shops']);
    });
});
