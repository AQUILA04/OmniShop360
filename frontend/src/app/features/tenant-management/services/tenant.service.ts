import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateTenantRequest, TenantQueryParams, TenantResponse, TenantStatus } from '../models/tenant.model';
import { environment } from '../../../../environments/environment';
import { PagedResponse } from '../../../shared/models/paged-response.model';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private apiUrl = `${environment.apiUrl}/tenants`;
  private http = inject(HttpClient);

  createTenant(request: CreateTenantRequest): Observable<TenantResponse> {
    return this.http.post<TenantResponse>(this.apiUrl, request);
  }

  getTenants(params: TenantQueryParams): Observable<PagedResponse<TenantResponse>> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('size', params.size.toString());

    if (params.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    return this.http.get<PagedResponse<TenantResponse>>(this.apiUrl, { params: httpParams });
  }

  getTenantById(id: string): Observable<TenantResponse> {
    return this.http.get<TenantResponse>(`${this.apiUrl}/${id}`);
  }

  updateTenant(id: string, tenant: Partial<TenantResponse>): Observable<TenantResponse> {
    return this.http.put<TenantResponse>(`${this.apiUrl}/${id}`, tenant);
  }

  deleteTenant(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateTenantStatus(id: string, status: TenantStatus): Observable<TenantResponse> {
    return this.http.patch<TenantResponse>(`${this.apiUrl}/${id}/status`, { status });
  }
}
