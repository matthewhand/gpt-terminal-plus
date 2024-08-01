export interface ServerHandlerOptions {
  // Define the options here
}

export interface ListFilesParams {
  directory: string;
  limit?: number;
  offset?: number;
  orderBy?: 'datetime' | 'filename';
}

export interface File {
  name: string;
  size: number;
  modified: Date;
}

export interface PaginatedRequest {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}
