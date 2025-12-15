import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="left">
        <!-- Breadcrumb or Sidebar Toggle (Mobile) could go here -->
      </div>
      <div class="right">
        <div class="icon-btn">❓</div>
        <div class="icon-btn notification">
          🔔
          <span class="badge">3</span>
        </div>
        <div class="profile">
          <div class="avatar">U</div>
          <div class="info">
            <span class="name">User</span>
            <span class="role">&#64;omnishop360</span>
          </div>
          <span class="chevron">▼</span>
        </div>
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
      font-size: 1.2rem;
      position: relative;
      color: #64748B;
      
      &.notification .badge {
        position: absolute;
        top: -5px;
        right: -5px;
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
      }
      
      .info {
        display: flex;
        flex-direction: column;
        line-height: 1.2;
        
        .name { font-weight: 600; font-size: 0.9rem; color: #1E293B; }
        .role { font-size: 0.75rem; color: #64748B; }
      }
      
      .chevron { color: #94A3B8; font-size: 0.8rem; }
    }
  `]
})
export class HeaderComponent { }
