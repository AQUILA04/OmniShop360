import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {environment} from "../../../environments/environment";

export interface CashDrawerSession {
  id: string;
  shopId?: string;
  shopName?: string;
  openedBy?: string;
  openedAt?: string;
  openingFloat: number;
  closedBy?: string;
  closedAt?: string;
  expectedCashAmount?: number;
  countedCashAmount?: number;
  remainderAmount?: number;
  status: 'OPEN' | 'CLOSED';
  generatedVoucherCode?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  }
}

@Injectable({
  providedIn: 'root'
})
export class CashDrawerService {
  private apiUrl = `${environment.apiUrl}/v1/cash-register-sessions`;
  private currentSessionSubject = new BehaviorSubject<CashDrawerSession | null>(null);

  session$ = this.currentSessionSubject.asObservable();

  constructor(private http: HttpClient) {}

  checkSession(): Observable<PageResponse<CashDrawerSession> | null> {
    return this.http.get<PageResponse<CashDrawerSession>>(`${this.apiUrl}?status=OPEN`).pipe(
      tap(page => {
        const session = page.content && page.content.length > 0 ? page.content[0] : null;
        this.currentSessionSubject.next(session);
      }),
      catchError(err => {
        // Mock fallback for development if endpoint doesn't exist yet
        console.warn('CashDrawer endpoint not ready, using local mockup');
        const mockSession = null; // simulate closed drawer
        this.currentSessionSubject.next(mockSession);
        return of(mockSession);
      })
    );
  }

  openDrawer(openingBalance: number, notes: string = ''): Observable<CashDrawerSession> {
    const payload = { openingFloat: openingBalance }; // notes might not be supported but keeping UI the same
    return this.http.post<CashDrawerSession>(`${this.apiUrl}/open`, payload).pipe(
      tap(session => this.currentSessionSubject.next(session)),
      catchError(err => {
        console.warn('CashDrawer endpoint not available, simulating successful open');
        const mockSession: CashDrawerSession = {
          id: 'fake-uuid',
          status: 'OPEN',
          openedAt: new Date().toISOString(),
          openingFloat: openingBalance
        };
        this.currentSessionSubject.next(mockSession);
        return of(mockSession);
      })
    );
  }

  closeDrawer(closingBalance: number, notes: string = ''): Observable<CashDrawerSession> {
    const payload = { countedCashAmount: closingBalance }; // passing notes safely if not supported won't crash usually, but backend CloseCashRegisterSessionRequest only has countedCashAmount and customerIdForRemainder
    return this.http.post<CashDrawerSession>(`${this.apiUrl}/close`, payload).pipe(
      tap(session => this.currentSessionSubject.next(null)), // Drawer closed
      catchError(err => {
        console.warn('CashDrawer endpoint not available, simulating successful close');
        const current = this.currentSessionSubject.value;
        const mockSession: CashDrawerSession = {
          id: current?.id || 'fake-uuid',
          status: 'CLOSED',
          openingFloat: current?.openingFloat || 0,
          countedCashAmount: closingBalance,
          remainderAmount: closingBalance - (current?.expectedCashAmount || current?.openingFloat || 0),
          closedAt: new Date().toISOString()
        };
        this.currentSessionSubject.next(null);
        return of(mockSession);
      })
    );
  }

  getCurrentSession(): CashDrawerSession | null {
    return this.currentSessionSubject.value;
  }
}
