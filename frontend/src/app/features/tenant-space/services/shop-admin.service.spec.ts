import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ShopAdminService } from './shop-admin.service';
import { environment } from '../../../../environments/environment';

describe('ShopAdminService', () => {
    let service: ShopAdminService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ShopAdminService]
        });
        service = TestBed.inject(ShopAdminService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call default list endpoint on getAll', () => {
        // BaseCrudService.getAll -> GET /v1/users?page=0&size=10
        // The service baseUrl is configured to `${environment.apiUrl}/v1/users`

        service.getAll({ page: 0, size: 10 }).subscribe();

        const req = httpMock.expectOne(request =>
            request.url === `${environment.apiUrl}/v1/users` &&
            request.params.get('page') === '0' &&
            request.params.get('size') === '10'
        );
        expect(req.request.method).toBe('GET');
        req.flush({});
    });

    it('should call custom create endpoint', () => {
        const dto = {
            shopId: '123',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com'
        };

        service.create(dto).subscribe();

        // Expect POST to /v1/shops/123/admins
        const req = httpMock.expectOne(`${environment.apiUrl}/v1/shops/123/admins`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(dto);
        req.flush({ id: 'abc', ...dto });
    });
});
