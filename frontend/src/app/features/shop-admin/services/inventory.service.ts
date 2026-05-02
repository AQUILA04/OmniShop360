import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from '../../../shared/abstractions/base-crud.service';
import { InventoryResponse } from '../models/inventory.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService extends BaseCrudService<InventoryResponse, string> {
  protected override get baseUrl(): string {
    return `${environment.apiUrl}/v1/stock/inventory`;
  }

  constructor(http: HttpClient) {
    super(http);
  }
}
