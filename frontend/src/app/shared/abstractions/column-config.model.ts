export type ColumnType = 'text' | 'number' | 'date' | 'datetime' | 'boolean' | 'status' | 'currency' | 'actions';

export interface ColumnConfig {
  key: string;
  label: string;
  type?: ColumnType;
  sortable?: boolean;
  cssClass?: string | ((item: any) => string); // CSS class can be static string or dynamic function
  mapValue?: (value: any, item?: any) => string; // Function to transform the displayed value
}
