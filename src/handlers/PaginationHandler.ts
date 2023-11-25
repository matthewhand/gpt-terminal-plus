import { ResponsePage, PaginatedResponse } from '../types';
import config from 'config';
import debugLib from 'debug';
import { v4 as uuidv4 } from 'uuid'; // Using 'uuid' for unique ID generation

const debug = debugLib('PaginationHandler');

// Retrieve the maximum response size from configuration or set a default
const maxResponseSize = config.get<number>('maxResponseSize') || 1000;
debug('Max Response Size:', maxResponseSize);

// Define the threshold for cleanup in milliseconds (1 hour)
const cleanupThreshold = 60 * 60 * 1000;

// Initialize the storage for paginated responses
const responseStorage: Record<string, PaginatedResponse> = {};

// Use UUID for generating unique response IDs, which avoids potential collisions
function generateResponseId(): string {
  return uuidv4();
}

// Improved paginate function that handles data by byte size, not character count
const paginate = (data: string, maxResponseSize: number): string[] => {
  const lines = data.split('\n');
  const pages: string[] = [];
  let currentPage = '';
  let currentPageSize = 0;

  lines.forEach((line) => {
    const lineSize = Buffer.byteLength(line + '\n');
    if (currentPageSize + lineSize <= maxResponseSize) {
      currentPage += line + '\n';
      currentPageSize += lineSize;
    } else {
      pages.push(currentPage);
      currentPage = line + '\n';
      currentPageSize = lineSize;
    }
  });

  if (currentPageSize > 0) {
    pages.push(currentPage);
  }

  debug('Paginated pages:', pages.length);
  return pages;
};

// Store paginated responses for stdout and stderr
function storeResponse(stdout: string, stderr: string): string {
  const responseId = generateResponseId();
  debug(`Storing response with ID: ${responseId}`);
  
  const stdoutPages = paginate(stdout, maxResponseSize);
  const stderrPages = paginate(stderr, maxResponseSize);
  
  // Ensure both stdout and stderr have the same number of pages
  const maxPages = Math.max(stdoutPages.length, stderrPages.length);
  while (stdoutPages.length < maxPages) stdoutPages.push('');
  while (stderrPages.length < maxPages) stderrPages.push('');
  
  responseStorage[responseId] = {
    stdout: stdoutPages,
    stderr: stderrPages,
    timestamp: Date.now()
  };

  debug(`Stored stdout pages: ${stdoutPages.length}`);
  debug(`Stored stderr pages: ${stderrPages.length}`);
  
  return responseId;
}

// Retrieve a specific page of paginated response
function getPaginatedResponse(responseId: string, page: number): ResponsePage {
  const response = responseStorage[responseId];
  if (!response) {
    debug(`Response with ID '${responseId}' not found.`);
    throw new Error(`Response with ID '${responseId}' not found.`);
  }

  const totalPages = response.stdout.length; // Both stdout and stderr have the same length

  if (page < 0 || page >= totalPages) {
    debug(`Page number ${page} is out of bounds.`);
    throw new Error(`Page number ${page} is out of bounds.`);
  }

  debug(`Retrieved stdout for page ${page}:`, response.stdout[page]);
  debug(`Retrieved stderr for page ${page}:`, response.stderr[page]);
  
  return {
    stdout: response.stdout[page],
    stderr: response.stderr[page],
    totalPages
  };
}

// Cleanup old responses based on the threshold
function cleanupResponseStorage() {
  const now = Date.now();
  Object.entries(responseStorage).forEach(([id, { timestamp }]) => {
    if (now - timestamp > cleanupThreshold) {
      debug(`Cleaning up response with ID: ${id}`);
      delete responseStorage[id];
    }
  });
}

// Start the cleanup process at a regular interval
function startCleanupProcess() {
  return setInterval(cleanupResponseStorage, cleanupThreshold);
}

// Start the cleanup process and store the interval ID
const cleanupIntervalId = startCleanupProcess();

// Export the functions and variables that may be used externally
export { generateResponseId, storeResponse, getPaginatedResponse, cleanupResponseStorage, cleanupIntervalId, startCleanupProcess };
