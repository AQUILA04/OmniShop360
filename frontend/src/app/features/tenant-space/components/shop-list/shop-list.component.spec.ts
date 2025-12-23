import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShopListComponent } from './shop-list.component';
import { ShopService } from '../../services/shop.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Shop } from '../../models/shop.model';

describe('ShopListComponent', () => {
    let component: ShopListComponent;
    let fixture: ComponentFixture<ShopListComponent>;
    let mockShopService: jasmine.SpyObj<ShopService>;

    const mockShops: Shop[] = [
        { id: '1', name: 'Shop 1', address: 'Addr 1', city: 'City 1', postalCode: '1000', phone: '123', email: 'test@shop.com', status: 'ACTIVE', userCount: 2, tenantId: 'tenant1' }
    ];

    beforeEach(async () => {
        mockShopService = jasmine.createSpyObj('ShopService', ['getAll']);
        mockShopService.getAll.and.returnValue(of({ data: mockShops, total: 1 }));

        await TestBed.configureTestingModule({
            declarations: [ShopListComponent],
            providers: [
                { provide: ShopService, useValue: mockShopService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ShopListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize columns config', () => {
        expect(component.columnsConfig.length).toBe(4);
        expect(component.columnsConfig[0].key).toBe('name');
    });

    // Since it extends BaseListComponent, the loading logic is there, but we can verify it calls service
    it('should load shops on init', () => {
        expect(mockShopService.getAll).toHaveBeenCalled();
    });
});
