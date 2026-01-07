import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { environment } from '../../../../../environments/environment';

describe('CategoryService', () => {
    let service: CategoryService;
    let httpMock: HttpTestingController;
    const apiUrl = `${environment.apiUrl}/v1/categories`;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CategoryService]
        });
        service = TestBed.inject(CategoryService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get all categories (adapted response)', () => {
        // Current implementation mocks pagination for a list response
        const mockList = [{ id: '1', name: 'Cat 1', code: 'C1' }];

        service.getAll().subscribe(response => {
            expect(response.content).toHaveSize(1);
            expect(response.content[0].code).toBe('C1');
            // Check mock page
            expect(response.page.totalElements).toBe(1);
        });

        const req = httpMock.expectOne(`${apiUrl}`); // getAll calls base URL directly in current implementation? 
        // Wait, let's verify if getAll appends params. BaseCrudService usually appends params.
        // However, CategoryService overrides getAll.
        // Let's assume the override calls this.http.get<CategoryResponse[]>(this.baseUrl) without params if they are ignored/stripped or just appended.
        // Checking the previous file content, it seems it calls this.http.get<List<CategoryResponse>>(this.baseUrl).

        expect(req.request.method).toBe('GET');
        req.flush(mockList);
    });

    it('should create a category', () => {
        const newCat = { name: 'New Cat', code: 'NC' };
        const mockResponse = { id: '2', ...newCat };

        service.create(newCat as any).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        // Subclasses of BaseCrudService use create(item: Partial<T>): Observable<T>
        // It calls http.post<T>(baseUrl, item)
        const req = httpMock.expectOne(apiUrl);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(newCat);
        req.flush(mockResponse);
    });
});
