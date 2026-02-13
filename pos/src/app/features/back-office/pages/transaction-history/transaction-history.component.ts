import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SaleService, PageResponse } from '../../../../core/services/sale.service';
import { Sale } from '../../../../core/models/sale.model';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">Transaction History</h1>
      <div class="actions">
        <button class="btn btn-secondary">
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
             <path d="M6 14h12v8H6z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
           </svg>
           Print Report
        </button>
        <button class="btn btn-primary">
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
           </svg>
           Export CSV
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="search-input-wrapper">
        <span class="search-icon">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
             </svg>
        </span>
        <input 
          type="text" 
          class="search-input" 
          placeholder="Search ID or Customer Name" 
          [(ngModel)]="searchQuery"
          (keyup.enter)="loadSales()"
        >
      </div>

      <div class="date-picker-wrapper">
         <span class="icon-wrapper">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
             </svg>
         </span>
         <input type="date" class="date-input" [(ngModel)]="startDate" (change)="loadSales()">
      </div>

      <select class="filter-select" [(ngModel)]="selectedStatus" (change)="loadSales()">
        <option value="">All Statuses</option>
        <option value="COMPLETED">Completed</option>
        <option value="REFUNDED">Refunded</option>
        <option value="VOIDED">Voided</option>
      </select>

      <select class="filter-select" [(ngModel)]="selectedPayment" (change)="loadSales()">
        <option value="">All Payments</option>
        <option value="CASH">Cash</option>
        <option value="CARD">Card</option>
        <option value="MOBILE">Mobile</option>
      </select>
      
      <button class="btn-icon" (click)="loadSales()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- Transactions Table -->
    <div class="table-container">
      <table class="transactions-table">
        <thead>
          <tr>
            <th>TRANSACTION ID</th>
            <th>DATE & TIME</th>
            <th>CUSTOMER</th>
            <th>PAYMENT</th>
            <th>STATUS</th>
            <th class="text-right">AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let sale of sales">
            <td class="text-primary font-medium">{{ sale.saleNumber || '#' + sale.id.substring(0, 8) }}</td>
            <td class="text-secondary">{{ sale.createdAt | date:'mediumDate' }} <span class="text-light">{{ sale.createdAt | date:'shortTime' }}</span></td>
            <td>
              <div class="customer-cell">
                <div class="avatar-circle" [style.background-color]="getAvatarColor(sale.customerName)">
                    {{ getInitials(sale.customerName) }}
                </div>
                <span class="font-medium">{{ sale.customerName || 'Guest Checkout' }}</span>
              </div>
            </td>
            <td>
               <div class="payment-cell">
                 <span class="payment-icon">
                    <ng-container [ngSwitch]="sale.paymentMethod">
                        <span *ngSwitchCase="'CASH'">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M1 10h22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <circle cx="12" cy="15" r="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </span>
                        <span *ngSwitchCase="'CARD'">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M1 10h22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </span>
                        <span *ngSwitchCase="'MOBILE'">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </span>
                        <span *ngSwitchDefault>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </span>
                    </ng-container>
                 </span>
                 {{ sale.paymentMethod | titlecase }}
               </div>
            </td>
            <td>
              <span class="status-badge" [ngClass]="sale.status.toLowerCase()">
                {{ sale.status | titlecase }}
              </span>
            </td>
            <td class="text-right font-bold">{{ sale.totalAmount | currency }}</td>
          </tr>
          
          <tr *ngIf="sales.length === 0">
              <td colspan="6" class="empty-state">No transactions found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination-bar">
       <span class="showing-text">Showing {{ (page * size) + 1 }} to {{ min(totalElements, (page + 1) * size) }} of {{ totalElements }} results</span>
       
       <div class="pagination-controls">
          <button class="page-btn" [disabled]="page === 0" (click)="prevPage()">‹</button>
          
          <span class="page-number active">{{ page + 1 }}</span>
          
          <button class="page-btn" [disabled]="page >= totalPages - 1" (click)="nextPage()">›</button>
       </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .page-title {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }

    .actions {
      display: flex;
      gap: 12px;
    }

    .btn {
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 14px;
      cursor: pointer;
      border: 1px solid transparent;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-primary {
      background-color: #2563EB;
      color: white;
    }

    .btn-secondary {
      background-color: white;
      border-color: #D1D5DB;
      color: #374151;
    }

    /* Filters */
    .filters-bar {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
      background: white;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid #E5E7EB;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }

    .search-input-wrapper {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 10px;
      color: #9CA3AF;
    }

    .search-input {
      width: 100%;
      padding: 8px 8px 8px 36px;
      border: 1px solid #D1D5DB;
      border-radius: 6px;
      font-size: 14px;
    }

    .filter-select, .date-input {
      padding: 8px 12px;
      border: 1px solid #D1D5DB;
      border-radius: 6px;
      background: white;
      color: #374151;
      font-size: 14px;
    }
    
    .date-picker-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 8px;
        border: 1px solid #D1D5DB;
        border-radius: 6px;
    }
    
    .date-input {
        border: none;
        outline: none;
    }
    
    .btn-icon {
        background: none;
        border: 1px solid #D1D5DB;
        border-radius: 6px;
        width: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    /* Table */
    .table-container {
      background: white;
      border-radius: 8px;
      border: 1px solid #E5E7EB;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .transactions-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .transactions-table th {
      background-color: #F9FAFB;
      padding: 12px 24px;
      font-size: 12px;
      font-weight: 600;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #E5E7EB;
    }

    .transactions-table td {
      padding: 16px 24px;
      border-bottom: 1px solid #E5E7EB;
      font-size: 14px;
      color: #111827;
      vertical-align: middle;
    }

    .transactions-table tr:last-child td {
      border-bottom: none;
    }
    
    .empty-state {
        text-align: center;
        padding: 48px !important;
        color: #6B7280 !important;
    }

    .text-primary { color: #2563EB; }
    .text-secondary { color: #374151; }
    .text-light { color: #6B7280; font-size: 12px; }
    .text-right { text-align: right; }
    .font-medium { font-weight: 500; }
    .font-bold { font-weight: 700; }

    .customer-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      color: white;
    }
    
    .payment-cell {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .status-badge {
      display: inline-flex;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.completed { background-color: #D1FAE5; color: #065F46; }
    .status-badge.pending { background-color: #FEF3C7; color: #92400E; }
    .status-badge.refunded, .status-badge.cancelled { background-color: #FEE2E2; color: #991B1B; }
    .status-badge.voided { background-color: #F3F4F6; color: #374151; }

    /* Pagination */
    .pagination-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      color: #6B7280;
      font-size: 14px;
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .page-btn {
      width: 32px;
      height: 32px;
      border: 1px solid #D1D5DB;
      background: white;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    
    .page-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .page-number {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
    }

    .page-number.active {
      background-color: #EFF6FF;
      color: #2563EB;
      border: 1px solid #BFDBFE;
      font-weight: 600;
    }
  `]
})
export class TransactionHistoryComponent implements OnInit {
  sales: Sale[] = [];

  // Filters
  searchQuery = '';
  startDate = '';
  selectedStatus = '';
  selectedPayment = '';

  // Pagination
  page = 0;
  size = 10;
  totalElements = 0;
  totalPages = 0;

  constructor(private saleService: SaleService) { }

  ngOnInit() {
    this.loadSales();
  }

  loadSales() {
    this.saleService.getSales({
      page: this.page,
      size: this.size,
      search: this.searchQuery,
      status: this.selectedStatus,
      paymentMethod: this.selectedPayment,
      startDate: this.startDate
    }).subscribe({
      next: (response) => {
        this.sales = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
      },
      error: (err) => console.error('Error loading sales', err)
    });
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadSales();
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.loadSales();
    }
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  getInitials(name?: string): string {
    if (!name) return 'GU'; // Guest
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getAvatarColor(name?: string): string {
    if (!name) return '#9CA3AF'; // Gray
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }
}
