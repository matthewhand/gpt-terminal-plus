
export interface FileReadResult {
  filePath: string;
  content: string;
  encoding: string;
  startLine?: number;
  endLine?: number;
  truncated: boolean;
}
