import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from '../../../shared/abstractions/base-crud.service';
import { StockMovementResponse } from '../models/stock-movement.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockMovementService extends BaseCrudService<StockMovementResponse, string> {
  protected override get baseUrl(): string {
    return `${environment.apiUrl}/v1/stock/movements`;
  }

  constructor(http: HttpClient) {
    super(http);
  }
}
