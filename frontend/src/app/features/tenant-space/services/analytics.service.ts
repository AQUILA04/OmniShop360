import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AnalyticsSummaryResponse, ExportFormat } from '../models/analytics.model';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private readonly baseUrl = `${environment.apiUrl}/v1/analytics`;

    constructor(private http: HttpClient) { }

    getSummary(params: {
        shopId?: string;
        fromDate?: string;
        toDate?: string;
    } = {}): Observable<AnalyticsSummaryResponse> {
        let httpParams = new HttpParams();

        if (params.shopId) {
            httpParams = httpParams.set('shopId', params.shopId);
        }
        if (params.fromDate) {
            httpParams = httpParams.set('fromDate', params.fromDate);
        }
        if (params.toDate) {
            httpParams = httpParams.set('toDate', params.toDate);
        }

        return this.http.get<AnalyticsSummaryResponse>(
            `${this.baseUrl}/summary`,
            { params: httpParams }
        );
    }

    exportReport(params: {
        format: ExportFormat;
        shopId?: string;
        fromDate?: string;
        toDate?: string;
    }): Observable<Blob> {
        let httpParams = new HttpParams().set('format', params.format);

        if (params.shopId) {
            httpParams = httpParams.set('shopId', params.shopId);
        }
        if (params.fromDate) {
            httpParams = httpParams.set('fromDate', params.fromDate);
        }
        if (params.toDate) {
            httpParams = httpParams.set('toDate', params.toDate);
        }

        return this.http.get(`${this.baseUrl}/export`, {
            params: httpParams,
            responseType: 'blob'
        });
    }
}
