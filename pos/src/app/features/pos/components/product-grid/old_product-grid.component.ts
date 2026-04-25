import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="product-grid-container">
      <!-- Search & Filter Section -->
      <div class="search-section">
        <div class="search-input-wrapper">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            (ngModelChange)="onSearch()"
            placeholder="Rechercher produit, code-barres, catégorie..." 
            class="search-input"
          >
          
          <div class="scanner-icon" title="Scanner code-barres">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 7V5C3 3.89543 3.89543 3 5 3H7M3 17V19C3 20.1046 3.89543 21 5 21H7M17 3H19C20.1046 3 21 3.89543 21 5V7M21 17V19C21 20.1046 20.1046 21 19 21H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7 11H13M7 15H10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
        
        <div class="category-chips">
          <button 
            *ngFor="let cat of categories" 
            class="category-chip" 
            [class.category-chip-active]="selectedCategory === cat"
            (click)="selectCategory(cat)"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="product-grid">
        <div 
          *ngFor="let product of filteredProducts" 
          class="product-card"
          [class.product-card-out-of-stock]="product.stockLevel === 0"
          (click)="addToCart.emit(product)"
        >
          <div class="product-image-wrapper">
            <div *ngIf="product.imageUrl; else productPlaceholder" class="product-image">
              <img [src]="product.imageUrl" [alt]="product.name">
            </div>
            <ng-template #productPlaceholder>
              <div class="product-placeholder" [style.background-color]="getProductGradient(product.name)">
                {{ product.name.charAt(0).toUpperCase() }}
              </div>
            </ng-template>
            <div class="stock-badge" [class]="getStockClass(product)">
              <span class="stock-dot"></span>
              {{ getStockLabel(product) }}
            </div>
          </div>
          
          <div class="product-details">
            <div class="product-name">{{ product.name }}</div>
            <div class="product-footer">
              <span class="product-price">{{ product.price | currency:'EUR':'symbol':'1.2-2' }}</span>
              <button class="add-action-btn" aria-label="Ajouter au panier" (click)="addToCart.emit(product); $event.stopPropagation()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-grid-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: var(--color-background);
    }

    .search-section {
      margin-bottom: var(--space-4);
      flex-shrink: 0;
    }

    .search-input-wrapper {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      background-color: var(--color-surface);
      border-radius: var(--radius-lg);
      padding: var(--space-4);
      margin-bottom: var(--space-4);
      box-shadow: var(--shadow-card);
      transition: all var(--transition-base);
    }

    .search-input-wrapper:focus-within {
      box-shadow: 0 0 0 3px rgba(47, 126, 218, 0.15);
    }
    
    .search-icon {
      color: var(--color-text-secondary);
      flex-shrink: 0;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      font-family: var(--font-family-base);
      font-size: var(--font-size-body);
      color: var(--color-text-primary);
      background: transparent;
      min-height: 24px;
    }
    
    .search-input::placeholder {
      color: var(--color-text-secondary);
    }
    
    .scanner-icon {
      cursor: pointer;
      padding: var(--space-2);
      border-radius: var(--radius-md);
      color: var(--color-text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-fast);
    }
    
    .scanner-icon:hover {
      background-color: var(--color-primary-light);
      color: var(--color-primary);
    }

    .category-chips {
      display: flex;
      gap: var(--space-2);
      overflow-x: auto;
      padding-bottom: var(--space-2);
      -webkit-overflow-scrolling: touch;
    }

    .category-chip {
      display: inline-flex;
      align-items: center;
      padding: var(--space-2) var(--space-4);
      font-size: var(--font-size-small);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: all var(--transition-base);
      white-space: nowrap;
      min-height: 44px;
    }

    .category-chip:hover {
      background-color: var(--color-primary-light);
      border-color: var(--color-primary);
    }

    .category-chip-active {
      background-color: var(--color-primary);
      color: var(--color-text-on-primary);
      border-color: var(--color-primary);
    }

    .category-chip-active:hover {
      background-color: var(--color-primary-hover);
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-3);
      overflow-y: auto;
      flex: 1;
      padding-right: var(--space-2);
    }

    @media (min-width: 640px) {
      .product-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-4);
      }
    }

    @media (min-width: 1024px) {
      .product-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    @media (min-width: 1280px) {
      .product-grid {
        grid-template-columns: repeat(5, 1fr);
      }
    }

    .product-card {
      background-color: var(--color-surface);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-card);
      padding: var(--space-3);
      cursor: pointer;
      transition: all var(--transition-base);
      display: flex;
      flex-direction: column;
      min-height: 160px;
    }

    .product-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-floating);
    }

    .product-card:active {
      transform: scale(0.98);
    }

    .product-card-out-of-stock {
      opacity: 0.6;
      pointer-events: none;
    }

    .product-image-wrapper {
      position: relative;
      margin-bottom: var(--space-2);
    }

    .product-image {
      width: 100%;
      height: 80px;
      object-fit: cover;
      border-radius: var(--radius-md);
      background-color: var(--color-surface-container-low);
    }

    .product-placeholder {
      width: 100%;
      height: 80px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.9);
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .stock-badge {
      position: absolute;
      top: var(--space-2);
      right: var(--space-2);
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      font-size: 11px;
      font-weight: 500;
      background-color: rgba(255, 255, 255, 0.95);
      border-radius: var(--radius-full);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .stock-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .stock-badge-normal {
      color: var(--color-success);
    }

    .stock-badge-normal .stock-dot {
      background-color: var(--color-success);
    }

    .stock-badge-warning {
      color: var(--color-warning);
      background-color: rgba(255, 245, 224, 0.95);
    }

    .stock-badge-warning .stock-dot {
      background-color: var(--color-warning);
    }

    .stock-badge-error {
      color: var(--color-error);
      background-color: rgba(253, 236, 236, 0.95);
    }

    .stock-badge-error .stock-dot {
      background-color: var(--color-error);
    }

    .product-details {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .product-name {
      font-size: var(--font-size-small);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
      margin-bottom: var(--space-2);
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      flex: 1;
    }

    .product-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
    }

    .product-price {
      font-size: var(--font-size-body);
      font-weight: var(--font-weight-bold);
      color: var(--color-primary);
    }

    .add-action-btn {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-full);
      background-color: var(--color-surface-container-low);
      color: var(--color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      transition: all var(--transition-fast);
      flex-shrink: 0;
    }

    .add-action-btn:hover {
      background-color: var(--color-primary);
      color: var(--color-text-on-primary);
      transform: scale(1.1);
    }
  `]
})
export class ProductGridComponent {
  @Input() products: any[] = [];
  @Input() categories: string[] = ['Tous', 'Alimentation', 'Boissons', 'Électronique', 'Hygiène', 'Divers'];
  @Output() addToCart = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();

  searchTerm = '';
  selectedCategory = 'Tous';

  get filteredProducts() {
    return this.products.filter(p => {
      const matchesCategory = this.selectedCategory === 'Tous' || p.category === this.selectedCategory;
      const matchesSearch = !this.searchTerm || 
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  onSearch() {
    this.search.emit(this.searchTerm);
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  getProductGradient(name: string): string {
    const gradients = [
      'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
      'linear-gradient(135deg, #4ECDC4 0%, #7EDDD6 100%)',
      'linear-gradient(135deg, #45B7D1 0%, #7CCFE0 100%)',
      'linear-gradient(135deg, #96CEB4 0%, #B5DDCB 100%)',
      'linear-gradient(135deg, #FFEEAD 0%, #FFF4CC 100%)',
      'linear-gradient(135deg, #DDA0DD 0%, #E8B8E8 100%)',
      'linear-gradient(135deg, #98D8C8 0%, #B5E5D8 100%)',
      'linear-gradient(135deg, #F7DC6F 0%, #FAE79A 100%)'
    ];
    return gradients[name.length % gradients.length];
  }

  getStockClass(product: any): string {
    if (product.stockLevel === 0) return 'stock-badge stock-badge-error';
    if (product.stockLevel < 5) return 'stock-badge stock-badge-warning';
    return 'stock-badge stock-badge-normal';
  }

  getStockLabel(product: any): string {
    if (product.stockLevel === 0) return 'Rupture';
    if (product.stockLevel < 5) return `${product.stockLevel} restant`;
    return 'En stock';
  }
}
