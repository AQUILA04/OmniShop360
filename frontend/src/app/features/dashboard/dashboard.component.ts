import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div style="padding: 2rem; text-align: center;">
      <h1>Welcome to Dashboard</h1>
      <p>You are logged in.</p>
    </div>
  `
})
export class DashboardComponent { }
