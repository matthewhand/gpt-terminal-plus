export interface ListParams {
  directory?: string;
  limit?: number;
  offset?: number;
  orderBy?: 'datetime' | 'filename';
  recursive?: boolean;
  typeFilter?: 'files' | 'folders';
}
