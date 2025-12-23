import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResponse } from '../models/paged-response.model';

export abstract class BaseCrudService<T, ID> {
  protected abstract get baseUrl(): string;

  constructor(protected http: HttpClient) {}

  getAll(params: { page: number; size: number; sort?: string; search?: string }): Observable<PagedResponse<T>> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('size', params.size.toString());

    if (params.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    return this.http.get<PagedResponse<T>>(this.baseUrl, { params: httpParams });
  }

  getById(id: ID): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}`);
  }

  create(dto: any): Observable<T> {
    return this.http.post<T>(this.baseUrl, dto);
  }

  update(id: ID, dto: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: ID): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
