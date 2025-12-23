import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../../services/product.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProductFormComponent', () => {
    let component: ProductFormComponent;
    let fixture: ComponentFixture<ProductFormComponent>;
    let mockProductService: jasmine.SpyObj<ProductService>;
    let mockPermissionsService: jasmine.SpyObj<NgxPermissionsService>;

    beforeEach(async () => {
        mockProductService = jasmine.createSpyObj('ProductService', ['create', 'update']);
        mockPermissionsService = jasmine.createSpyObj('NgxPermissionsService', ['hasPermission']);

        // Default permission check to false
        mockPermissionsService.hasPermission.and.returnValue(Promise.resolve(false));

        await TestBed.configureTestingModule({
            declarations: [ProductFormComponent],
            imports: [ReactiveFormsModule],
            providers: [
                FormBuilder,
                { provide: ProductService, useValue: mockProductService },
                { provide: NgxPermissionsService, useValue: mockPermissionsService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProductFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Margin Calculation', () => {
        it('should calculate margin correctly', () => {
            component.form.patchValue({
                salePrice: 100,
                purchasePrice: 60
            });
            expect(component.marginPercentage).toBe(40);
        });

        it('should return null if salePrice is 0', () => {
            component.form.patchValue({
                salePrice: 0,
                purchasePrice: 60
            });
            expect(component.marginPercentage).toBeNull();
        });
    });

    describe('Variants Management', () => {
        it('should add a variant when hasVariants is toggled to true', () => {
            component.form.get('hasVariants')?.setValue(true);
            expect(component.variants.length).toBe(1);
        });

        it('should clear variants when hasVariants is toggled to false', () => {
            component.form.get('hasVariants')?.setValue(true);
            expect(component.variants.length).toBe(1);

            component.form.get('hasVariants')?.setValue(false);
            expect(component.variants.length).toBe(0);
        });

        it('should add detailed variant', () => {
            component.form.get('hasVariants')?.setValue(true);
            // Initial variant is empty
            expect(component.variants.at(0).get('sku')?.value).toBe('');

            component.addVariant();
            expect(component.variants.length).toBe(2);
        });
    });

    describe('Security (Purchase Price)', () => {
        it('should hide purchase price by default (no permission)', async () => {
            // Mock returning false - enforced in beforeEach
            // Only checking component state property used in template
            await fixture.whenStable();
            expect(component.canSeePurchasePrice).toBeFalse();
        });
    });
});
