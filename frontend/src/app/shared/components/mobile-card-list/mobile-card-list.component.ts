import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MobileCardColumn {
  key: string;
  label: string;
  type?: 'text' | 'currency' | 'date' | 'badge' | 'badge-success' | 'badge-warning' | 'badge-error' | 'actions';
  currency?: string;
  format?: string;
  width?: string;
}

export interface MobileCardAction {
  label: string;
  icon?: string;
  variant?: 'default' | 'primary' | 'danger';
  action: (item: any) => void;
}

@Component({
  selector: 'app-mobile-card-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mobile-card-list">
      <!-- Desktop Table View -->
      <div class="desktop-table" *ngIf="showDesktopTable">
        <table class="data-table">
          <thead>
            <tr>
              <th *ngFor="let col of columns" [style.width]="col.width">
                {{ col.label }}
              </th>
              <th *ngIf="actions.length > 0" class="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of data; let i = index" [class.striped]="i % 2 === 1">
              <td *ngFor="let col of columns">
                <ng-container [ngSwitch]="col.type">
                  <span *ngSwitchCase="'currency'">{{ item[col.key] | currency:(col.currency || 'EUR'):'symbol':'1.2-2' }}</span>
                  <span *ngSwitchCase="'date'">{{ item[col.key] | date:(col.format || 'dd/MM/yyyy') }}</span>
                  <span *ngSwitchCase="'badge'" class="badge" [class]="'badge-' + getBadgeClass(item[col.key])">
                    {{ item[col.key] }}
                  </span>
                  <span *ngSwitchCase="'badge-success'" class="badge badge-success">
                    {{ item[col.key] }}
                  </span>
                  <span *ngSwitchCase="'badge-warning'" class="badge badge-warning">
                    {{ item[col.key] }}
                  </span>
                  <span *ngSwitchCase="'badge-error'" class="badge badge-error">
                    {{ item[col.key] }}
                  </span>
                  <span *ngSwitchDefault>{{ item[col.key] }}</span>
                </ng-container>
              </td>
              <td *ngIf="actions.length > 0" class="actions-cell">
                <button 
                  *ngFor="let action of actions" 
                  class="action-btn" 
                  [class]="'action-btn-' + (action.variant || 'default')"
                  (click)="action.action(item)"
                >
                  <span *ngIf="action.icon" [innerHTML]="action.icon"></span>
                  <span *ngIf="!action.icon">{{ action.label }}</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card View -->
      <div class="mobile-cards">
        <div *ngIf="data.length === 0" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M3 3V21H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7 14L11 10L15 14L21 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p>{{ emptyMessage }}</p>
        </div>

        <div *ngFor="let item of data; let i = index" class="mobile-card" [class.striped]="i % 2 === 1">
          <div class="mobile-card-header">
            <span *ngFor="let col of columns | slice:0:2" class="header-chip" [class]="getBadgeClass(item[col.key])">
              {{ formatValue(item[col.key], col) }}
            </span>
            <button class="menu-btn" *ngIf="actions.length > 0" (click)="toggleCardMenu(i)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="1" fill="currentColor"/>
                <circle cx="12" cy="5" r="1" fill="currentColor"/>
                <circle cx="12" cy="19" r="1" fill="currentColor"/>
              </svg>
            </button>
          </div>

          <div class="mobile-card-content">
            <div *ngFor="let col of columns" class="card-row">
              <span class="card-label">{{ col.label }}</span>
              <span class="card-value">
                <ng-container [ngSwitch]="col.type">
                  <span *ngSwitchCase="'currency'" class="value-currency">
                    {{ item[col.key] | currency:(col.currency || 'EUR'):'symbol':'1.2-2' }}
                  </span>
                  <span *ngSwitchCase="'badge'" class="badge" [class]="'badge-' + getBadgeClass(item[col.key])">
                    {{ item[col.key] }}
                  </span>
                  <span *ngSwitchCase="'badge-success'" class="badge badge-success">
                    {{ item[col.key] }}
                  </span>
                  <span *ngSwitchCase="'badge-warning'" class="badge badge-warning">
                    {{ item[col.key] }}
                  </span>
                  <span *ngSwitchCase="'badge-error'" class="badge badge-error">
                    {{ item[col.key] }}
                  </span>
                  <span *ngSwitchDefault>{{ formatValue(item[col.key], col) }}</span>
                </ng-container>
              </span>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="mobile-card-actions" *ngIf="actions.length > 0">
            <button 
              *ngFor="let action of actions | slice:0:2" 
              class="quick-action-btn" 
              [class.primary]="action.variant === 'primary'"
              (click)="action.action(item)"
            >
              <span *ngIf="action.icon" [innerHTML]="action.icon"></span>
              {{ action.label }}
            </button>
          </div>

          <!-- Actions Menu -->
          <div class="card-menu" *ngIf="activeCardMenu === i" (click)="closeCardMenu()">
            <div class="card-menu-content" (click)="$event.stopPropagation()">
              <button 
                *ngFor="let action of actions" 
                class="menu-item"
                (click)="action.action(item); closeCardMenu()"
              >
                <span *ngIf="action.icon" [innerHTML]="action.icon"></span>
                {{ action.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="showPagination && totalPages > 1">
        <button class="page-btn" [disabled]="currentPage === 1" (click)="goToPage(currentPage - 1)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <span class="page-info">Page {{ currentPage }} / {{ totalPages }}</span>
        <button class="page-btn" [disabled]="currentPage === totalPages" (click)="goToPage(currentPage + 1)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .mobile-card-list {
      width: 100%;
    }

    /* Desktop Table */
    .desktop-table {
      display: block;
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      background-color: var(--color-surface);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-card);
    }

    .data-table th {
      background-color: var(--color-surface-container-low);
      padding: var(--space-4);
      text-align: left;
      font-size: var(--font-size-small);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.03em;
      position: sticky;
      top: 0;
    }

    .data-table td {
      padding: var(--space-4);
      font-size: var(--font-size-body);
      color: var(--color-text-primary);
      border-bottom: 1px solid var(--color-surface-container-low);
    }

    .data-table tr.striped td {
      background-color: var(--color-background);
    }

    .data-table tr:hover td {
      background-color: var(--color-surface-container-low);
    }

    .actions-col {
      width: 120px;
    }

    .actions-cell {
      display: flex;
      gap: var(--space-2);
    }

    .action-btn {
      padding: var(--space-2) var(--space-3);
      font-size: var(--font-size-small);
      font-weight: var(--font-weight-medium);
      border-radius: var(--radius-md);
      border: none;
      cursor: pointer;
      transition: all var(--transition-fast);
      display: inline-flex;
      align-items: center;
      gap: var(--space-1);
    }

    .action-btn-default {
      background-color: var(--color-surface-container-low);
      color: var(--color-text-primary);
    }

    .action-btn-primary {
      background-color: var(--color-primary-light);
      color: var(--color-primary);
    }

    .action-btn-danger {
      background-color: var(--color-error-light);
      color: var(--color-error);
    }

    /* Mobile Cards */
    .mobile-cards {
      display: none;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-8);
      color: var(--color-text-secondary);
      text-align: center;
    }

    .empty-state svg {
      margin-bottom: var(--space-3);
      opacity: 0.5;
    }

    .mobile-card {
      position: relative;
      background-color: var(--color-surface);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-card);
      margin-bottom: var(--space-3);
      overflow: hidden;
    }

    .mobile-card.striped {
      background-color: var(--color-background);
    }

    .mobile-card-header {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-4);
      border-bottom: none;
      background-color: var(--color-surface-container-low);
    }

    .header-chip {
      padding: var(--space-1) var(--space-3);
      font-size: var(--font-size-caption);
      font-weight: var(--font-weight-semibold);
      border-radius: var(--radius-full);
      background-color: var(--color-surface);
      color: var(--color-text-secondary);
    }

    .menu-btn {
      margin-left: auto;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      border-radius: var(--radius-md);
      color: var(--color-text-secondary);
      cursor: pointer;
    }

    .menu-btn:hover {
      background-color: var(--color-surface);
    }

    .mobile-card-content {
      padding: var(--space-3) var(--space-4);
    }

    .card-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-2) 0;
    }

    .card-row:not(:last-child) {
      border-bottom: 1px solid var(--color-surface-container-low);
    }

    .card-label {
      font-size: var(--font-size-small);
      color: var(--color-text-secondary);
    }

    .card-value {
      font-size: var(--font-size-small);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
      text-align: right;
    }

    .value-currency {
      color: var(--color-primary);
      font-weight: var(--font-weight-semibold);
    }

    .mobile-card-actions {
      display: flex;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-4);
      border-top: 1px solid var(--color-surface-container-low);
    }

    .quick-action-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      padding: var(--space-3);
      font-size: var(--font-size-small);
      font-weight: var(--font-weight-medium);
      background-color: var(--color-surface-container-low);
      color: var(--color-text-primary);
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .quick-action-btn.primary {
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%);
      color: var(--color-text-on-primary);
    }

    .quick-action-btn:active {
      transform: scale(0.98);
    }

    .card-menu {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(25, 27, 38, 0.4);
      z-index: var(--z-modal-backdrop);
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }

    .card-menu-content {
      background-color: var(--color-surface);
      border-radius: var(--radius-xl) var(--radius-xl) 0 0;
      padding: var(--space-4);
      width: 100%;
      max-width: 400px;
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0);
      }
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      width: 100%;
      padding: var(--space-4);
      font-size: var(--font-size-body);
      font-weight: var(--font-weight-medium);
      background: none;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: background-color var(--transition-fast);
      text-align: left;
    }

    .menu-item:hover {
      background-color: var(--color-surface-container-low);
    }

    /* Badges */
    .badge {
      display: inline-flex;
      padding: 2px 8px;
      font-size: var(--font-size-caption);
      font-weight: var(--font-weight-medium);
      border-radius: var(--radius-full);
      background-color: var(--color-surface-container-low);
      color: var(--color-text-secondary);
    }

    .badge-success {
      background-color: var(--color-success-light);
      color: var(--color-success);
    }

    .badge-warning {
      background-color: var(--color-warning-light);
      color: var(--color-warning);
    }

    .badge-error {
      background-color: var(--color-error-light);
      color: var(--color-error);
    }

    /* Pagination */
    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-4);
      padding: var(--space-4);
      margin-top: var(--space-4);
    }

    .page-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
      color: var(--color-text-primary);
    }

    .page-btn:hover:not(:disabled) {
      background-color: var(--color-primary-light);
      border-color: var(--color-primary);
    }

    .page-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .page-info {
      font-size: var(--font-size-small);
      color: var(--color-text-secondary);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .desktop-table {
        display: none;
      }

      .mobile-cards {
        display: block;
      }
    }
  `]
})
export class MobileCardListComponent {
  @Input() data: any[] = [];
  @Input() columns: MobileCardColumn[] = [];
  @Input() actions: MobileCardAction[] = [];
  @Input() showDesktopTable = true;
  @Input() showPagination = false;
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() emptyMessage = 'Aucune donnée disponible';

  @Output() pageChange = new EventEmitter<number>();

  activeCardMenu: number | null = null;

  formatValue(value: any, col: MobileCardColumn): string {
    if (value === null || value === undefined) return '-';
    if (col.type === 'date' && value) {
      const date = new Date(value);
      return date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    }
    return String(value);
  }

  getBadgeClass(value: string): string {
    if (!value) return '';
    const lower = value.toLowerCase();
    if (lower.includes('success') || lower.includes('payé') || lower.includes('actif')) {
      return 'badge-success';
    }
    if (lower.includes('warning') || lower.includes('en cours')) {
      return 'badge-warning';
    }
    if (lower.includes('error') || lower.includes('annulé') || lower.includes('inactif')) {
      return 'badge-error';
    }
    return '';
  }

  toggleCardMenu(index: number) {
    this.activeCardMenu = this.activeCardMenu === index ? null : index;
  }

  closeCardMenu() {
    this.activeCardMenu = null;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
