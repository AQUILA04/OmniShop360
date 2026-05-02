import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-sample-details',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="page-header">
      <h2>Tenant</h2>
    </div>

    <div class="grid-2">
       <!-- Tenant Info -->
       <div class="card p-6">
          <div class="card-header">
             <h3>Tenant Information</h3>
             <button class="btn-outline">View Information</button>
          </div>
          <div class="info-user">
             <div class="name">Johon Smith</div>
             <div class="details-grid">
                <div>
                   <span class="label">Contact</span>
                   <div class="val">+101 455-7895</div>
                </div>
                <div>
                   <span class="label">Email</span>
                   <div class="val">taven&#64;gmail.com</div>
                </div>
                <div>
                   <span class="label">Plan</span>
                   <div class="val">Premium</div>
                </div>
                <div>
                   <span class="label">Plan zone</span>
                   <div class="val">9989</div>
                </div>
             </div>
          </div>
       </div>

       <!-- Recent Activity -->
       <div class="card p-6">
          <div class="card-header">
             <h3>Recent Activity</h3>
          </div>
          <div class="activity-list">
             <div class="activity-item">
                <div class="icon">👤</div>
                <div class="content">
                   <div class="title">Voltanmer</div>
                   <div class="time">1 hr ago</div>
                </div>
                <div class="toggle"><div class="toggle-switch on"></div></div>
             </div>
             <div class="activity-item">
                <div class="icon">🛒</div>
                <div class="content">
                   <div class="title">PronorClasss</div>
                   <div class="time">1 hr ago</div>
                </div>
                <div class="toggle"><div class="toggle-switch on"></div></div>
             </div>
             <div class="activity-item">
                <div class="icon">📅</div>
                <div class="content">
                   <div class="title">Select Service</div>
                   <div class="time">1 hr ago</div>
                </div>
                <div class="toggle"><div class="toggle-switch"></div></div>
             </div>
          </div>
       </div>

       <!-- Recent Activity Log (Bottom Left) -->
       <div class="card p-6">
          <div class="card-header">
             <h3>Recent Activity</h3>
             <span class="dots">...</span>
          </div>
          <div class="timeline">
             <div class="timeline-item">
                <div class="dot used"></div>
                <div class="content">
                   <div class="title">Wait You Tenant</div>
                   <div class="time">3 months ago</div>
                </div>
             </div>
             <div class="timeline-item">
                <div class="dot used"></div>
                <div class="content">
                   <div class="title">Stay Impertiment with Zenen Access</div>
                   <div class="time">3 hours ago</div>
                </div>
             </div>
          </div>
       </div>

       <!-- Settings (Bottom Right) -->
       <div class="card p-6">
          <div class="card-header">
             <h3>Settings</h3>
          </div>
          <div class="settings-list">
             <div class="setting-item">
                <span>Enables Settings</span>
                <div class="toggle-switch on"></div>
             </div>
             <div class="setting-item">
                <span>Earthrater Settings</span>
                <div class="toggle-switch on"></div>
             </div>
             <div class="setting-item">
                <span>Loggles Settings</span>
                <div class="toggle-switch"></div>
             </div>
          </div>
       </div>
    </div>
  `,
    styles: [`
    .page-header { margin-bottom: 1.5rem; h2 { font-size: 1.5rem; font-weight: 700; }}
    .grid-2 { display: grid; grid-template-columns: 3fr 2fr; gap: 1.5rem; }
    
    .card { background: white; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .p-6 { padding: 1.5rem; }
    
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; h3 { font-size: 1.1rem; font-weight: 600; margin: 0; }}
    
    .btn-outline { background: white; border: 1px solid #CBD5E1; padding: 0.5rem 1rem; border-radius: 4px; color: #64748B; font-size: 0.8rem; cursor: pointer; }
    
    .info-user {
       .name { font-size: 1.2rem; font-weight: 700; margin-bottom: 1rem; color: #1E293B; }
       .details-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;
          .label { font-size: 0.8rem; color: #94A3B8; display: block; margin-bottom: 0.2rem; }
          .val { font-weight: 500; }
       }
    }
    
    .activity-list, .settings-list {
       display: flex; flex-direction: column; gap: 1rem;
    }
    
    .activity-item, .setting-item {
       display: flex; align-items: center; justify-content: space-between;
       
       .icon { width: 32px; height: 32px; background: #F1F5F9; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 1rem; }
       .content { flex: 1; .title { font-weight: 500; } .time { font-size: 0.75rem; color: #94A3B8; }}
    }
    
    .toggle-switch {
       width: 40px; height: 20px; background: #E2E8F0; border-radius: 20px; position: relative; cursor: pointer;
       &::after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; background: white; border-radius: 50%; transition: 0.3s; }
       
       &.on { background: #D4AF37; &::after { left: 22px; } }
    }
    
    .timeline {
       .timeline-item {
          display: flex; gap: 1rem; margin-bottom: 1.5rem; position: relative;
          
          .dot { width: 12px; height: 12px; border-radius: 50%; background: #E2E8F0; margin-top: 5px; &.used { background: #94A3B8; } }
          
          .content { .title { font-weight: 500; } .time { font-size: 0.8rem; color: #94A3B8; } }
       }
    }
  `]
})
export class SampleDetailsComponent { }
