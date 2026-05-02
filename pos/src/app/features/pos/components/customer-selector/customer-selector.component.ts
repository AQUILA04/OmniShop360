import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../../../core/services/customer.service';

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

@Component({
  selector: 'app-customer-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" *ngIf="isOpen" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Changer de client</h2>
          <button class="close-btn" (click)="close()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input type="text" [(ngModel)]="searchTerm" placeholder="Rechercher (Nom, Tel, Email)..." (input)="onSearch()" />
          </div>

          <div class="customer-list">
            <div class="customer-list-title">Résultats ({{ filteredCustomers.length }})</div>
            
            <!-- Option Default -->
            <div class="customer-item" (click)="selectCustomer(defaultCustomer)" [class.active-item]="selectedCustomer?.id === 'divers'">
              <div class="avatar default-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19A4 4 0 0 0 16 15H8A4 4 0 0 0 4 19V21M16 7A4 4 0 1 1 8 7A4 4 0 0 1 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="details">
                <span class="name">Client Divers</span>
                <span class="meta">Sélection par défaut</span>
              </div>
            </div>
            
            <!-- API Results -->
            <div *ngIf="isLoading" class="loading-state">
               Recherche en cours...
            </div>
            <ng-container *ngIf="!isLoading">
              <div class="customer-item" *ngFor="let c of filteredCustomers" (click)="selectCustomer(c)" [class.active-item]="selectedCustomer?.id === c.id">
                <div class="avatar"><span>{{ getInitials(c.name) }}</span></div>
                <div class="details">
                  <span class="name">{{ c.name }}</span>
                  <span class="meta" *ngIf="c.phone || c.email">{{ c.phone }} {{ c.phone && c.email ? '•' : '' }} {{ c.email }}</span>
                </div>
              </div>
            </ng-container>
            
            <div class="empty-state" *ngIf="!isLoading && searchTerm && filteredCustomers.length === 0">
               Aucun client trouvé pour "{{ searchTerm }}"
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(26, 32, 53, 0.5); backdrop-filter: blur(4px);
      z-index: 5000; display: flex; align-items: flex-start; justify-content: center; padding-top: 10vh;
    }
    .modal-content {
      background: #ffffff; width: 100%; max-width: 480px; border-radius: 16px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.15); display: flex; flex-direction: column;
      animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    .modal-header {
      padding: 24px 32px 16px; display: flex; align-items: center; justify-content: space-between;
    }
    .modal-header h2 { font-size: 20px; font-weight: 700; margin: 0; color: #1a2035; }
    .close-btn { background: none; border: none; cursor: pointer; color: #676c73; transition: color 0.2s; }
    .close-btn:hover { color: #1a2035; }
    .modal-body {
      padding: 0 32px 32px; display: flex; flex-direction: column;
    }
    
    .search-box {
      display: flex; align-items: center; gap: 12px; padding: 14px 16px;
      background: #F4F2FF; border-radius: 12px; margin-bottom: 24px;
      border: 1px solid transparent; transition: border-color 0.2s;
    }
    .search-box:focus-within { border-color: rgba(0, 92, 173, 0.3); }
    .search-box svg { color: #9BA3AF; }
    .search-box input {
      border: none; background: transparent; outline: none; width: 100%; font-size: 15px; color: #1a2035;
    }
    
    .customer-list { display: flex; flex-direction: column; gap: 8px; max-height: 40vh; overflow-y: auto; padding-right: 8px; }
    .customer-list-title { font-size: 12px; font-weight: 600; color: #9BA3AF; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.05em; }
    
    .customer-item {
      display: flex; align-items: center; gap: 14px; padding: 12px 16px; border-radius: 12px; 
      cursor: pointer; transition: background 0.2s; border: 1px solid #f0f0f0;
    }
    .customer-item:hover { background: #f8fafc; border-color: #e2e8f0; }
    .customer-item.active-item { background: #F4F2FF; border-color: rgba(0, 92, 173, 0.2); }
    
    .avatar {
      width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #005cad 0%, #2075d0 100%);
      color: #fff; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; flex-shrink: 0;
    }
    .default-avatar { background: #E8EDF5; color: #676C73; }
    
    .details { display: flex; flex-direction: column; flex: 1; min-width: 0; }
    .name { font-size: 14px; font-weight: 600; color: #1a2035; line-height: 1.2; margin-bottom: 4px; }
    .meta { font-size: 12px; color: #676c73; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    
    .loading-state, .empty-state { padding: 24px; text-align: center; color: #9BA3AF; font-size: 14px; }
  `]
})
export class CustomerSelectorComponent implements OnInit {
  @Input() selectedCustomer: Customer | null = null;
  @Input() isOpen = false;
  
  @Output() customerSelected = new EventEmitter<Customer>();
  @Output() closeModal = new EventEmitter<void>();

  searchTerm = '';
  isLoading = false;
  
  defaultCustomer: Customer = { id: 'divers', name: 'Client Divers' };
  filteredCustomers: Customer[] = [];
  
  private searchTimeout: any;

  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    if (!this.selectedCustomer) {
      this.selectedCustomer = this.defaultCustomer;
    }
    this.loadTopCustomers();
  }
  
  loadTopCustomers() {
    this.isLoading = true;
    this.customerService.searchCustomers('', 5).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res && res.data && res.data.content) {
          this.filteredCustomers = res.data.content.map((c: any) => ({
             id: c.id,
             name: c.firstName + ' ' + c.lastName,
             email: c.email,
             phone: c.phone
          }));
        }
      },
      error: () => this.isLoading = false
    });
  }

  onSearch() {
    if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
    }
    if (!this.searchTerm.trim()) {
        this.loadTopCustomers();
        return;
    }
    
    this.searchTimeout = setTimeout(() => {
        this.isLoading = true;
        this.customerService.searchCustomers(this.searchTerm, 5).subscribe({
          next: (res) => {
            this.isLoading = false;
            if (res && res.data && res.data.content) {
              this.filteredCustomers = res.data.content.map((c: any) => ({
                 id: c.id,
                 name: c.firstName + ' ' + c.lastName,
                 email: c.email,
                 phone: c.phone
              }));
            }
          },
          error: () => {
             this.isLoading = false;
             this.filteredCustomers = [];
          }
        });
    }, 300); // 300ms debounce
  }

  selectCustomer(c: Customer) {
    this.selectedCustomer = c;
    this.customerSelected.emit(c);
    this.close();
  }

  close() {
    // Optional: reset search on close? For now we just emit close
    this.closeModal.emit();
  }

  getInitials(name: string) {
    if (!name) return 'C';
    const p = name.split(' ');
    if (p.length > 1) return (p[0][0] + p[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }
}
