import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FormSectionConfig, FormFieldConfig } from '../../abstractions/form-config.model';
import { NgSelectModule } from '@ng-select/ng-select';

// Ajoutez NgSelectModule dans vos imports
export { FormFieldConfig };

@Component({
  selector: 'app-generic-form',
  templateUrl: './generic-form.component.html',
  styleUrls: ['./generic-form.component.scss']
})
export class GenericFormComponent implements OnInit, OnChanges {
  @Input() config: FormSectionConfig[] = [];
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() submitLabel: string = 'Enregistrer';
  @Input() cancelLabel: string = 'Annuler';
  @Input() isLoading: boolean = false;
  @Input() formGroup?: FormGroup;

  // New Design Inputs
  @Input() mode: 'card' | 'page' = 'card'; // 'page' centers content and moves title outside
  @Input() showBackButton: boolean = false;
  @Input() showFooter: boolean = true;
  @Input() actionsAlignment: 'end' | 'space-between' = 'space-between';

  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  form!: FormGroup;
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && !changes['config'].firstChange) {
      this.initForm();
    }
  }

  private initForm(): void {
    if (this.formGroup) {
      this.form = this.formGroup;
      // On ajoute les contrôles manquants au formGroup existant
      this.addControlsToForm(this.form);
    } else {
      this.form = this.fb.group({});
      this.addControlsToForm(this.form);
    }
  }

  private addControlsToForm(form: FormGroup): void {
    this.config.forEach(section => {
      section.fields.forEach(field => {
        if (!form.contains(field.key)) {
          const control = new FormControl(
            { value: '', disabled: field.disabled || false },
            field.validators || []
          );
          form.addControl(field.key, control);
        }
      });
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.getRawValue());
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'This field is required';
    if (control.errors['email']) return 'Invalid email format';
    if (control.errors['minlength']) {
      return `Minimum ${control.errors['minlength'].requiredLength} characters`;
    }
    if (control.errors['maxlength']) {
      return `Maximum ${control.errors['maxlength'].requiredLength} characters`;
    }

    return 'Invalid field';
  }

  isRequired(controlName: string): boolean {
    const control = this.form.get(controlName);
    if (!control) return false;

    if (control.validator) {
      const validator = control.validator({} as FormControl);
      if (validator && validator['required']) {
        return true;
      }
    }
    return false;
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
