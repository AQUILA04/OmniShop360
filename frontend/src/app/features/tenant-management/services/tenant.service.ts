import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TenantResponse, TenantStatus } from '../models/tenant.model';
import { environment } from '../../../../environments/environment';
import { BaseCrudService } from '../../../shared/abstractions/base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class TenantService extends BaseCrudService<TenantResponse, string> {
  protected override get baseUrl(): string {
    return `${environment.apiUrl}/v1/tenants`;
  }

  constructor(http: HttpClient) {
    super(http);
  }

  // Méthodes spécifiques au Tenant
  updateTenantStatus(id: string, status: TenantStatus): Observable<TenantResponse> {
    return this.http.patch<TenantResponse>(`${this.baseUrl}/${id}/status`, { status });
  }
}
