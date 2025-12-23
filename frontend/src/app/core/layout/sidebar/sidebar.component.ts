import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxPermissionsModule } from 'ngx-permissions';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule, NgxPermissionsModule],
    template: `
    <aside class="sidebar">
      <div class="logo">
        <img src="assets/logo.png" alt="OmniShop360" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0iI2Q0YWYzNyIvPjwvc3ZnPg=='"/>
        <span>OmniShop360</span>
      </div>

      <nav class="menu">
        <a routerLink="/dashboard" routerLinkActive="active" class="menu-item">
          <i class="icon">🏠</i>
          <span>Dashboard</span>
        </a>

        <!-- Sample Group -->
        <div class="menu-group">
          <div class="menu-item group-header" (click)="toggleSample = !toggleSample" [class.active-group]="toggleSample">
            <i class="icon">📂</i>
            <span>Sample</span>
            <i class="chevron" [class.expanded]="toggleSample">▼</i>
          </div>
          <div class="submenu" [class.expanded]="toggleSample">
            <a routerLink="/samples/dashboard" routerLinkActive="active" class="menu-item submenu-item">
              <span>Dashboard Sample</span>
            </a>
            <a routerLink="/samples/list" routerLinkActive="active" class="menu-item submenu-item">
              <span>Data List Sample</span>
            </a>
          </div>
        </div>

        <a routerLink="/products" routerLinkActive="active" class="menu-item">
          <i class="icon">📦</i>
          <span>Products</span>
        </a>
        <a routerLink="/orders" routerLinkActive="active" class="menu-item">
          <i class="icon">🛒</i>
          <span>Orders</span>
        </a>
        <a routerLink="/tenants" routerLinkActive="active" class="menu-item" *ngxPermissionsOnly="['ROLE_superadmin']">
          <i class="icon">👥</i>
          <span>Tenants</span>
        </a>
        <a routerLink="/settings" routerLinkActive="active" class="menu-item">
          <i class="icon">⚙️</i>
          <span>Settings</span>
        </a>
      </nav>
    </aside>
  `,
    styles: [`
    :host {
      display: block;
      height: 100vh;
      background-color: #0F172A;
      color: #94A3B8;
      width: 250px;
      flex-shrink: 0;
    }

    .sidebar {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .logo {
      height: 64px;
      display: flex;
      align-items: center;
      padding: 0 1.5rem;
      color: #F8FAFC;
      font-weight: 700;
      font-size: 1.25rem;
      gap: 0.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.1);

      img { width: 24px; height: 24px; }
    }

    .menu {
      padding: 1rem 0;
      flex: 1;
      overflow-y: auto;
    }

    .menu-item {
      display: flex;
      align-items: center;
      padding: 0.75rem 1.5rem;
      color: #94A3B8;
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
      gap: 0.75rem;
      border-left: 3px solid transparent;

      &:hover {
        color: #F8FAFC;
        background-color: rgba(255,255,255,0.05);
      }

      &.active {
        color: #D4AF37;
        background-color: rgba(212, 175, 55, 0.1);
        border-left-color: #D4AF37;
      }

      .icon { width: 20px; text-align: center; }
    }

    .menu-group {
      .group-header {
        justify-content: space-between;
      }

      .chevron {
        font-size: 0.7rem;
        transition: transform 0.3s;
        &.expanded { transform: rotate(180deg); }
      }
    }

    .submenu {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-out;
      background-color: rgba(0,0,0,0.2);

      &.expanded { max-height: 500px; }

      .submenu-item {
        padding-left: 3.5rem;
        font-size: 0.9rem;
      }
    }
  `]
})
export class SidebarComponent {
    toggleSample = true; // Open by default for visibility
}
