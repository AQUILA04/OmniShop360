import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ShopService } from './shop.service';
import { environment } from '../../../../../environments/environment';

describe('ShopService', () => {
    let service: ShopService;
    let httpMock: HttpTestingController;
    const apiUrl = `${environment.apiUrl}/v1/shops`;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ShopService]
        });
        service = TestBed.inject(ShopService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get all shops (paginated adaptation)', () => {
        const mockResponse = {
            content: [{ id: '1', name: 'Test Shop' }],
            page: { size: 20, number: 0, totalElements: 1, totalPages: 1 }
        };

        service.getAll().subscribe(response => {
            expect(response.content.length).toBe(1);
            expect(response.content[0].name).toBe('Test Shop');
        });

        const req = httpMock.expectOne(`${apiUrl}?page=0&size=10`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should create a shop', () => {
        const newShop = { name: 'New Shop', city: 'Paris' };
        const mockResponse = { id: '1', ...newShop };

        service.create(newShop as any).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(apiUrl);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(newShop);
        req.flush(mockResponse);
    });

    it('should update a shop', () => {
        const updateData = { name: 'Updated Shop' };
        const id = '1';
        const mockResponse = { id, ...updateData };

        service.update(id, updateData as any).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${apiUrl}/${id}`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(updateData);
        req.flush(mockResponse);
    });

    it('should delete a shop', () => {
        const id = '1';

        service.delete(id).subscribe(response => {
            expect(response).toBeUndefined();
        });

        const req = httpMock.expectOne(`${apiUrl}/${id}`);
        expect(req.request.method).toBe('DELETE');
        req.flush(null); // delete usually returns 204 No Content (null body)
    });

    it('should create a shop admin', () => {
        const shopId = '123';
        const adminData = { firstName: 'John', email: 'john@test.com' };

        service.createShopAdmin(shopId, adminData).subscribe(res => {
            expect(res).toBeDefined();
        });

        const req = httpMock.expectOne(`${apiUrl}/${shopId}/admins`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(adminData);
        req.flush({});
    });
});
