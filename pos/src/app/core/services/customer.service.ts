import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseCrudService } from '../../shared/abstractions/base-crud.service';
import { Customer } from '../models/customer.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseCrudService<Customer, string> {
  protected override get baseUrl(): string {
    return `${environment.apiUrl}/v1/customers`;
  }

  constructor(http: HttpClient) {
    super(http);
  }

  // Uses custom backend keyword parameter structure
  searchCustomers(keyword: string = '', limit: number = 5): Observable<any> {
    let params = new HttpParams()
      .set('page', '0')
      .set('size', limit.toString());

    if (keyword && keyword.trim().length > 0) {
      params = params.set('keyword', keyword.trim());
    }

    return this.http.get<any>(this.baseUrl, { params });
  }
}
