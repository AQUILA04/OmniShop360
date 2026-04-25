import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardVariant = 'default' | 'interactive' | 'glass';

@Component({
  selector: 'app-ui-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getCardClasses()">
      <div *ngIf="title" class="card-header">
        <h3 class="card-title">{{ title }}</h3>
        <ng-content select="[slot=actions]"></ng-content>
      </div>
      <div class="card-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .card {
      background-color: var(--color-surface);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-card);
      transition: all var(--transition-base);
      overflow: hidden;
    }

    .card-interactive:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-floating);
    }

    .card-glass {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--color-border-ghost);
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-6);
      padding-bottom: 0;
    }

    .card-title {
      font-size: var(--font-size-h3);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
      margin: 0;
    }

    .card-content {
      padding: var(--space-6);
    }

    .card-no-padding .card-content {
      padding: 0;
    }
  `]
})
export class UiCardComponent {
  @Input() variant: CardVariant = 'default';
  @Input() title?: string;
  @Input() noPadding = false;

  getCardClasses(): string {
    const classes = ['card'];
    if (this.variant !== 'default') {
      classes.push(`card-${this.variant}`);
    }
    if (this.noPadding) {
      classes.push('card-no-padding');
    }
    return classes.join(' ');
  }
}
