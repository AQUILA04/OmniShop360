import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseCrudService } from '../../shared/abstractions/base-crud.service';
import { Sale, CheckoutRequest } from '../models/sale.model';
import { StockResponse } from '../models/stock.model';
import { Product } from '../models/product.model';
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

  getSales(params: {
    page: number;
    size: number;
    search?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    paymentMethod?: string;
  }): Observable<PageResponse<Sale>> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('size', params.size.toString());

    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.startDate) httpParams = httpParams.set('startDate', params.startDate);
    if (params.endDate) httpParams = httpParams.set('endDate', params.endDate);
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.paymentMethod) httpParams = httpParams.set('paymentMethod', params.paymentMethod);

    return this.http.get<PageResponse<Sale>>(`${this.baseUrl}`, { params: httpParams });
  }

  getProductsForSale(page: number = 0, size: number = 20, search?: string): Observable<PageResponse<StockResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<PageResponse<StockResponse>>(`${this.baseUrl}/products`, { params });
  }

  mapStockToProduct(stock: StockResponse): Product {
    return {
      id: stock.productId,
      name: stock.productName,
      sku: stock.productSku,
      price: stock.sellingPrice || 0,
      category: 'Général', // Placeholder
      taxRate: 0,
      stockLevel: stock.availableQuantity
    };
  }
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}
