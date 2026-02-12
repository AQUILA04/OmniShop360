import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
}
