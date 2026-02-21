import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AnalyticsService } from './analytics.service';
import { environment } from '../../../../environments/environment';
import { AnalyticsSummaryResponse } from '../models/analytics.model';

describe('AnalyticsService', () => {
    let service: AnalyticsService;
    let httpMock: HttpTestingController;
    const baseUrl = `${environment.apiUrl}/v1/analytics`;

    const mockSummary: AnalyticsSummaryResponse = {
        totalRevenue: 15000.50,
        transactionCount: 42,
        averageBasket: 357.15,
        periodFrom: '2025-02-01',
        periodTo: '2025-02-21',
        salesEvolution: [
            { day: '2025-02-01', totalAmount: 1200.00, transactionCount: 5 },
            { day: '2025-02-02', totalAmount: 1800.00, transactionCount: 8 }
        ],
        topProducts: [
            { productId: 'uuid-1', productName: 'Produit A', sku: 'SKU-A', quantitySold: 100, totalAmount: 5000.00 }
        ]
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AnalyticsService]
        });
        service = TestBed.inject(AnalyticsService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call GET /analytics/summary with no params', () => {
        service.getSummary().subscribe(response => {
            expect(response.totalRevenue).toBe(15000.50);
            expect(response.transactionCount).toBe(42);
            expect(response.salesEvolution.length).toBe(2);
            expect(response.topProducts.length).toBe(1);
        });

        const req = httpMock.expectOne(`${baseUrl}/summary`);
        expect(req.request.method).toBe('GET');
        req.flush(mockSummary);
    });

    it('should call GET /analytics/summary with shopId, fromDate, toDate', () => {
        service.getSummary({
            shopId: 'shop-uuid',
            fromDate: '2025-02-01',
            toDate: '2025-02-21'
        }).subscribe(response => {
            expect(response).toEqual(mockSummary);
        });

        const req = httpMock.expectOne(
            `${baseUrl}/summary?shopId=shop-uuid&fromDate=2025-02-01&toDate=2025-02-21`
        );
        expect(req.request.method).toBe('GET');
        req.flush(mockSummary);
    });

    it('should call GET /analytics/summary with only fromDate', () => {
        service.getSummary({ fromDate: '2025-02-01' }).subscribe();

        const req = httpMock.expectOne(`${baseUrl}/summary?fromDate=2025-02-01`);
        expect(req.request.method).toBe('GET');
        req.flush(mockSummary);
    });

    it('should call GET /analytics/export with format=PDF as blob', () => {
        const mockBlob = new Blob(['fake-pdf'], { type: 'application/pdf' });

        service.exportReport({ format: 'PDF' }).subscribe(blob => {
            expect(blob).toBeTruthy();
            expect(blob instanceof Blob).toBe(true);
        });

        const req = httpMock.expectOne(`${baseUrl}/export?format=PDF`);
        expect(req.request.method).toBe('GET');
        expect(req.request.responseType).toBe('blob');
        req.flush(mockBlob);
    });

    it('should call GET /analytics/export with format=EXCEL and filters', () => {
        const mockBlob = new Blob(['fake-excel'], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        service.exportReport({
            format: 'EXCEL',
            shopId: 'shop-uuid',
            fromDate: '2025-02-01',
            toDate: '2025-02-21'
        }).subscribe(blob => {
            expect(blob).toBeTruthy();
        });

        const req = httpMock.expectOne(
            `${baseUrl}/export?format=EXCEL&shopId=shop-uuid&fromDate=2025-02-01&toDate=2025-02-21`
        );
        expect(req.request.method).toBe('GET');
        req.flush(mockBlob);
    });
});
