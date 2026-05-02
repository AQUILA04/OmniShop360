import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-pos-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="sidebar">
      <!-- Brand -->
      <div class="sidebar-brand">
        <div class="brand-mark">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M2 7.5L12 3L22 7.5V16.5L12 21L2 16.5V7.5Z" fill="rgba(0,92,173,0.15)"/>
            <path d="M2 7.5L12 3L22 7.5M2 7.5V16.5L12 21M2 7.5L12 12M22 7.5V16.5L12 21M12 12V21M12 12L22 7.5" stroke="#005cad" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <!-- Nav items -->
      <nav class="nav-items">
        <a href="/back-office" class="nav-item" title="Accueil">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 9L12 2L21 9V20C21 20.55 20.78 21.04 20.41 21.41C20.04 21.78 19.55 22 19 22H5C4.45 22 3.96 21.78 3.59 21.41C3.21 21.04 3 20.55 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>

        <a class="nav-item active" title="Point de Vente">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
            <path d="M6 8H18M6 12H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </a>

        <a href="/back-office/shop-admin/inventory" class="nav-item" title="Inventaire">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 8V21H3V8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M23 3H1V8H23V3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 12H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </a>

        <a href="/back-office/shop-admin/customers" class="nav-item" title="Clients">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>

        <a href="/back-office" class="nav-item" title="Analytiques">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 20V10M12 20V4M6 20V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </nav>

      <!-- Footer -->
      <div class="sidebar-footer">
        <a class="nav-item" title="Paramètres">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="2"/>
          </svg>
        </a>

        <a class="nav-item user-item" (click)="logout()" title="Déconnexion">
          <div class="user-avatar">QB</div>
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
      width: 64px;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #FFFFFF;
      box-shadow: 1px 0 0 rgba(0,0,0,0.06);
      padding: 12px 0;
      overflow: hidden;
    }

    .sidebar-brand {
      width: 100%;
      display: flex;
      justify-content: center;
      padding: 10px 0 20px;
      flex-shrink: 0;
    }

    .brand-mark {
      width: 40px;
      height: 40px;
      background: #d5e3ff;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .nav-items {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 100%;
      align-items: center;
      padding: 0 10px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 12px;
      color: #9BA3AF;
      text-decoration: none;
      cursor: pointer;
      transition: all 150ms;
      background: none;
      border: none;
    }

    .nav-item:hover {
      background: #F4F2FF;
      color: #005cad;
    }

    .nav-item.active {
      background: #005cad;
      color: #FFFFFF;
      box-shadow: 0 4px 12px rgba(0, 92, 173, 0.3);
    }

    .sidebar-footer {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 0 10px;
      width: 100%;
    }

    .user-item {
      color: #9BA3AF;
    }

    .user-item:hover {
      background: #FDECEC;
      color: #D93E3E;
    }

    .user-avatar {
      width: 34px;
      height: 34px;
      background: linear-gradient(135deg, #005cad 0%, #2075d0 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      font-size: 10px;
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
