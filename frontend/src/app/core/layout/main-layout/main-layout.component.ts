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
      background-color: var(--color-background);
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
      overflow: hidden;
      min-width: 0;
    }

    .content-wrapper {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-6);
      background-color: var(--color-background);
    }

    /* Mobile Responsive Styles */
    @media (max-width: 1024px) {
      .sidebar-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: var(--sidebar-width);
        transform: translateX(-100%);
        transition: transform var(--transition-slow);
      }

      .sidebar-wrapper.open {
        transform: translateX(0);
      }

      .sidebar-wrapper.open .overlay {
        display: block;
        position: fixed;
        top: 0;
        left: var(--sidebar-width);
        right: 0;
        bottom: 0;
        background-color: rgba(25, 27, 38, 0.4);
        backdrop-filter: blur(4px);
        width: 100vw;
        z-index: -1;
      }

      .content-wrapper {
        padding: var(--space-4);
      }
    }

    @media (max-width: 640px) {
      .content-wrapper {
        padding: var(--space-3);
      }
    }
  `]
})
export class MainLayoutComponent implements OnInit {
  layoutService = inject(LayoutService);
  private router = inject(Router);

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.layoutService.closeSidebar();
    });
  }
}
