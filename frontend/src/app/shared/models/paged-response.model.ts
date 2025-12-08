export interface PagedResponse<T> {
  content: T[];
  page: PageInfo;
}

export interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface PageParams {
  page: number;
  size: number;
  sort?: string;
}
