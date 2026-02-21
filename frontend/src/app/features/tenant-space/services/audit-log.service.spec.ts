import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuditLogService } from './audit-log.service';
import { environment } from '../../../../environments/environment';

describe('AuditLogService', () => {
    let service: AuditLogService;
    let httpMock: HttpTestingController;
    const baseUrl = `${environment.apiUrl}/v1/audit-logs`;

    const mockResponse = {
        content: [
            {
                revisionId: 1,
                timestamp: '2025-02-21T10:30:00Z',
                userId: 'keycloak-sub-id',
                actionType: 'UPDATE',
                entityType: 'Stock',
                entityId: 'uuid-123'
            },
            {
                revisionId: 2,
                timestamp: '2025-02-21T11:00:00Z',
                userId: 'keycloak-sub-id-2',
                actionType: 'CREATE',
                entityType: 'Product',
                entityId: 'uuid-456'
            }
        ],
        page: {
            size: 20,
            number: 0,
            totalElements: 2,
            totalPages: 1
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuditLogService]
        });
        service = TestBed.inject(AuditLogService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call GET /audit-logs with pagination params', () => {
        service.getAll({ page: 0, size: 20 }).subscribe(response => {
            expect(response.content.length).toBe(2);
            expect(response.page.totalElements).toBe(2);
            // Verify id mapping from revisionId
            expect(response.content[0].id).toBe('1');
            expect(response.content[1].id).toBe('2');
        });

        const req = httpMock.expectOne(`${baseUrl}?page=0&size=20`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should pass sort and filter params', () => {
        service.getAll({
            page: 0,
            size: 20,
            sort: 'timestamp,desc',
            fromDate: '2025-02-01',
            toDate: '2025-02-21',
            entityType: 'Stock',
            userId: 'user-123'
        }).subscribe(response => {
            expect(response.content.length).toBe(2);
        });

        const req = httpMock.expectOne(
            `${baseUrl}?page=0&size=20&sort=timestamp,desc&fromDate=2025-02-01&toDate=2025-02-21&userId=user-123&entityType=Stock`
        );
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should omit undefined optional params', () => {
        service.getAll({ page: 1, size: 10, entityType: 'Sale' }).subscribe();

        const req = httpMock.expectOne(`${baseUrl}?page=1&size=10&entityType=Sale`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });
});
