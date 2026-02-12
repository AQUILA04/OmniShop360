import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseCrudService } from '../../shared/abstractions/base-crud.service';
import { Sale, CheckoutRequest } from '../models/sale.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SaleService extends BaseCrudService<Sale, string> {
  protected override get baseUrl(): string {
    return `${environment.apiUrl}/v1/sales`;
  }

  constructor(http: HttpClient) {
    super(http);
  }

  checkout(request: CheckoutRequest): Observable<Sale> {
    return this.http.post<Sale>(`${this.baseUrl}/checkout`, request);
  }
}
