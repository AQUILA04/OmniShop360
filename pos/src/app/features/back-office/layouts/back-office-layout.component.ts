import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { UserProfile } from '../../../core/models/user-profile.model';

@Component({
  selector: 'app-back-office-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="layout-container">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="brand">
          <div class="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 22V12h6v10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="brand-text">SwiftPOS</span>
        </div>

        <nav class="nav-menu">
          <a routerLink="/back-office/dashboard" routerLinkActive="active" class="nav-item">
            <span class="icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4h6v8H4zM4 16h6v4H4zM14 12h6v8h-6zM14 4h6v4h-6z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </span>
            <span>Dashboard</span>
          </a>
          <a routerLink="/pos" class="nav-item">
            <span class="icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3h18v18H3zM9 3v18M15 3v18M3 9h18M3 15h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </span>
            <span>Sales</span>
          </a>
          <a routerLink="/back-office/transactions" routerLinkActive="active" class="nav-item">
            <span class="icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </span>
            <span>Transactions</span>
          </a>
          <a routerLink="/back-office/inventory" routerLinkActive="active" class="nav-item">
            <span class="icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </span>
            <span>Inventory</span>
          </a>
          <a routerLink="/back-office/customers" routerLinkActive="active" class="nav-item">
            <span class="icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </span>
            <span>Customers</span>
          </a>
        </nav>

        <div class="user-profile">
          <div class="avatar">
           <span class="initials">{{ userInitials }}</span>
          </div>
          <div class="user-info">
            <span class="name">{{ userName }}</span>
            <span class="role">{{ userRole }}</span>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
    }

    .layout-container {
      display: flex;
      height: 100%;
      background-color: #F3F4F6; /* Light grey background */
    }

    /* Sidebar */
    .sidebar {
      width: 256px;
      background-color: white;
      border-right: 1px solid #E5E7EB;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }

    .brand {
      height: 64px;
      display: flex;
      align-items: center;
      padding: 0 24px;
      gap: 12px;
      border-bottom: 1px solid #F3F4F6;
    }

    .logo-icon {
      font-size: 24px;
    }

    .brand-text {
      font-weight: 700;
      font-size: 20px;
      color: #111827;
    }

    .nav-menu {
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      color: #4B5563;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
    }

    .nav-item:hover {
      background-color: #F9FAFB;
      color: #111827;
    }

    .nav-item.active {
      background-color: #EFF6FF; /* Light blue bg */
      color: #2563EB; /* Blue text */
    }

    /* Icons */
    .icon {
      font-size: 18px;
      width: 20px;
      text-align: center;
    }

    /* User Profile */
    .user-profile {
      padding: 16px 24px;
      border-top: 1px solid #F3F4F6;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      background-color: #FFEDD5; /* Same orange as POS */
      color: #EA580C;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }
    
    .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .name {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
    }

    .role {
      font-size: 12px;
      color: #6B7280;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      overflow-y: auto;
      padding: 32px;
    }
  `]
})
export class BackOfficeLayoutComponent implements OnInit {
  userName = 'User';
  userRole = 'Staff';
  userInitials = 'U';

  constructor(private oauthService: OAuthService) { }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const claims = this.oauthService.getIdentityClaims() as UserProfile;
    if (claims) {
      this.userName = claims['name'] || claims['preferred_username'] || 'User';

      // Extract initials
      const parts = this.userName.split(' ');
      if (parts.length >= 2) {
        this.userInitials = (parts[0][0] + parts[1][0]).toUpperCase();
      } else if (this.userName.length > 0) {
        this.userInitials = this.userName.substring(0, 2).toUpperCase();
      }
    }
  }
}
