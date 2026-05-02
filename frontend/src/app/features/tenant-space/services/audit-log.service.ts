import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuditLogEntry } from '../models/audit-log.model';
import { PagedResponse } from '../../../shared/models/paged-response.model';

export interface AuditLogSearchParams {
    page: number;
    size: number;
    sort?: string;
    fromDate?: string;
    toDate?: string;
    userId?: string;
    entityType?: string;
    tenantId?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuditLogService {
    private readonly baseUrl = `${environment.apiUrl}/v1/audit-logs`;

    constructor(private http: HttpClient) { }

    getAll(params: AuditLogSearchParams): Observable<PagedResponse<AuditLogEntry>> {
        let httpParams = new HttpParams()
            .set('page', params.page.toString())
            .set('size', params.size.toString());

        if (params.sort) {
            httpParams = httpParams.set('sort', params.sort);
        }
        if (params.fromDate) {
            httpParams = httpParams.set('fromDate', params.fromDate);
        }
        if (params.toDate) {
            httpParams = httpParams.set('toDate', params.toDate);
        }
        if (params.userId) {
            httpParams = httpParams.set('userId', params.userId);
        }
        if (params.entityType) {
            httpParams = httpParams.set('entityType', params.entityType);
        }
        if (params.tenantId) {
            httpParams = httpParams.set('tenantId', params.tenantId);
        }

        return this.http.get<PagedResponse<AuditLogEntry>>(this.baseUrl, { params: httpParams })
            .pipe(
                map(response => ({
                    ...response,
                    content: response.content.map(entry => ({
                        ...entry,
                        id: entry.revisionId?.toString() ?? entry.entityId
                    }))
                }))
            );
    }
}
