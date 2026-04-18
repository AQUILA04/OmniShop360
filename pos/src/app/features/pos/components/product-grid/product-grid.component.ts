import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="product-grid-container">
      <!-- Search & Filter Bar — matches mockup top bar -->
      <div class="search-bar-row">
        <div class="search-input-wrapper">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (ngModelChange)="onSearch()"
            placeholder="Rechercher un produit ou scanner..."
            class="search-input"
          >
          <div class="scanner-btn" title="Scanner code-barres">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 7V5C3 3.895 3.895 3 5 3H7M3 17V19C3 20.105 3.895 21 5 21H7M17 3H19C20.105 3 21 3.895 21 5V7M21 17V19C21 20.105 20.105 21 19 21H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M7 8V16M10 8V16M13 8V16M16 8V11M16 14V16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
        </div>

        <button class="filter-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Filtres
        </button>
      </div>

      <!-- Category Chips -->
      <div class="category-chips-row">
        <button
          *ngFor="let cat of categories"
          class="category-chip"
          [class.active]="selectedCategory === cat"
          (click)="selectCategory(cat)"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Products Grid -->
      <div class="product-grid">
        <div
          *ngFor="let product of filteredProducts"
          class="product-card"
          [class.out-of-stock]="product.stockLevel === 0"
          (click)="addToCart.emit(product)"
        >
          <!-- Product image / placeholder -->
          <div class="product-image-area">
            <img
              *ngIf="product.imageUrl"
              [src]="product.imageUrl"
              [alt]="product.name"
              class="product-img"
            >
            <div
              *ngIf="!product.imageUrl"
              class="product-placeholder"
              [style.background]="getProductGradient(product.name)"
            >
              <span class="placeholder-letter">{{ product.name.charAt(0).toUpperCase() }}</span>
            </div>

            <!-- Stock badge — top-left overlay -->
            <div class="stock-badge" [ngClass]="getStockClass(product)">
              <span class="stock-dot"></span>
              {{ getStockLabel(product) }}
            </div>
          </div>

          <!-- Product info -->
          <div class="product-info">
            <div class="product-name">{{ product.name }}</div>
            <div class="product-meta" *ngIf="product.category || product.weight">
              <span>{{ product.category }}</span>
              <span *ngIf="product.weight"> • {{ product.weight }}</span>
            </div>

            <div class="product-footer">
              <span class="product-price">{{ product.price | currency:'EUR':'symbol':'1.2-2' }}</span>
              <button
                class="add-btn"
                [class.disabled-btn]="product.stockLevel === 0"
                (click)="addToCart.emit(product); $event.stopPropagation()"
                [disabled]="product.stockLevel === 0"
                aria-label="Ajouter au panier"
              >
                <svg *ngIf="product.stockLevel > 0" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
                <svg *ngIf="product.stockLevel === 0" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
                  <path d="M5 5L19 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div *ngIf="filteredProducts.length === 0" class="empty-products">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M8 11H14M11 8V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <p>Aucun produit trouvé</p>
          <span>Modifiez votre recherche ou sélectionnez une autre catégorie</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .product-grid-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      gap: 0;
    }

    /* ===== SEARCH BAR ===== */
    .search-bar-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      flex-shrink: 0;
    }

    .search-input-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 10px;
      background: #FFFFFF;
      border-radius: 14px;
      padding: 0 14px;
      height: 52px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
      transition: box-shadow 200ms;
    }

    .search-input-wrapper:focus-within {
      box-shadow: 0 0 0 2.5px rgba(0, 92, 173, 0.2), 0 1px 4px rgba(0,0,0,0.06);
    }

    .search-icon {
      color: #9BA3AF;
      flex-shrink: 0;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 14px;
      color: #1a2035;
      background: transparent;
      font-family: inherit;
    }

    .search-input::placeholder {
      color: #9BA3AF;
    }

    .scanner-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      cursor: pointer;
      color: #9BA3AF;
      transition: all 150ms;
      flex-shrink: 0;
    }

    .scanner-btn:hover {
      background: #F4F2FF;
      color: #005cad;
    }

    .filter-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 52px;
      padding: 0 20px;
      background: #FFFFFF;
      border: none;
      border-radius: 14px;
      font-size: 14px;
      font-weight: 600;
      color: #555663;
      cursor: pointer;
      white-space: nowrap;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
      transition: all 200ms;
      font-family: inherit;
    }

    .filter-btn:hover {
      background: #F4F2FF;
      color: #005cad;
    }

    /* ===== CATEGORY CHIPS ===== */
    .category-chips-row {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 4px;
      margin-bottom: 20px;
      flex-shrink: 0;
      scrollbar-width: none;
    }

    .category-chips-row::-webkit-scrollbar {
      display: none;
    }

    .category-chip {
      display: inline-flex;
      align-items: center;
      padding: 0 18px;
      height: 40px;
      font-size: 14px;
      font-weight: 500;
      color: #555663;
      background: #FFFFFF;
      border: 1.5px solid #E8EDF5;
      border-radius: 999px;
      cursor: pointer;
      transition: all 200ms;
      white-space: nowrap;
      font-family: inherit;
    }

    .category-chip:hover {
      border-color: #005cad;
      color: #005cad;
      background: #d5e3ff;
    }

    .category-chip.active {
      background: #005cad;
      color: #FFFFFF;
      border-color: #005cad;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0, 92, 173, 0.3);
    }

    /* ===== PRODUCT GRID ===== */
    .product-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
      overflow-y: auto;
      flex: 1;
      padding-right: 4px;
      padding-bottom: 8px;
      align-content: start;
    }

    @media (min-width: 640px) {
      .product-grid { grid-template-columns: repeat(3, 1fr); }
    }

    @media (min-width: 1024px) {
      .product-grid { grid-template-columns: repeat(4, 1fr); }
    }

    @media (min-width: 1280px) {
      .product-grid { grid-template-columns: repeat(4, 1fr); gap: 16px; }
    }

    /* ===== PRODUCT CARD ===== */
    .product-card {
      background: #FFFFFF;
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 200ms, box-shadow 200ms;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
      display: flex;
      flex-direction: column;
    }

    .product-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    }

    .product-card:active {
      transform: scale(0.98);
    }

    .product-card.out-of-stock {
      opacity: 0.55;
      pointer-events: none;
    }

    /* Image area */
    .product-image-area {
      position: relative;
      width: 100%;
      padding-top: 68%;
      overflow: hidden;
      background: #f5f5f5;
    }

    .product-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-placeholder {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .placeholder-letter {
      font-size: 36px;
      font-weight: 800;
      color: rgba(255,255,255,0.9);
      text-shadow: 0 2px 8px rgba(0,0,0,0.15);
      line-height: 1;
    }

    /* Stock badge */
    .stock-badge {
      position: absolute;
      top: 8px;
      left: 8px;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 10px;
      font-size: 11px;
      font-weight: 600;
      border-radius: 999px;
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(4px);
      box-shadow: 0 1px 4px rgba(0,0,0,0.12);
      letter-spacing: 0.01em;
    }

    .stock-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .stock-in .stock-dot { background: #1a7a4a; }
    .stock-in { color: #1a7a4a; }

    .stock-low .stock-dot { background: #FCA103; }
    .stock-low { color: #BF6600; }

    .stock-out .stock-dot { background: #D93E3E; }
    .stock-out { color: #D93E3E; }

    /* Product info section */
    .product-info {
      padding: 12px 12px 12px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .product-name {
      font-size: 13px;
      font-weight: 600;
      color: #1a2035;
      line-height: 1.35;
      margin-bottom: 3px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .product-meta {
      font-size: 11px;
      color: #9BA3AF;
      margin-bottom: 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .product-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
    }

    .product-price {
      font-size: 16px;
      font-weight: 700;
      color: #005cad;
      letter-spacing: -0.01em;
    }

    .add-btn {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: #F4F2FF;
      color: #005cad;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 150ms;
      flex-shrink: 0;
    }

    .add-btn:hover:not(:disabled) {
      background: #005cad;
      color: #fff;
      transform: scale(1.1);
    }

    .add-btn:disabled, .disabled-btn {
      background: #F4F2FF;
      color: #9BA3AF;
      cursor: not-allowed;
    }

    /* Empty state */
    .empty-products {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 60px 20px;
      color: #9BA3AF;
      text-align: center;
    }

    .empty-products svg {
      opacity: 0.4;
    }

    .empty-products p {
      font-size: 15px;
      font-weight: 600;
      color: #555663;
      margin: 0;
    }

    .empty-products span {
      font-size: 13px;
      color: #9BA3AF;
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
      'linear-gradient(145deg, #3B4A6B 0%, #5B6D9E 100%)',
      'linear-gradient(145deg, #6B3A3A 0%, #9E5B5B 100%)',
      'linear-gradient(145deg, #3A6B4A 0%, #5B9E6D 100%)',
      'linear-gradient(145deg, #6B4A3A 0%, #9E6D5B 100%)',
      'linear-gradient(145deg, #3A4A6B 0%, #5B6D9E 100%)',
      'linear-gradient(145deg, #4A3A6B 0%, #6D5B9E 100%)',
      'linear-gradient(145deg, #3A6B6B 0%, #5B9E9E 100%)',
      'linear-gradient(145deg, #6B6B3A 0%, #9E9E5B 100%)',
    ];
    return gradients[name.length % gradients.length];
  }

  getStockClass(product: any): string {
    if (product.stockLevel === 0) return 'stock-badge stock-out';
    if (product.stockLevel < 5) return 'stock-badge stock-low';
    return 'stock-badge stock-in';
  }

  getStockLabel(product: any): string {
    if (product.stockLevel === 0) return 'Épuisé';
    if (product.stockLevel < 5) return `${product.stockLevel} restant`;
    return 'En stock';
  }
}
