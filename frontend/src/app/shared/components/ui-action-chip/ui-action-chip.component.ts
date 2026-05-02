import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ChipVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';
export type ChipSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-ui-action-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      [class]="getChipClasses()"
      [disabled]="disabled"
      (click)="onChipClick.emit()"
    >
      <span *ngIf="icon" class="chip-icon">{{ icon }}</span>
      <ng-content></ng-content>
      <span *ngIf="removable" class="chip-remove" (click)="onRemove($event)">×</span>
    </button>
  `,
  styles: [`
    button {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: var(--font-family-base);
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
      white-space: nowrap;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Sizes */
    .chip-sm {
      padding: 4px 12px;
      font-size: 12px;
      border-radius: var(--radius-full);
    }

    .chip-md {
      padding: 6px 16px;
      font-size: 14px;
      border-radius: var(--radius-full);
    }

    .chip-lg {
      padding: 10px 20px;
      font-size: 16px;
      border-radius: 1rem;
    }

    /* Variants */
    .chip-default {
      background-color: var(--color-surface);
      color: var(--color-text-primary);
      border: 1px solid var(--color-border);
    }

    .chip-default:hover:not(:disabled) {
      background-color: var(--color-surface-container-low);
    }

    .chip-primary {
      background-color: var(--color-primary);
      color: var(--color-text-on-primary);
    }

    .chip-primary:hover:not(:disabled) {
      background-color: var(--color-primary-hover);
    }

    .chip-primary-fixed {
      background-color: #D5E3FF;
      color: var(--color-primary);
    }

    .chip-primary-fixed:hover:not(:disabled) {
      background-color: var(--color-primary-light);
    }

    .chip-success {
      background-color: var(--color-success-light);
      color: var(--color-success);
    }

    .chip-success:hover:not(:disabled) {
      background-color: #d4f0e5;
    }

    .chip-warning {
      background-color: var(--color-warning-light);
      color: var(--color-warning);
    }

    .chip-warning:hover:not(:disabled) {
      background-color: #fff4cc;
    }

    .chip-error {
      background-color: var(--color-error-light);
      color: var(--color-error);
    }

    .chip-error:hover:not(:disabled) {
      background-color: #fce8e8;
    }

    .chip-icon {
      font-size: 1em;
    }

    .chip-remove {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      font-size: 16px;
      font-weight: bold;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: background-color var(--transition-fast);
    }

    .chip-remove:hover {
      background-color: rgba(0, 0, 0, 0.2);
    }
  `]
})
export class UiActionChipComponent {
  @Input() variant: ChipVariant = 'default';
  @Input() size: ChipSize = 'md';
  @Input() disabled = false;
  @Input() removable = false;
  @Input() icon?: string;

  @Output() onChipClick = new EventEmitter<void>();
  @Output() onRemoveChip = new EventEmitter<void>();

  getChipClasses(): string {
    const classes = [`chip-${this.size}`];
    
    if (this.variant === 'default') {
      classes.push('chip-default');
    } else if (this.variant === 'primary') {
      classes.push('chip-primary');
    } else {
      classes.push(`chip-${this.variant}`);
    }
    
    return classes.join(' ');
  }

  onRemove(event: MouseEvent) {
    event.stopPropagation();
    this.onRemoveChip.emit();
  }
}
