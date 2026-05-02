import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { BaseCrudService } from '../../../shared/abstractions/base-crud.service';
import { PagedResponse } from '../../../shared/models/paged-response.model';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ShopAdminService extends BaseCrudService<any, string> {
    protected override get baseUrl(): string {
        return `${environment.apiUrl}/v1/users`; // Placeholder base URL for listing
    }

    constructor(http: HttpClient) {
        super(http);
    }

    override getAll(params: { page: number; size: number; sort?: string; search?: string }): Observable<PagedResponse<any>> {
        let httpParams = new HttpParams()
            .set('page', params.page.toString())
            .set('size', params.size.toString());

        if (params.sort) {
            httpParams = httpParams.set('sort', params.sort);
        }

        if (params.search) {
            httpParams = httpParams.set('keyword', params.search);
        }

        return this.http.get<PagedResponse<any>>(this.baseUrl, { params: httpParams });
    }

    // Override create to handle the specific endpoint
    override create(dto: any): Observable<any> {
        if (dto.profile === 'CASHIER') {
            return this.http.post<any>(`${environment.apiUrl}/v1/shops/${dto.shopId}/cashiers`, dto);
        } else if (dto.profile === 'STOCK_MANAGER') {
            return this.http.post<any>(`${environment.apiUrl}/v1/shops/${dto.shopId}/stock-managers`, dto);
        }
        return this.http.post<any>(`${environment.apiUrl}/v1/shops/${dto.shopId}/admins`, dto);
    }
}
