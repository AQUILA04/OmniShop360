import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CategoryResponse, CreateCategoryRequest } from '../models/category.model';
import { BaseCrudService } from '../../../shared/abstractions/base-crud.service';
import { PagedResponse } from '../../../shared/models/paged-response.model';

@Injectable({
    providedIn: 'root'
})
export class CategoryService extends BaseCrudService<CategoryResponse, string> {
    protected override get baseUrl(): string {
        return `${environment.apiUrl}/v1/categories`;
    }

    constructor(http: HttpClient) {
        super(http);
    }

    // Override getAll to adapt non-paginated API to BaseCrudService expectation
    override getAll(params?: any): Observable<PagedResponse<CategoryResponse>> {
        return this.http.get<CategoryResponse[]>(this.baseUrl).pipe(
            map(items => ({
                content: items,
                page: {
                    size: items.length,
                    number: 0,
                    totalElements: items.length,
                    totalPages: 1
                }
            }))
        );
    }

    // Custom create method distinct from BaseCrudService generic create if needed, 
    // but BaseCrudService.create takes 'dto: any' which works.
    // However, keeping strict typing for usage elsewhere:
    override create(request: CreateCategoryRequest): Observable<CategoryResponse> {
        return super.create(request);
    }
}
