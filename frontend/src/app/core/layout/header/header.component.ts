import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../auth/auth.service';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatIconModule, MatButtonModule, MatDividerModule],
  template: `
    <header class="header">
      <div class="header-left">
        <button class="menu-toggle" (click)="toggleSidebar()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <div class="breadcrumb">
          <span class="breadcrumb-item">OmniShop 360</span>
          <svg class="breadcrumb-separator" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="breadcrumb-item active">{{ currentPage }}</span>
        </div>
      </div>

      <div class="header-right">
        <!-- Search -->
        <div class="search-box">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <input type="text" placeholder="Rechercher..." class="search-input" />
          <kbd class="search-shortcut">⌘K</kbd>
        </div>

        <!-- Notifications -->
        <button class="icon-btn notification" [matMenuTriggerFor]="notifMenu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="badge" *ngIf="notificationCount > 0">{{ notificationCount }}</span>
        </button>

        <mat-menu #notifMenu="matMenu" xPosition="before">
          <div class="notif-header" (click)="$event.stopPropagation()">
            <span>Notifications</span>
            <button class="mark-read-btn">Tout marquer comme lu</button>
          </div>
          <mat-divider></mat-divider>
          <div class="notif-item" (click)="$event.stopPropagation()">
            <div class="notif-icon success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" stroke-width="2"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="notif-content">
              <span class="notif-title">Vente confirmée</span>
              <span class="notif-desc">Ticket #F-0042 • 42.50€</span>
            </div>
          </div>
          <div class="notif-item" (click)="$event.stopPropagation()">
            <div class="notif-icon warning">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" stroke-width="2"/><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2"/></svg>
            </div>
            <div class="notif-content">
              <span class="notif-title">Stock bas</span>
              <span class="notif-desc">Coca-Cola 33cl : 3 unités</span>
            </div>
          </div>
        </mat-menu>

        <!-- Profile -->
        <div class="profile" [matMenuTriggerFor]="userMenu">
          <div class="avatar">{{ userInitial }}</div>
          <div class="info">
            <span class="name">{{ userName }}</span>
            <span class="role-badge">{{ userRole }}</span>
          </div>
          <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <mat-menu #userMenu="matMenu" xPosition="before">
          <div class="user-menu-header" (click)="$event.stopPropagation()">
            <div class="user-menu-avatar">{{ userInitial }}</div>
            <div class="user-menu-info">
              <span class="user-menu-name">{{ userName }}</span>
              <span class="user-menu-email">{{ userEmail }}</span>
            </div>
          </div>
          <mat-divider></mat-divider>
          <button mat-menu-item>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/></svg>
            <span>Mon Profil</span>
          </button>
          <button mat-menu-item>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" stroke-width="2"/></svg>
            <span>Paramètres</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()" class="logout-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Déconnexion</span>
          </button>
        </mat-menu>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }

    .header {
      height: var(--header-height);
      background-color: var(--color-surface);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--space-6);
      box-shadow: var(--shadow-header);
      flex-shrink: 0;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }

    .menu-toggle {
      display: none;
      width: 40px;
      height: 40px;
      background: none;
      border: none;
      border-radius: var(--radius-md);
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .menu-toggle:hover {
      background-color: var(--color-surface-container-low);
      color: var(--color-text-primary);
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: 14px;
    }

    .breadcrumb-item {
      color: var(--color-text-secondary);
    }

    .breadcrumb-item.active {
      color: var(--color-text-primary);
      font-weight: 500;
    }

    .breadcrumb-separator {
      color: var(--color-text-secondary);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-4);
      background-color: var(--color-surface-container-low);
      border-radius: var(--radius-lg);
      min-width: 280px;
      transition: all var(--transition-fast);
    }

    .search-box:focus-within {
      background-color: var(--color-surface);
      box-shadow: 0 0 0 2px var(--color-primary-light);
    }

    .search-icon {
      color: var(--color-text-secondary);
      flex-shrink: 0;
    }

    .search-input {
      flex: 1;
      border: none;
      background: none;
      font-family: var(--font-family-base);
      font-size: 14px;
      color: var(--color-text-primary);
      outline: none;
    }

    .search-input::placeholder {
      color: var(--color-text-secondary);
    }

    .search-shortcut {
      font-size: 11px;
      padding: 2px 6px;
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      color: var(--color-text-secondary);
      font-family: var(--font-family-base);
    }

    .icon-btn {
      position: relative;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      border-radius: var(--radius-md);
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .icon-btn:hover {
      background-color: var(--color-surface-container-low);
      color: var(--color-text-primary);
    }

    .notification .badge {
      position: absolute;
      top: 4px;
      right: 4px;
      min-width: 18px;
      height: 18px;
      background-color: var(--color-error);
      color: white;
      font-size: 11px;
      font-weight: 600;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
    }

    .profile {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: background-color var(--transition-fast);
    }

    .profile:hover {
      background-color: var(--color-surface-container-low);
    }

    .avatar {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: var(--color-text-on-primary);
      font-size: 14px;
    }

    .info {
      display: flex;
      flex-direction: column;
      line-height: 1.3;
    }

    .name {
      font-weight: 500;
      font-size: 14px;
      color: var(--color-text-primary);
    }

    .role-badge {
      font-size: 11px;
      font-weight: 500;
      color: var(--color-primary);
      background-color: var(--color-primary-light);
      padding: 2px 8px;
      border-radius: var(--radius-full);
      width: fit-content;
    }

    .chevron {
      color: var(--color-text-secondary);
    }

    /* Notification Menu Styles */
    .notif-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-3) var(--space-4);
      font-weight: 600;
      font-size: 14px;
      color: var(--color-text-primary);
    }

    .mark-read-btn {
      background: none;
      border: none;
      color: var(--color-primary);
      font-size: 12px;
      cursor: pointer;
    }

    .mark-read-btn:hover {
      text-decoration: underline;
    }

    .notif-item {
      display: flex;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      cursor: pointer;
      transition: background-color var(--transition-fast);
    }

    .notif-item:hover {
      background-color: var(--color-surface-container-low);
    }

    .notif-icon {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .notif-icon.success {
      background-color: var(--color-success-light);
      color: var(--color-success);
    }

    .notif-icon.warning {
      background-color: var(--color-warning-light);
      color: var(--color-warning);
    }

    .notif-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .notif-title {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-text-primary);
    }

    .notif-desc {
      font-size: 12px;
      color: var(--color-text-secondary);
    }

    /* User Menu Styles */
    .user-menu-header {
      display: flex;
      gap: var(--space-3);
      padding: var(--space-4);
    }

    .user-menu-avatar {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: var(--color-text-on-primary);
      font-size: 18px;
    }

    .user-menu-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .user-menu-name {
      font-weight: 600;
      font-size: 14px;
      color: var(--color-text-primary);
    }

    .user-menu-email {
      font-size: 12px;
      color: var(--color-text-secondary);
    }

    ::ng-deep .mat-mdc-menu-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    ::ng-deep .logout-btn {
      color: var(--color-error);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .header {
        padding: 0 var(--space-4);
      }

      .menu-toggle {
        display: flex;
      }

      .search-box {
        min-width: auto;
        flex: 1;
        max-width: 200px;
      }

      .search-shortcut {
        display: none;
      }

      .info {
        display: none;
      }
    }

    @media (max-width: 640px) {
      .search-box {
        display: none;
      }

      .breadcrumb {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private layoutService = inject(LayoutService);

  notificationCount = 3;
  currentPage = 'Tableau de Bord';

  get userName(): string {
    return this.authService.userProfile?.name || 'Utilisateur';
  }

  get userEmail(): string {
    return this.authService.userProfile?.email || 'email@exemple.com';
  }

  get userRole(): string {
    return 'Administrateur';
  }

  get userInitial(): string {
    return this.userName.charAt(0).toUpperCase();
  }

  logout() {
    this.authService.logout();
  }

  toggleSidebar() {
    this.layoutService.toggleSidebar();
  }
}
