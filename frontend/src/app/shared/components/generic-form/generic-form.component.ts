import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FormSectionConfig } from '../../abstractions/form-config.model';

@Component({
  selector: 'app-generic-form',
  templateUrl: './generic-form.component.html',
  styleUrls: ['./generic-form.component.scss']
})
export class GenericFormComponent implements OnInit, OnChanges {
  @Input() config: FormSectionConfig[] = [];
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() submitLabel: string = 'Save';
  @Input() cancelLabel: string = 'Cancel';
  @Input() isLoading: boolean = false;
  @Input() formGroup?: FormGroup;

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
}
