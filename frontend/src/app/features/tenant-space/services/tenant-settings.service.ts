import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TenantSettings } from '../models/tenant-settings.model';

@Injectable({
    providedIn: 'root'
})
export class TenantSettingsService {
    private baseUrl = `${environment.apiUrl}/tenant/settings`;

    constructor(private http: HttpClient) { }

    getSettings(): Observable<TenantSettings> {
        return this.http.get<TenantSettings>(this.baseUrl);
    }

    updateSettings(settings: TenantSettings): Observable<TenantSettings> {
        return this.http.put<TenantSettings>(this.baseUrl, settings);
    }
}
