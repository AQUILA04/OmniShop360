import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'pos';

@Component({
  selector: 'app-ui-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="getButtonClasses()"
      (click)="onClick.emit($event)"
    >
      <svg
        *ngIf="loading"
        class="animate-spin -ml-1 mr-2 h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-family: var(--font-family-base);
      font-weight: 500;
      border-radius: var(--radius-md);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
      white-space: nowrap;
      text-decoration: none;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Sizes */
    .btn-sm {
      padding: 8px 16px;
      font-size: 14px;
      min-height: 36px;
    }

    .btn-md {
      padding: 12px 24px;
      font-size: 14px;
      min-height: 40px;
    }

    .btn-lg {
      padding: 16px 32px;
      font-size: 16px;
      min-height: 48px;
    }

    .btn-pos {
      padding: 16px 32px;
      font-size: 16px;
      font-weight: 600;
      min-height: 60px;
    }

    /* Variants */
    .btn-primary {
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%);
      color: var(--color-text-on-primary);
      box-shadow: var(--shadow-card);
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-floating);
    }

    .btn-primary:active:not(:disabled) {
      transform: scale(0.98);
    }

    .btn-secondary {
      background-color: transparent;
      color: var(--color-primary);
      border: 1px solid var(--color-primary);
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: var(--color-primary-light);
    }

    .btn-ghost {
      background-color: transparent;
      color: var(--color-text-primary);
    }

    .btn-ghost:hover:not(:disabled) {
      background-color: var(--color-surface-container-low);
    }

    .btn-danger {
      background-color: var(--color-error);
      color: var(--color-text-on-primary);
    }

    .btn-danger:hover:not(:disabled) {
      background-color: #c23333;
    }

    .btn-success {
      background: linear-gradient(135deg, var(--color-success) 0%, #45a87a 100%);
      color: var(--color-text-on-primary);
      box-shadow: 0 4px 12px rgba(81, 188, 143, 0.3);
    }

    .btn-success:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(81, 188, 143, 0.4);
    }

    .btn-success:active:not(:disabled) {
      transform: scale(0.98);
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class UiButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Output() onClick = new EventEmitter<MouseEvent>();

  getButtonClasses(): string {
    const classes = [
      `btn-${this.size}`,
      `btn-${this.variant}`
    ];
    return classes.join(' ');
  }
}
