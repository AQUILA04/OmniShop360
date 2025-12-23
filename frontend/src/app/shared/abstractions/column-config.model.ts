import { FieldType } from './field-config.model';

export interface ColumnConfig {
  key: string;
  label: string;
  type?: FieldType;
  sortable?: boolean;
  cssClass?: string;
}
