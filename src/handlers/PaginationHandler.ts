import { ResponsePage, PaginatedResponse } from '../types';
import config from 'config';

const maxResponseSize = config.get<number>('maxResponseSize') || 1000;

// Define threshold for cleanup in the outer scope
const cleanupThreshold = 60 * 60 * 1000; // 1 hour in milliseconds

// Pagination response storage
const responseStorage: Record<string, PaginatedResponse> = {};

// Counter for generating unique response IDs
let responseCounter = 0;

// Function to generate a unique response ID
function generateResponseId(): string {
  return (responseCounter++).toString(); // Simple incremental ID
}

// Helper function to paginate data by lines within the maxResponseSize limit
const paginate = (data: string, maxResponseSize: number): string[] => {
  const lines = data.split('\n');
  const pages: string[] = [];
  let currentPage = '';

  lines.forEach((line) => {
    // Check if adding the next line exceeds the max size
    if ((currentPage.length + line.length + 1) <= maxResponseSize) {
      currentPage += line + '\n';
    } else {
      pages.push(currentPage);
      currentPage = line + '\n'; // Start a new page with the current line
    }
  });

  // Add the last page if there's remaining content
  if (currentPage) {
    pages.push(currentPage);
  }

  return pages;
};

// Function to store paginated response
function storeResponse(stdout: string, stderr: string): string {
  const responseId = generateResponseId();
  responseStorage[responseId] = {
    stdout: paginate(stdout, maxResponseSize),
    stderr: paginate(stderr, maxResponseSize),
    timestamp: Date.now()
  };
  return responseId;
}

// Function to retrieve a paginated response
function getPaginatedResponse(responseId: string, page: number): ResponsePage {
  const response = responseStorage[responseId];
  if (!response) {
    throw new Error(`Response with ID '${responseId}' not found.`);
  }

  const totalPages = Math.max(response.stdout.length, response.stderr.length);
  if (page < 0 || page >= totalPages) {
    throw new Error(`Page number ${page} is out of bounds. Must be between 0 and ${totalPages - 1}.`);
  }

  return {
    stdout: response.stdout[page] || '',
    stderr: response.stderr[page] || '',
    totalPages
  };
}

// Cleanup function for responseStorage
function cleanupResponseStorage() {
  const now = Date.now();
  Object.entries(responseStorage).forEach(([id, { timestamp }]) => {
    if (now - timestamp > cleanupThreshold) {
      delete responseStorage[id];
    }
  });
}

// Periodic cleanup of responseStorage
setInterval(cleanupResponseStorage, cleanupThreshold); // Cleanup every hour

export { generateResponseId, storeResponse, getPaginatedResponse, cleanupResponseStorage };
