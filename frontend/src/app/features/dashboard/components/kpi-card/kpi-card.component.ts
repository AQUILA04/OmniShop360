// kpi-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type KpiColor = 'primary' | 'success' | 'warning' | 'error';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="kpi-card" [class]="'kpi-card-' + color">
      <div class="kpi-header">
        <div class="kpi-icon-wrapper">
          <ng-content select="[slot=icon]"></ng-content>
        </div>
        <div *ngIf="trend" class="kpi-trend" [class.positive]="trendValue > 0" [class.negative]="trendValue < 0" [class.neutral]="trendValue === 0">
          {{ trend }}
        </div>
      </div>
      <div class="kpi-content">
        <span class="kpi-label">{{ title }}</span>
        <span class="kpi-value" [class.alert-text]="color === 'error'">{{ formattedValue }}</span>
        <span *ngIf="subtitle" class="kpi-subtitle" [class.alert-sub]="color === 'error'">{{ subtitle }}</span>
      </div>
    </div>
  `,
  styles: [`
    .kpi-card {
      display: flex;
      flex-direction: column;
      padding: 24px;
      background-color: #ffffff;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
      border: 1px solid rgba(0, 0, 0, 0.02);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      height: 100%;
    }

    .kpi-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
    }

    .kpi-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .kpi-icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 12px;
    }

    :host-context(.kpi-card-primary) .kpi-icon-wrapper { background-color: #EBF4FF; color: #005cad; }
    :host-context(.kpi-card-success) .kpi-icon-wrapper { background-color: #F0FDF4; color: #16A34A; }
    :host-context(.kpi-card-warning) .kpi-icon-wrapper { background-color: #FFF7ED; color: #EA580C; }
    :host-context(.kpi-card-error) .kpi-icon-wrapper { background-color: #FEF2F2; color: #DC2626; }

    .kpi-icon-wrapper ::ng-deep svg {
      width: 24px;
      height: 24px;
      stroke-width: 2.5;
    }

    .kpi-trend {
      font-size: 12px;
      font-weight: 700;
      padding: 6px 12px;
      border-radius: 100px;
    }

    .kpi-trend.positive { color: #16A34A; background-color: #DCFCE7; }
    .kpi-trend.negative { color: #DC2626; background-color: #FEE2E2; }
    .kpi-trend.neutral { color: #64748B; background-color: #F1F5F9; }

    .kpi-content {
      display: flex;
      flex-direction: column;
    }

    .kpi-label {
      font-size: 12px;
      font-weight: 700;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }

    .kpi-value {
      font-size: 32px;
      font-weight: 800;
      color: #0F172A;
      letter-spacing: -0.03em;
      line-height: 1;
      margin-bottom: 8px;
    }

    .kpi-value.alert-text { color: #DC2626; }

    .kpi-subtitle {
      font-size: 13px;
      color: #94A3B8;
      font-weight: 500;
    }

    .kpi-subtitle.alert-sub { color: #EF4444; }

    @media (max-width: 640px) {
      .kpi-card { padding: 20px; }
      .kpi-value { font-size: 28px; }
      .kpi-icon-wrapper { width: 40px; height: 40px; }
    }
  `]
})
export class KpiCardComponent {
  @Input() title = '';
  @Input() value: number | string = 0;
  @Input() icon?: string;
  @Input() color: KpiColor = 'primary';
  @Input() subtitle?: string;
  @Input() trend?: string;
  @Input() trendValue = 0;
  @Input() isCurrency = false;
  @Input() currency = 'EUR';

  get formattedValue(): string {
    if (typeof this.value === 'string') return this.value;
    if (this.isCurrency) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: this.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(this.value);
    }
    return new Intl.NumberFormat('fr-FR').format(this.value);
  }
}
