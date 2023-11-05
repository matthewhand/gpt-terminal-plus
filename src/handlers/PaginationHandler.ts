// PaginationHandler.ts

interface PaginatedResponse {
  stdout: string[];
  stderr: string[];
}

interface ResponsePage {
  stdout: string;
  stderr: string;
  totalPages: number;
}

// Pagination response storage
const responseStorage: Record<string, PaginatedResponse> = {};

// Counter for generating unique response IDs
let responseCounter = 0;

// Function to generate a unique response ID
function generateResponseId(): string {
  return (responseCounter++).toString();
}

// Function to store paginated response
function storeResponse(responseId: string, stdout: string, stderr: string, maxResponseSize: number): void {
  // Helper function to paginate data
  const paginate = (data: string): string[] => {
    return data.match(new RegExp(`.{1,${maxResponseSize}}`, 'g')) || [];
  };

  responseStorage[responseId] = {
    stdout: paginate(stdout),
    stderr: paginate(stderr)
  };
}

// Function to retrieve a paginated response
function getPaginatedResponse(responseId: string, page: number): ResponsePage {
  const response = responseStorage[responseId];
  if (!response) {
    throw new Error(`Response with ID '${responseId}' not found.`);
  }

  const totalPages = Math.max(response.stdout.length, response.stderr.length);

  // Adjust the error message for 0-based indexing
  if (page < 0 || page >= totalPages) {
    throw new Error(`Page number ${page} is out of bounds. Must be between 0 and ${totalPages - 1}.`);
  }

  // Adjust the retrieval of the page based on 0-based indexing
  return {
    stdout: response.stdout[page],
    stderr: response.stderr[page],
    totalPages
  };
}

export { generateResponseId, storeResponse, getPaginatedResponse };
