import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryFormComponent } from './category-form.component';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from '../../../../shared/shared.module';

describe('CategoryFormComponent', () => {
    let component: CategoryFormComponent;
    let fixture: ComponentFixture<CategoryFormComponent>;
    let categoryServiceSpy: jasmine.SpyObj<CategoryService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

    beforeEach(async () => {
        categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['create', 'update', 'getById']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

        await TestBed.configureTestingModule({
            imports: [CategoryFormComponent, ReactiveFormsModule, NoopAnimationsModule, SharedModule], // Standalone
            providers: [
                { provide: CategoryService, useValue: categoryServiceSpy },
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

        fixture = TestBed.createComponent(CategoryFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have code field in config', () => {
        const mainSection = component.formConfig[0];
        const codeField = mainSection.fields.find(f => f.key === 'code');
        expect(codeField).toBeDefined();
        expect(codeField?.label).toBe('Code');
    });

    it('should call create on submit when valid', () => {
        component.form.patchValue({
            name: 'Test Cat',
            code: 'TC',
            description: 'Desc'
        });

        categoryServiceSpy.create.and.returnValue(of({ id: '1', name: 'Test Cat' } as any));

        component.onSubmit();

        expect(categoryServiceSpy.create).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/tenant/categories']);
    });
});
