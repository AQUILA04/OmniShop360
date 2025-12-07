export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  errors?: FieldError[];
  path: string;
}

export interface FieldError {
  field: string;
  message: string;
}
