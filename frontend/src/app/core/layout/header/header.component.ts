import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatIconModule, MatButtonModule, MatDividerModule],
  template: `
    <header class="header">
      <div class="left">
        <!-- Breadcrumb or Sidebar Toggle (Mobile) could go here -->
      </div>
      <div class="right">
        <div class="icon-btn">
          <mat-icon>help_outline</mat-icon>
        </div>
        <div class="icon-btn notification">
          <mat-icon>notifications_none</mat-icon>
          <span class="badge">3</span>
        </div>

        <div class="profile" [matMenuTriggerFor]="userMenu">
          <div class="avatar">{{ userInitial }}</div>
          <div class="info">
            <span class="name">{{ userName }}</span>
            <span class="role">{{ userEmail }}</span>
          </div>
          <mat-icon class="chevron">expand_more</mat-icon>
        </div>

        <mat-menu #userMenu="matMenu" xPosition="before">
          <button mat-menu-item disabled>
            <mat-icon>person</mat-icon>
            <span>Profile</span>
          </button>
          <button mat-menu-item disabled>
            <mat-icon>settings</mat-icon>
            <span>Settings</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Logout</span>
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
      height: 64px;
      background-color: #FFFAF0; /* Creamish background from image */
      border-bottom: 1px solid #E5E7EB;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
    }

    .right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .icon-btn {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      color: #64748B;

      &.notification .badge {
        position: absolute;
        top: -2px;
        right: -2px;
        background-color: #EF4444;
        color: white;
        font-size: 0.7rem;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .profile {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 8px;
      transition: background-color 0.2s;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }

      .avatar {
        width: 32px;
        height: 32px;
        background-color: #CBD5E1;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        color: #475569;
        text-transform: uppercase;
      }

      .info {
        display: flex;
        flex-direction: column;
        line-height: 1.2;

        .name { font-weight: 600; font-size: 0.9rem; color: #1E293B; }
        .role { font-size: 0.75rem; color: #64748B; }
      }

      .chevron { color: #94A3B8; font-size: 1.2rem; }
    }
  `]
})
export class HeaderComponent {
  private authService = inject(AuthService);

  get userName(): string {
    return this.authService.userProfile?.name || 'User';
  }

  get userEmail(): string {
    return this.authService.userProfile?.email || '';
  }

  get userInitial(): string {
    return this.userName.charAt(0);
  }

  logout() {
    this.authService.logout();
  }
}
