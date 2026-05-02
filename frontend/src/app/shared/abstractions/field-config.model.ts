export type FieldType = 'text' | 'email' | 'date' | 'datetime' | 'status' | 'boolean' | 'currency' | 'number';

export interface FieldConfig {
  key: string;            // La propriété de l'objet (ex: 'companyName' ou 'admin.email')
  label: string;          // Le libellé à afficher (ex: 'Company Name')
  type: FieldType;        // Le type de donnée pour le formatage
  format?: string;        // Format optionnel (ex: 'dd/MM/yyyy' pour les dates)
  cssClass?: string;      // Classe CSS spécifique
  mapValue?: (value: any) => string; // Fonction optionnelle pour transformer la valeur
}

export interface SectionConfig {
  title?: string;
  fields: FieldConfig[];
}
