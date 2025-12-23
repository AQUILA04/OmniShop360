import { ValidatorFn } from '@angular/forms';

export type FormFieldType = 'text' | 'email' | 'number' | 'password' | 'textarea' | 'select' | 'checkbox' | 'date';

export interface FormFieldConfig {
  key: string;              // Nom du contrôle (ex: 'email')
  label: string;            // Label affiché
  type: FormFieldType;      // Type d'input
  placeholder?: string;     // Placeholder
  validators?: ValidatorFn[]; // Validateurs Angular
  options?: { label: string; value: any }[]; // Pour les selects
  hint?: string;            // Texte d'aide
  disabled?: boolean;       // État initial
  cssClass?: string;        // Classe CSS pour la largeur (ex: 'half-width')
}

export interface FormSectionConfig {
  title?: string;
  fields: FormFieldConfig[];
}
