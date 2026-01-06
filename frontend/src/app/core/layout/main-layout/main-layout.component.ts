import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { LayoutService } from '../layout.service';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent],
    template: `
    <div class="layout-container">
      <!-- Sidebar with responsive visibility -->
      <div class="sidebar-wrapper" [class.open]="layoutService.sidebarOpen()">
        <app-sidebar></app-sidebar>
        <div class="overlay" (click)="layoutService.closeSidebar()"></div>
      </div>

      <div class="main-content">
        <app-header></app-header>
        <div class="content-wrapper">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .layout-container {
      display: flex;
      height: 100vh;
      overflow: hidden;
      position: relative;
    }

    .sidebar-wrapper {
      display: flex;
      z-index: 50;
    }

    .overlay {
      display: none;
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: #F1F5F9; /* Light gray background for content area */
      overflow: hidden;
      width: 100%;
    }

    .content-wrapper {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
    }

    /* Mobile Responsive Styles */
    @media (max-width: 768px) {
      .sidebar-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        transform: translateX(-100%);
        transition: transform 0.3s ease-in-out;
      }

      .sidebar-wrapper.open {
        transform: translateX(0);
      }

      .sidebar-wrapper.open .overlay {
        display: block;
        position: fixed;
        top: 0;
        left: 250px; /* Width of sidebar */
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        width: 100vw;
      }

      .content-wrapper {
        padding: 1rem;
      }
    }
  `]
})
export class MainLayoutComponent implements OnInit {
  layoutService = inject(LayoutService);
  private router = inject(Router);

  ngOnInit() {
    // Close sidebar on route change (mobile)
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.layoutService.closeSidebar();
    });
  }
}
