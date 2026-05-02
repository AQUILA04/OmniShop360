import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type KpiColor = 'success' | 'primary' | 'warning' | 'error';

@Component({
  selector: 'app-ui-kpi-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="kpi-card" [class]="'kpi-card-' + color">
      <div class="kpi-header">
        <span class="kpi-label">{{ label }}</span>
        <span *ngIf="trend" class="kpi-trend" [class.positive]="trendValue > 0" [class.negative]="trendValue < 0">
          <span class="trend-icon">{{ trendValue > 0 ? '↑' : trendValue < 0 ? '↓' : '→' }}</span>
          {{ trend }}
        </span>
      </div>
      <div class="kpi-value">{{ value }}</div>
      <div *ngIf="subtitle" class="kpi-subtitle">{{ subtitle }}</div>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .kpi-card {
      position: relative;
      background-color: var(--color-surface);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-card);
      padding: var(--space-6);
      padding-left: var(--space-8);
      transition: all var(--transition-base);
    }

    .kpi-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-floating);
    }

    .kpi-card::before {
      content: '';
      position: absolute;
      left: 0;
      top: var(--space-4);
      bottom: var(--space-4);
      width: 4px;
      border-radius: var(--radius-full);
    }

    .kpi-card-success::before {
      background-color: var(--color-success);
    }

    .kpi-card-primary::before {
      background-color: var(--color-primary);
    }

    .kpi-card-warning::before {
      background-color: var(--color-warning);
    }

    .kpi-card-error::before {
      background-color: var(--color-error);
    }

    .kpi-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-2);
    }

    .kpi-label {
      font-size: 14px;
      font-weight: 500;
      color: var(--color-text-secondary);
    }

    .kpi-trend {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 500;
      color: var(--color-text-secondary);
      background-color: var(--color-surface-container-low);
      padding: 2px 8px;
      border-radius: var(--radius-full);
    }

    .kpi-trend.positive {
      color: var(--color-success);
      background-color: var(--color-success-light);
    }

    .kpi-trend.negative {
      color: var(--color-error);
      background-color: var(--color-error-light);
    }

    .trend-icon {
      font-size: 10px;
    }

    .kpi-value {
      font-size: 32px;
      font-weight: 700;
      color: var(--color-text-primary);
      letter-spacing: -0.02em;
      line-height: 1.2;
    }

    .kpi-subtitle {
      font-size: 12px;
      color: var(--color-text-secondary);
      margin-top: var(--space-1);
    }

    @media (max-width: 640px) {
      .kpi-card {
        padding: var(--space-4);
        padding-left: var(--space-6);
      }

      .kpi-value {
        font-size: 24px;
      }
    }
  `]
})
export class UiKpiCardComponent {
  @Input() label!: string;
  @Input() value!: string | number;
  @Input() subtitle?: string;
  @Input() trend?: string;
  @Input() trendValue = 0;
  @Input() color: KpiColor = 'primary';
}
