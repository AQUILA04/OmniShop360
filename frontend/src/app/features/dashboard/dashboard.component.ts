import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="dashboard-container">
      <h1>Welcome to Dashboard</h1>
      <p>You are logged in.</p>
    </div>
  `,
    styles: [`
    .dashboard-container {
      padding: 2rem;
      text-align: center;
    }

    @media (max-width: 600px) {
      .dashboard-container {
        padding: 1rem;
      }

      h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class DashboardComponent { }
