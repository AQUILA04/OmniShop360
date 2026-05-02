import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from '../../../shared/abstractions/base-crud.service';
import { StockMovementResponse, CreateStockMovementRequest } from '../models/stock-movement.model';
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

  // Create a stock movement (receipt, adjustment, etc.)
  createMovement(request: CreateStockMovementRequest) {
    return this.http.post<StockMovementResponse>(`${this.baseUrl}`, request);
  }

  // Get movements for a specific shop
  getMovementsByShop(shopId: string) {
    return this.http.get<StockMovementResponse[]>(`${this.baseUrl}/shop/${shopId}`);
  }

  // Get movements for a specific product
  getMovementsByProduct(productId: string) {
    return this.http.get<StockMovementResponse[]>(`${this.baseUrl}/product/${productId}`);
  }

  // Record a stock receipt (incoming movement)
  recordReceipt(request: Omit<CreateStockMovementRequest, 'movementType'>) {
    const payload: CreateStockMovementRequest = { ...request, movementType: 'RECEIPT' as const };
    return this.createMovement(payload);
  }

  // Record a stock adjustment
  recordAdjustment(request: Omit<CreateStockMovementRequest, 'movementType'>) {
    const payload: CreateStockMovementRequest = { ...request, movementType: 'ADJUSTMENT' as const };
    return this.createMovement(payload);
  }
}