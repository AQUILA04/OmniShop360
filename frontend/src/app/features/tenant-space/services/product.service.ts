import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from '../../../shared/abstractions/base-crud.service';
import { Product } from '../models/product.model';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductService extends BaseCrudService<Product, string> {
    protected override get baseUrl(): string {
        return `${environment.apiUrl}/products`;
    }

    constructor(http: HttpClient) {
        super(http);
    }
}
