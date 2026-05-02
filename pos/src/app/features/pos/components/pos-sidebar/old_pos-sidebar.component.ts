import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-pos-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="sidebar">
      <!-- Brand Icon -->
      <div class="sidebar-header">
        <div class="brand-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M2 7.5L12 3L22 7.5V16.5L12 21L2 16.5V7.5Z" fill="var(--color-primary)" opacity="0.15"/>
            <path d="M2 7.5L12 3L22 7.5M2 7.5V16.5L12 21M2 7.5L12 12M22 7.5V16.5L12 21M12 12V21M12 12L22 7.5" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <nav class="menu">
        <!-- Dashboard -->
        <a href="/back-office" class="menu-item" title="Dashboard">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>

        <!-- POS - active -->
        <a class="menu-item active" title="Point de Vente">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
            <path d="M6 8H18M6 12H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </a>

        <!-- Inventory -->
        <a href="/back-office/shop-admin/inventory" class="menu-item" title="Inventaire">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M21 8V21H3V8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M23 3H1V8H23V3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 12H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>

        <!-- Clients -->
        <a href="/back-office/shop-admin/customers" class="menu-item" title="Clients">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>

        <!-- Analytics -->
        <a href="/back-office" class="menu-item" title="Analytics">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M18 20V10M12 20V4M6 20V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </nav>

      <div class="sidebar-footer">
        <!-- Settings -->
        <a class="menu-item" title="Paramètres">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            <path d="M20 12a8.001 8.001 0 0 0-.48-2.69l2.08-1.7-2-3.46-2.57.87A8 8 0 0 0 14 3.47V1h-4v2.47a8 8 0 0 0-3.03 1.55L4.4 4.15l-2 3.46 2.08 1.7A8.001 8.001 0 0 0 4 12a8.001 8.001 0 0 0 .48 2.69l-2.08 1.7 2 3.46 2.57-.87A8 8 0 0 0 10 20.53V23h4v-2.47a8 8 0 0 0 3.03-1.55l2.57.87 2-3.46-2.08-1.7A8.001 8.001 0 0 0 20 12z" stroke="currentColor" stroke-width="2"/>
          </svg>
        </a>
        <!-- User / Logout -->
        <a class="menu-item logout-link" (click)="logout()" title="Déconnexion">
          <div class="user-avatar">
            <span>QB</span>
          </div>
        </a>
      </div>
    </aside>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      /* No-Line rule: replace border-right with tonal bg + shadow */
      box-shadow: var(--shadow-ambient);
    }
    .sidebar {
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: var(--color-surface);
      width: 64px; /* Icon-only sidebar matching mockup */
      overflow: visible;
      align-items: center;
      padding: var(--space-4) 0;
    }
    .sidebar-header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-4) 0 var(--space-6);
    }
    .brand-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background-color: var(--color-primary-light);
      border-radius: var(--radius-md);
    }
    .menu {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      width: 100%;
      align-items: center;
      padding: 0 var(--space-2);
    }
    .menu-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      color: var(--color-text-secondary);
      text-decoration: none;
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
      cursor: pointer;
      background: none;
      border: none;
      position: relative;
    }
    .menu-item:hover {
      background-color: var(--color-surface-container-low);
      color: var(--color-primary);
    }
    .menu-item.active {
      background-color: var(--color-primary);
      color: white;
      box-shadow: 0 4px 12px rgba(0, 92, 173, 0.3);
    }
    .sidebar-footer {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2);
    }
    .logout-link {
      color: var(--color-text-secondary);
    }
    .logout-link:hover {
      background-color: var(--color-error-light);
      color: var(--color-error);
    }
    .user-avatar {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
    @media (max-width: 1023px) {
      :host { display: none !important; }
    }
  `]
})
export class PosSidebarComponent {
  private oauthService = inject(OAuthService);

  logout() {
    this.oauthService.logOut();
  }
}
