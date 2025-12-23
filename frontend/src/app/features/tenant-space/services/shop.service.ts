import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from '../../../shared/abstractions/base-crud.service';
import { Shop } from '../models/shop.model';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ShopService extends BaseCrudService<Shop, string> {
    protected override get baseUrl(): string {
        return `${environment.apiUrl}/shops`;
    }

    constructor(http: HttpClient) {
        super(http);
    }

    assignAdmin(shopId: string, userId: string): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/${shopId}/admins/${userId}`, {});
    }
}
