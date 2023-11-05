import { ResponsePage, PaginatedResponse } from '../types';
import config from 'config';

const maxResponseSize = config.get<number>('maxResponseSize') || 1000;

// Pagination response storage
const responseStorage: Record<string, PaginatedResponse> = {};

// Counter for generating unique response IDs
let responseCounter = 0;

// Function to generate a unique response ID
function generateResponseId(): string {
  // Simple incremental ID without padding
  return (responseCounter++).toString();
}

// Helper function to paginate data
const paginate = (data: string, maxResponseSize: number): string[] => {
  return data.match(new RegExp(`.{1,${maxResponseSize}}`, 'g')) || [];
};

// Function to store paginated response
function storeResponse(stdout: string, stderr: string, maxResponseSize: number): string {
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

  // If there's only one page, we still return it in the same object format
  if (totalPages <= 1) {
    return {
      stdout: response.stdout[0] || '',
      stderr: response.stderr[0] || '',
      totalPages: 1 // Indicate that there is only one page
    };
  }

  // For multiple pages, ensure the page number is within bounds
  if (page < 0 || page >= totalPages) {
    throw new Error(`Page number ${page} is out of bounds. Must be between 0 and ${totalPages - 1}.`);
  }

  // Return the requested page along with total pages
  return {
    stdout: response.stdout[page] || '',
    stderr: response.stderr[page] || '',
    totalPages
  };
}

// Cleanup function for responseStorage
function cleanupResponseStorage() {
  const threshold = 60 * 60 * 1000; // e.g., 1 hour
  const now = Date.now();
  Object.keys(responseStorage).forEach((id) => {
    if (now - responseStorage[id].timestamp > threshold) {
      delete responseStorage[id];
    }
  });
}

// You would call cleanupResponseStorage periodically, for example, using setInterval in a Node.js environment
// setInterval(cleanupResponseStorage, 60 * 60 * 1000); // every hour

export { generateResponseId, storeResponse, getPaginatedResponse, cleanupResponseStorage };
