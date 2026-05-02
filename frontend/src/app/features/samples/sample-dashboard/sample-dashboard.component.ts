import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-sample-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="dashboard-header mb-4">
      <h2 class="text-xl font-bold">Dashboard</h2>
    </div>

    <!-- Stats Cards -->
    <div class="grid-3 mb-6">
      <div class="card stats-card">
        <div class="icon-wrap bg-yellow-100 text-yellow-600">🛒</div>
        <div class="stats-info">
          <span class="label">Total Sales</span>
          <span class="value">$27,508</span>
          <span class="trend positive">+4.45%</span>
        </div>
      </div>
      <div class="card stats-card">
        <div class="icon-wrap bg-yellow-100 text-yellow-600">👥</div>
        <div class="stats-info">
          <span class="label">Active Tenants</span>
          <span class="value">15</span>
          <span class="sub-label">Active: 20, 2023</span>
        </div>
      </div>
      <div class="card stats-card">
        <div class="icon-wrap bg-yellow-100 text-yellow-600">💰</div>
        <div class="stats-info">
          <span class="label">Revenue</span>
          <span class="value">$78.83K</span>
          <span class="trend positive">+5.56%</span>
        </div>
      </div>
    </div>

    <div class="grid-2 mb-6">
      <!-- Chart Placeholder -->
      <div class="card">
        <div class="card-header">
           <h3>Sales Chart</h3>
           <select class="small-select"><option>Weekly</option></select>
        </div>
        <div class="chart-area">
           <!-- Mock Chart using a simple SVG or just a placeholder div -->
           <div class="mock-chart">
              <svg viewBox="0 0 400 150" class="chart-svg">
                 <path d="M0,120 Q50,100 100,80 T200,50 T300,80 T400,20" fill="none" stroke="#0B1E33" stroke-width="3"/>
                 <path d="M0,120 Q50,100 100,80 T200,50 T300,80 T400,20 V150 H0 Z" fill="url(#grad)" opacity="0.2"/>
                 <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style="stop-color:#0B1E33;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#0B1E33;stop-opacity:0" />
                    </linearGradient>
                 </defs>
              </svg>
           </div>
        </div>
      </div>

      <!-- Recent Orders Example -->
      <div class="card">
         <div class="card-header">
            <h3>Recent Orders</h3>
            <a href="#" class="link">See all</a>
         </div>
         <div class="list-compact">
            <div class="list-item">
               <div class="item-icon">👕</div>
               <div class="item-details">
                  <span class="item-name">Product #1</span>
                  <span class="item-date">Jun 2023</span>
               </div>
               <span class="item-price">$30.00</span>
            </div>
            <div class="list-item">
               <div class="item-icon">👖</div>
               <div class="item-details">
                  <span class="item-name">Product #2</span>
                  <span class="item-date">Nov 2023</span>
               </div>
               <span class="item-price">$25.00</span>
            </div>
            <div class="list-item">
               <div class="item-icon">👗</div>
               <div class="item-details">
                  <span class="item-name">Product #3</span>
                  <span class="item-date">Aug 2023</span>
               </div>
               <span class="item-price">$45.00</span>
            </div>
         </div>
      </div>
    </div>
  `,
    styles: [`
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
    .grid-2 { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
    
    .card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      h3 { font-weight: 600; font-size: 1.1rem; margin: 0; }
    }

    .stats-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      
      .icon-wrap {
        width: 48px; height: 48px;
        border-radius: 12px;
        background-color: #FEF3C7;
        color: #D97706;
        display: flex;
        align-items: center; justify-content: center;
        font-size: 1.5rem;
      }
      
      .stats-info {
         display: flex; 
         flex-direction: column;
         
         .label { color: #64748B; font-size: 0.9rem; }
         .value { font-weight: 700; font-size: 1.5rem; color: #1E293B; }
         .trend { font-size: 0.8rem; font-weight: 600; }
         .trend.positive { color: #10B981; }
      }
    }

    .mock-chart {
       height: 200px;
       width: 100%;
       display: flex;
       align-items: flex-end;
       
       .chart-svg { width: 100%; height: 100%; }
    }

    .list-compact {
       .list-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #F1F5F9;
          
          &:last-child { border-bottom: none; }
          
          .item-icon {
             width: 40px; height: 40px;
             background: #F1F5F9;
             border-radius: 8px;
             display: flex; align-items: center; justify-content: center;
             margin-right: 1rem;
          }
          
          .item-details {
             flex: 1;
             display: flex; flex-direction: column;
             .item-name { font-weight: 500; color: #334155; }
             .item-date { font-size: 0.8rem; color: #94A3B8; }
          }
          
          .item-price { font-weight: 600; color: #1E293B; }
       }
    }
    
    .mb-4 { margin-bottom: 1rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .text-xl { font-size: 1.25rem; }
    .font-bold { font-weight: 700; }
    .link { color: #0B1E33; font-size: 0.9rem; text-decoration: none; &:hover { text-decoration: underline; }}
    .small-select { padding: 0.25rem 0.5rem; border-radius: 4px; border: 1px solid #E2E8F0; }
  `]
})
export class SampleDashboardComponent { }
