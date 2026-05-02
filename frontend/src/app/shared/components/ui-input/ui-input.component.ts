import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ui-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiInputComponent),
      multi: true
    }
  ],
  template: `
    <div class="input-wrapper">
      <label *ngIf="label" [for]="inputId" class="input-label">
        {{ label }}
        <span *ngIf="required" class="text-error">*</span>
      </label>
      
      <div class="input-container" [class.has-prefix]="prefixIcon" [class.has-suffix]="suffixIcon || type === 'password'">
        <span *ngIf="prefixIcon" class="input-prefix">
          <ng-content select="[slot=prefix]"></ng-content>
        </span>
        
        <input
          *ngIf="type !== 'textarea'"
          [id]="inputId"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [(ngModel)]="value"
          (ngModelChange)="onValueChange($event)"
          (blur)="onTouched.emit()"
          class="input"
          [class.input-error]="error"
        />
        
        <textarea
          *ngIf="type === 'textarea'"
          [id]="inputId"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [(ngModel)]="value"
          (ngModelChange)="onValueChange($event)"
          (blur)="onTouched.emit()"
          class="input textarea"
          [class.input-error]="error"
          [rows]="rows"
        ></textarea>
        
        <button
          *ngIf="type === 'password'"
          type="button"
          class="input-suffix-btn"
          (click)="togglePasswordVisibility()"
        >
          {{ showPassword ? '👁️' : '👁️‍🗨️' }}
        </button>
        
        <span *ngIf="suffixIcon && type !== 'password'" class="input-suffix">
          <ng-content select="[slot=suffix]"></ng-content>
        </span>
      </div>
      
      <p *ngIf="error" class="input-error-text">{{ error }}</p>
      <p *ngIf="hint && !error" class="input-hint">{{ hint }}</p>
    </div>
  `,
  styles: [`
    .input-wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .input-label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 500;
      color: var(--color-text-secondary);
    }

    .input-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input {
      width: 100%;
      padding: 12px 16px;
      font-family: var(--font-family-base);
      font-size: 16px;
      color: var(--color-text-primary);
      background-color: var(--color-surface-container-low);
      border: 1px solid var(--color-border-ghost);
      border-radius: var(--radius-md);
      transition: all var(--transition-base);
      min-height: 48px;
    }

    .input:focus {
      outline: none;
      background-color: var(--color-surface);
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(47, 126, 218, 0.15);
    }

    .input::placeholder {
      color: var(--color-text-secondary);
    }

    .input:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .input-error {
      border-color: var(--color-error);
    }

    .input-error:focus {
      box-shadow: 0 0 0 3px rgba(217, 62, 62, 0.15);
    }

    .input-error-text {
      margin-top: 4px;
      font-size: 12px;
      color: var(--color-error);
    }

    .input-hint {
      margin-top: 4px;
      font-size: 12px;
      color: var(--color-text-secondary);
    }

    .textarea {
      resize: vertical;
      min-height: 100px;
    }

    .has-prefix .input {
      padding-left: 44px;
    }

    .has-suffix .input {
      padding-right: 44px;
    }

    .input-prefix,
    .input-suffix {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 100%;
      color: var(--color-text-secondary);
      pointer-events: none;
    }

    .input-prefix {
      left: 0;
    }

    .input-suffix {
      right: 0;
    }

    .input-suffix-btn {
      position: absolute;
      right: 0;
      width: 44px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-text-secondary);
      font-size: 16px;
    }

    .input-suffix-btn:hover {
      color: var(--color-primary);
    }

    .text-error {
      color: var(--color-error);
    }
  `]
})
export class UiInputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'search' = 'text';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() error?: string;
  @Input() hint?: string;
  @Input() prefixIcon = false;
  @Input() suffixIcon = false;
  @Input() rows = 4;

  @Output() onTouched = new EventEmitter<void>();

  value = '';
  showPassword = false;
  inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

  private onChange: (value: string) => void = () => {};
  private onTouchedFn: () => void = () => {};

  onValueChange(value: string) {
    this.value = value;
    this.onChange(value);
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
    this.onTouched.subscribe(() => fn());
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.type = this.showPassword ? 'text' : 'password';
  }
}
