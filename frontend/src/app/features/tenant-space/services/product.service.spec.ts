import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { environment } from '../../../../environments/environment';

describe('ProductService', () => {
    let service: ProductService;
    let httpMock: HttpTestingController;
    const apiUrl = `${environment.apiUrl}/v1/products`;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ProductService]
        });
        service = TestBed.inject(ProductService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get all products', () => {
        const mockResponse = {
            content: [{ id: '1', name: 'Product 1', tenantId: 't1', sku: 'SKU1', category: 'cat1', salePrice: 100, hasVariants: false }],
            page: { size: 10, number: 0, totalElements: 1, totalPages: 1 }
        };

        service.getAll({ page: 0, size: 10 }).subscribe(res => {
            expect(res.content.length).toBe(1);
        });

        const req = httpMock.expectOne(`${apiUrl}?page=0&size=10`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should create a product', () => {
        const newProd = { name: 'New Product', price: 100 };
        const mockResponse = { id: '2', ...newProd, tenantId: 't1', sku: 'SKU2', category: 'cat1', salePrice: 100, hasVariants: false };

        service.create(newProd as any).subscribe(res => {
            expect(res).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(apiUrl);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(newProd);
        req.flush(mockResponse);
    });
});
