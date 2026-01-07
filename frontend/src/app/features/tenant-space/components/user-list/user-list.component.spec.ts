import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { ShopAdminService } from '../../services/shop-admin.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../../../shared/shared.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

describe('UserListComponent', () => {
    let component: UserListComponent;
    let fixture: ComponentFixture<UserListComponent>;
    let shopAdminServiceSpy: jasmine.SpyObj<ShopAdminService>;

    beforeEach(async () => {
        shopAdminServiceSpy = jasmine.createSpyObj('ShopAdminService', ['getAll', 'delete']);
        shopAdminServiceSpy.getAll.and.returnValue(of({
            content: [],
            page: { size: 10, totalElements: 0, totalPages: 0, number: 0 }
        }));

        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
                NoopAnimationsModule,
                SharedModule,
                UserListComponent // Standalone
            ],
            providers: [
                { provide: ShopAdminService, useValue: shopAdminServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(UserListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should define correct properties', () => {
        expect(component.pageTitle).toBe('Utilisateurs');
        expect(component.columnsConfig.length).toBeGreaterThan(0);
        expect(component.columnsConfig.some(c => c.key === 'firstName')).toBeTrue();
    });

    it('should call service getAll on init', () => {
        expect(shopAdminServiceSpy.getAll).toHaveBeenCalled();
    });
});
