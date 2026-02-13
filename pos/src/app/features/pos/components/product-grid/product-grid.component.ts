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
          <!-- Modern Search SVG -->
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15.0001 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            (ngModelChange)="onSearch()"
            placeholder="Rechercher produits, SKU, ou scannez un code-barres..." 
            class="search-input"
          >
          
          <!-- Scanner Icon SVG -->
          <div class="scanner-icon" title="Scanner">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 7V5C3 3.89543 3.89543 3 5 3H7M3 17V19C3 20.1046 3.89543 21 5 21H7M17 3H19C20.1046 3 21 3.89543 21 5V7M21 17V19C21 20.1046 20.1046 21 19 21H17M6 7H18M6 10H18M6 13H18M6 17H18" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div class="categories">
          <button 
            *ngFor="let cat of categories" 
            class="category-pill" 
            [class.active]="selectedCategory === cat"
            (click)="selectCategory(cat)"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Products Grid -->
    <div class="grid">
        <div 
          *ngFor="let product of filteredProducts" 
          class="product-card" 
          (click)="addToCart.emit(product)"
        >
          <div class="image-container">
            <div class="product-image-placeholder" [style.background-color]="getProductColor(product.name)">
               <span>{{ product.name.charAt(0) }}</span>
            </div>
            <div class="stock-badge" [class.low-stock]="product.stockLevel < 5">
               {{ product.stockLevel || 11 }} in stock
            </div>
          </div>
          
          <div class="product-details">
            <div class="price-row">
                <span class="product-price">{{ product.price | currency:'EUR' }}</span>
            </div>
            <div class="product-name">{{ product.name }}</div>
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
      padding: var(--spacing-lg); /* More padding */
      background-color: var(--color-background);
    }

    .search-section {
      margin-bottom: var(--spacing-lg);
    }

    .search-input-wrapper {
      display: flex;
      align-items: center;
      background: white;
      border: 1px solid transparent;
      box-shadow: var(--shadow-sm);
      border-radius: var(--radius-lg);
      padding: 12px 16px; /* Adjusted padding */
      margin-bottom: var(--spacing-md);
      transition: all 0.2s;
    }

    .search-input-wrapper:focus-within {
      box-shadow: var(--shadow-md);
      border-color: var(--color-primary);
    }
    
    .search-icon {
        margin-right: 8px;
        color: var(--color-text-secondary);
    }

    .search-input {
      border: none;
      outline: none;
      width: 100%;
      font-size: 16px;
      color: var(--color-text-primary);
      background: transparent;
    }
    
    .scanner-icon {
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        color: var(--color-text-secondary);
        display: flex;
        align-items: center;
    }
    
    .scanner-icon:hover {
        background-color: #F3F4F6;
        color: var(--color-text-primary);
    }

    .categories {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      padding-bottom: 8px;
    }

    .category-pill {
      border: 1px solid var(--color-border);
      background: white;
      color: var(--color-text-secondary);
      padding: 10px 20px;
      border-radius: 12px; /* Softer pills */
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      white-space: nowrap;
      transition: all 0.2s;
      box-shadow: var(--shadow-sm);
    }

    .category-pill:hover {
      background: #F9FAFB;
      transform: translateY(-1px);
    }

    .category-pill.active {
      background-color: var(--color-primary);
      color: white;
      border-color: var(--color-primary);
      box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3); /* Blue shadow */
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Slightly wider cards */
      gap: var(--spacing-lg);
      padding-bottom: var(--spacing-lg);
      overflow-y: auto;
      padding-right: 4px; /* Scrollbar space */
    }

    .product-card {
      background: white;
      border-radius: var(--radius-lg);
      padding: 16px;
      cursor: pointer;
      box-shadow: var(--shadow-sm);
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      border: 1px solid transparent;
    }

    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
      border-color: var(--color-primary);
    }

    .image-container {
        position: relative;
        margin-bottom: 12px;
    }

    .product-image-placeholder {
      height: 140px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      font-weight: bold;
      color: white;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .stock-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(255, 255, 255, 0.9);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        color: var(--color-text-primary);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .stock-badge.low-stock {
        color: var(--color-error);
        background: #FEF2F2;
    }

    .product-details {
      display: flex;
      flex-direction: column;
    }

    .price-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
    }

    .product-price {
      color: var(--color-text-primary);
      font-weight: 700;
      font-size: 18px;
    }

    .product-name {
      font-weight: 500;
      color: var(--color-text-secondary);
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `]
})
export class ProductGridComponent {
  @Input() products: any[] = [];
  @Input() categories: string[] = ['Tous', 'Électronique', 'Accessoires', 'Maison', 'Bureau'];
  @Output() addToCart = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();

  searchTerm = '';
  selectedCategory = 'Tous';

  get filteredProducts() {
    // Backend handles search. We only filter by category locally for now if needed.
    return this.products.filter(p => {
      return this.selectedCategory === 'Tous' || p.category === this.selectedCategory;
    });
  }

  onSearch() {
    this.search.emit(this.searchTerm);
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  getProductColor(name: string): string {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
    return colors[name.length % colors.length];
  }
}
