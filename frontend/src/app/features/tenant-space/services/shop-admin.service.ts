import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseCrudService } from '../../../shared/abstractions/base-crud.service';
import { environment } from '../../../../environments/environment';
import { AdminUserResponse } from '../../../shared/models/admin-user.model'; // Assuming this model exists or usage of any

@Injectable({
    providedIn: 'root'
})
export class ShopAdminService extends BaseCrudService<any, string> {
    protected override get baseUrl(): string {
        return `${environment.apiUrl}/v1/users`; // Placeholder base URL for listing
    }

    constructor(http: HttpClient) {
        super(http);
    }

    // Override create to handle the specific endpoint
    override create(dto: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/v1/shops/${dto.shopId}/admins`, dto);
    }
}
