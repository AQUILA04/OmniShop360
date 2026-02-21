import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-kpi-card',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule],
    template: `
    <mat-card class="kpi-card" [style.--accent-color]="color">
      <div class="kpi-card__icon-wrapper">
        <mat-icon>{{ icon }}</mat-icon>
      </div>
      <div class="kpi-card__content">
        <span class="kpi-card__label">{{ title }}</span>
        <span class="kpi-card__value">{{ formattedValue }}</span>
        <span *ngIf="subtitle" class="kpi-card__subtitle">{{ subtitle }}</span>
      </div>
    </mat-card>
  `,
    styles: [`
    .kpi-card {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.5rem;
      border-radius: 16px;
      background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
      border: 1px solid rgba(0, 0, 0, 0.06);
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .kpi-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
    }

    .kpi-card__icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: 14px;
      background: var(--accent-color, #6366f1);
      color: white;
      flex-shrink: 0;
    }

    .kpi-card__icon-wrapper mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .kpi-card__content {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      min-width: 0;
    }

    .kpi-card__label {
      font-size: 0.8rem;
      font-weight: 500;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .kpi-card__value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e293b;
      line-height: 1.2;
    }

    .kpi-card__subtitle {
      font-size: 0.8rem;
      color: #94a3b8;
    }
  `]
})
export class KpiCardComponent {
    @Input() title = '';
    @Input() value: number | string = 0;
    @Input() icon = 'trending_up';
    @Input() color = '#6366f1';
    @Input() subtitle?: string;
    @Input() isCurrency = false;

    get formattedValue(): string {
        if (typeof this.value === 'string') return this.value;
        if (this.isCurrency) {
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(this.value);
        }
        return new Intl.NumberFormat('fr-FR').format(this.value);
    }
}
