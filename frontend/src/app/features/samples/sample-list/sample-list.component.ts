import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-sample-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="page-header">
      <h2>Data List</h2>
      <div class="actions">
        <div class="search-box">
          <input type="text" placeholder="Search" />
          <span class="icon">🔍</span>
        </div>
        <button class="btn-primary" routerLink="/samples/edit/new">Edit Product</button> <!-- Using 'Edit Product' as in mockup -->
      </div>
    </div>

    <div class="card table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th class="w-10"><input type="checkbox"></th>
            <th>Item Name</th>
            <th>Category</th>
            <th>Status</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of items; let i = index" [class.selected]="i === 1"> <!-- Highlighting second row as mockup example -->
            <td><input type="checkbox" [checked]="i === 1"></td>
            <td class="flex items-center gap-2">
               <div class="icon-thumb">{{ item.icon }}</div>
               <a [routerLink]="['/samples/details', item.id]" class="text-link">{{ item.name }}</a>
            </td>
            <td>{{ item.category }}</td>
            <td>
              <span class="badge" [ngClass]="item.status === 'Active' ? 'badge-success' : 'badge-warning'">
                {{ item.status }}
              </span>
            </td>
            <td>{{ item.price }}</td>
            <td>
              <div class="action-buttons">
                <button class="btn-icon text-blue" [routerLink]="['/samples/edit', item.id]">✏️</button>
                <button class="btn-icon text-red">🗑️</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
    styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      h2 { font-size: 1.5rem; font-weight: 700; margin: 0; }
    }
    
    .actions {
       display: flex; gap: 1rem;
    }
    
    .search-box {
       position: relative;
       input { 
         padding: 0.5rem 1rem 0.5rem 2.5rem;
         border: 1px solid #E2E8F0;
         border-radius: 6px;
         width: 250px;
       }
       .icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); opacity: 0.5; }
    }
    
    .btn-primary {
       background-color: #0B1E33;
       color: white;
       padding: 0.5rem 1rem;
       border-radius: 6px;
       font-weight: 600;
    }
    
    .card { background: white; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); overflow: hidden; }
    
    .data-table {
       width: 100%;
       border-collapse: collapse;
       
       th, td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #F1F5F9;
       }
       
       th { background-color: #F8FAFC; color: #64748B; font-weight: 600; font-size: 0.9rem; }
       
       tr:hover { background-color: #F8FAFC; }
       tr.selected { background-color: #FFFBF0; } /* Cream highlight */
    }
    
    .icon-thumb { width: 32px; height: 32px; background: #EEE; border-radius: 4px; display: flex; align-items: center; justify-content: center; margin-right: 0.5rem; }
    .flex { display: flex; }
    .items-center { align-items: center; }
    .gap-2 { gap: 0.5rem; }
    .text-link { color: #0B1E33; font-weight: 500; text-decoration: none; &:hover { text-decoration: underline; } }
    
    .badge {
       padding: 0.25rem 0.75rem;
       border-radius: 999px;
       font-size: 0.75rem;
       font-weight: 600;
       
       &.badge-success { background-color: #DCFCE7; color: #166534; }
       &.badge-warning { background-color: #FEF9C3; color: #854D0E; }
    }
    
    .btn-icon { background: none; border: none; cursor: pointer; padding: 0.25rem; font-size: 1.1rem; }
    .text-blue { color: #3B82F6; }
    .text-red { color: #EF4444; }
  `]
})
export class SampleListComponent {
    items = [
        { id: 1, name: 'Item Name 1', category: 'Apparel', status: 'Active', price: '$20.00', icon: '👕' },
        { id: 2, name: 'Product #1 2', category: 'Category', status: 'Pending', price: '$30.00', icon: '👖' },
        { id: 3, name: 'Item Name 3', category: 'Products', status: 'Active', price: '$20.00', icon: '👘' },
        { id: 4, name: 'Item Name 4', category: 'Bond', status: 'Active', price: '$25.00', icon: '👔' },
        { id: 5, name: 'Product #105', category: 'Category', status: 'Active', price: '$26.00', icon: '🧢' },
    ];
}
