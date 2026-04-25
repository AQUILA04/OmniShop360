import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxPermissionsModule } from 'ngx-permissions';
import { LayoutService } from '../layout.service';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxPermissionsModule],
  template: `
    <aside class="sidebar">
      <!-- Brand -->
      <div class="sidebar-header">
        <div class="brand">
          <h1 class="brand-title">ATELIER RETAIL</h1>
          <span class="brand-subtitle">ENTERPRISE SUITE</span>
        </div>
        <button class="close-btn" (click)="closeSidebar()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <nav class="menu">

        <!-- Dashboard -->
        <a routerLink="/dashboard" routerLinkActive="active" class="menu-item">
          <svg class="menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          </svg>
          <span>Dashboard</span>
        </a>

        <!-- ====================================================
             SHOP ADMIN GROUP
             Roles: SHOP_ADMIN, STOCK_MANAGER, superadmin
             ==================================================== -->
        <div class="menu-group" *ngxPermissionsOnly="['ROLE_SHOP_ADMIN', 'ROLE_STOCK_MANAGER', 'ROLE_superadmin', 'ROLE_SUPERADMIN']">
          <div class="menu-section-label">Gestion Boutique</div>

          <!-- Inventory (with submenu) -->
          <div class="menu-group-item">
            <button class="menu-item menu-item-parent"
                    [class.open]="openMenus['inventory']"
                    (click)="toggleMenu('inventory')">
              <svg class="menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 8V21H3V8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M23 3H1V8H23V3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 12H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Inventaire</span>
              <svg class="chevron" [class.rotated]="openMenus['inventory']" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div class="submenu" [class.open]="openMenus['inventory']">
              <a routerLink="/shop-admin/inventory" routerLinkActive="active" class="submenu-item">
                <span class="submenu-dot"></span>
                Liste des produits
              </a>
              <a routerLink="/shop-admin/stock-movement" routerLinkActive="active" class="submenu-item"
                 *ngxPermissionsOnly="['ROLE_SHOP_ADMIN', 'ROLE_STOCK_MANAGER', 'ROLE_superadmin']">
                <span class="submenu-dot"></span>
                Mouvements de stock
              </a>
            </div>
          </div>

          <!-- Sales -->
          <a routerLink="/shop-admin/sales-history" routerLinkActive="active" class="menu-item">
            <svg class="menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 20V10M12 20V4M6 20V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Ventes</span>
          </a>

          <!-- Customers -->
          <a routerLink="/shop-admin/clients" routerLinkActive="active" class="menu-item">
            <svg class="menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
              <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Clients</span>
          </a>

          <!-- Utilisateurs — visible pour SHOP_ADMIN et superadmin
               (TENANT_ADMIN le voit dans sa propre section ci-dessous) -->
          <a routerLink="/tenant/users" routerLinkActive="active" class="menu-item"
             *ngxPermissionsOnly="['ROLE_SHOP_ADMIN', 'ROLE_superadmin', 'ROLE_SUPERADMIN']">
            <svg class="menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Utilisateurs</span>
          </a>

          <!-- Analytics -->
          <a routerLink="/shop-admin/analytics" routerLinkActive="active" class="menu-item">
            <svg class="menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 3V21H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M19 9L14 14L10 10L3 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Analytique</span>
          </a>
        </div>

        <!-- ====================================================
             TENANT ADMIN GROUP
             Roles: TENANT_ADMIN, superadmin
             ==================================================== -->
        <div class="menu-group" *ngxPermissionsOnly="['ROLE_TENANT_ADMIN', 'ROLE_superadmin', 'ROLE_SUPERADMIN']">
          <div class="menu-section-label">Administration Tenant</div>

          <!-- Boutiques (with submenu) -->
          <div class="menu-group-item">
            <button class="menu-item menu-item-parent"
                    [class.open]="openMenus['shops']"
                    (click)="toggleMenu('shops')">
              <svg class="menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Boutiques</span>
              <svg class="chevron" [class.rotated]="openMenus['shops']" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div class="submenu" [class.open]="openMenus['shops']">
              <a routerLink="/tenant/shops" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="submenu-item">
                <span class="submenu-dot"></span>
                Liste des boutiques
              </a>
              <a routerLink="/tenant/shops/create" routerLinkActive="active" class="submenu-item">
                <span class="submenu-dot"></span>
                Créer une boutique
              </a>
            </div>
          </div>

          <!-- Catalogue (with submenu) -->
          <div class="menu-group-item">
            <button class="menu-item menu-item-parent"
                    [class.open]="openMenus['catalog']"
                    (click)="toggleMenu('catalog')">
              <svg class="menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Catalogue</span>
              <svg class="chevron" [class.rotated]="openMenus['catalog']" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div class="submenu" [class.open]="openMenus['catalog']">
              <a routerLink="/tenant/catalog" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="submenu-item">
                <span class="submenu-dot"></span>
                Produits
              </a>
              <a routerLink="/tenant/catalog/create" routerLinkActive="active" class="submenu-item">
                <span class="submenu-dot"></span>
                Nouveau produit
              </a>
              <a routerLink="/tenant/categories" routerLinkActive="active" class="submenu-item">
                <span class="submenu-dot"></span>
                Catégories
              </a>
            </div>
          </div>

          <!-- Users -->
          <a routerLink="/tenant/users" routerLinkActive="active" class="menu-item">
            <svg class="menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Utilisateurs</span>
          </a>

          <!-- Paramètres -->
          <a routerLink="/tenant/settings" routerLinkActive="active" class="menu-item">
            <svg class="menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Paramètres</span>
          </a>

          <!-- Audit Logs -->
          <a routerLink="/tenant/audit-logs" routerLinkActive="active" class="menu-item"
             *ngxPermissionsOnly="['ROLE_superadmin', 'ROLE_TENANT_ADMIN']">
            <svg class="menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <polyline points="10 9 9 9 8 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Audit Logs</span>
          </a>
        </div>

        <!-- ====================================================
             SUPER ADMIN GROUP
             Roles: superadmin only
             ==================================================== -->
        <div class="menu-group" *ngxPermissionsOnly="['ROLE_superadmin', 'ROLE_SUPERADMIN']">
          <div class="menu-section-label">Super Admin</div>

          <a routerLink="/tenants" routerLinkActive="active" class="menu-item">
            <svg class="menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 21h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M5 21V7l7-4 7 4v14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 21V11h6v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Tenants</span>
          </a>
        </div>

      </nav>

      <!-- CTA: Access POS -->
      <div class="sidebar-actions">
        <button class="btn btn-primary btn-new-entry" (click)="openPos()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
            <path d="M2 10H22" stroke="currentColor" stroke-width="2"/>
          </svg>
          Caisse (POS)
        </button>
      </div>

      <!-- Footer -->
      <div class="sidebar-footer">
        <a routerLink="/help" class="menu-item">
          <svg class="menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="17" r="1" fill="currentColor"/>
          </svg>
          <span>Support</span>
        </a>
        <a class="menu-item logout-link" (click)="logout()">
          <svg class="menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="16 17 21 12 16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>Déconnexion</span>
        </a>
      </div>
    </aside>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }

    .sidebar {
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: var(--color-surface);
      width: var(--sidebar-width);
      overflow: hidden;
      /* No-Line rule: tonal separation, no border */
      box-shadow: var(--shadow-ambient);
    }

    /* ---- Brand ---- */
    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-6) var(--space-5);
      flex-shrink: 0;
    }

    .brand { display: flex; flex-direction: column; }

    .brand-title {
      font-size: 18px;
      font-weight: 800;
      color: var(--color-primary);
      letter-spacing: -0.02em;
      margin: 0;
      line-height: 1.2;
    }

    .brand-subtitle {
      font-size: 10px;
      font-weight: 600;
      color: var(--color-text-secondary);
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .close-btn {
      display: none;
      width: 36px; height: 36px;
      background: none; border: none;
      border-radius: var(--radius-md);
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);
      align-items: center; justify-content: center;
    }

    .close-btn:hover {
      background-color: var(--color-surface-container-low);
    }

    /* ---- Navigation ---- */
    .menu {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-3) var(--space-4) var(--space-4);
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    /* Section header labels */
    .menu-section-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--color-text-secondary);
      opacity: 0.6;
      padding: var(--space-4) var(--space-4) var(--space-2);
    }

    .menu-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .menu-group-item {
      display: flex;
      flex-direction: column;
    }

    /* Base menu item */
    .menu-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      color: var(--color-text-primary);
      text-decoration: none;
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      width: 100%;
      background: none;
      border: none;
      text-align: left;
    }

    .menu-item:hover {
      background-color: var(--color-surface-container-low);
      color: var(--color-primary);
    }

    .menu-item.active {
      background-color: var(--color-primary-light);
      color: var(--color-primary);
      font-weight: 600;
    }

    /* Parent item with chevron */
    .menu-item-parent {
      justify-content: flex-start;
    }

    .menu-item-parent .chevron {
      margin-left: auto;
      flex-shrink: 0;
      transition: transform var(--transition-fast);
      color: var(--color-text-secondary);
    }

    .menu-item-parent .chevron.rotated {
      transform: rotate(180deg);
    }

    .menu-icon {
      width: 20px; height: 20px;
      flex-shrink: 0;
      color: inherit;
    }

    /* ---- Submenu ---- */
    .submenu {
      max-height: 0;
      overflow: hidden;
      transition: max-height 300ms ease-in-out;
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding-left: var(--space-8); /* indent under icon */
    }

    .submenu.open {
      max-height: 300px; /* enough for all items */
    }

    .submenu-item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      color: var(--color-text-secondary);
      text-decoration: none;
      border-radius: var(--radius-sm);
      font-size: 13px;
      font-weight: 500;
      transition: all var(--transition-fast);
      cursor: pointer;
    }

    .submenu-item:hover {
      color: var(--color-primary);
      background-color: var(--color-primary-light);
    }

    .submenu-item.active {
      color: var(--color-primary);
      font-weight: 600;
    }

    .submenu-dot {
      width: 5px; height: 5px;
      border-radius: 50%;
      background-color: currentColor;
      flex-shrink: 0;
      opacity: 0.5;
    }

    .submenu-item.active .submenu-dot,
    .submenu-item:hover .submenu-dot {
      opacity: 1;
    }

    /* ---- CTA Button ---- */
    .sidebar-actions {
      padding: var(--space-4);
      flex-shrink: 0;
    }

    .btn-new-entry {
      width: 100%;
      min-height: 44px;
      font-weight: 600;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
    }

    /* ---- Footer ---- */
    .sidebar-footer {
      padding: var(--space-4);
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      flex-shrink: 0;
    }

    .logout-link { color: var(--color-error); }
    .logout-link:hover { background-color: var(--color-error-light); color: var(--color-error); }

    @media (max-width: 1024px) {
      .close-btn { display: flex; }
    }
  `]
})
export class SidebarComponent {
  private layoutService = inject(LayoutService);
  private oauthService = inject(OAuthService);

  // Track which dropdown menus are open
  openMenus: { [key: string]: boolean } = {
    inventory: false,
    shops: false,
    catalog: false,
  };

  toggleMenu(key: string) {
    this.openMenus[key] = !this.openMenus[key];
  }

  closeSidebar() {
    this.layoutService.closeSidebar();
  }

  logout() {
    this.oauthService.logOut();
  }

  openPos() {
    window.location.href = '/pos';
  }
}
