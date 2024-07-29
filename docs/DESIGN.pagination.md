# Pagination Design Document

## Overview

The purpose of this document is to outline the design and implementation of the pagination logic used in the project. The goal is to provide a clear understanding of how pagination is managed and to serve as a reference for future enhancements.

## Current Design

### `PaginatedResponse`

The `PaginatedResponse` type is used to represent paginated data. It contains the following properties:

- `items: T[]` - The array of items for the current page.
- `totalPages: number` - The total number of pages.
- `responseId: string` - A unique identifier for the response.
- `stdout: string` - The raw standard output as a single string.
- `stderr: string` - The raw standard error as a single string.

### Storing Raw Strings

The current design stores raw strings (`stdout` and `stderr`) instead of an array of strings. This approach allows us to dynamically paginate the data as needed, providing more flexibility and reducing the need for pre-computation.

### Example

Here is an example of how the pagination logic works:

```typescript
import { PaginatedResponse } from "../types/PaginatedResponse";

const responseStorage: { [key: string]: PaginatedResponse<unknown> } = {};
const maxResponseSize = 1000;

export function storeResponse<T>(stdout: string, stderr: string): PaginatedResponse<T> {
    const responseId = Math.random().toString(36).substring(7);
    responseStorage[responseId] = {
        items: [] as T[],
        totalPages: 1,
        responseId: responseId,
        stdout: stdout,
        stderr: stderr
    };
    return responseStorage[responseId] as PaginatedResponse<T>;
}

export function getPaginatedResponse<T>(responseId: string, page: number): PaginatedResponse<T> {
    const response = responseStorage[responseId];
    return {
        items: response.stdout.split("
").slice(page * maxResponseSize, (page + 1) * maxResponseSize).map(line => line as unknown as T),
        totalPages: Math.ceil(response.stdout.split("
").length / maxResponseSize),
        responseId: response.responseId,
        stdout: response.stdout,
        stderr: response.stderr
    } as PaginatedResponse<T>;
}
```

## Pagination Logic

The pagination logic dynamically splits the raw `stdout` string into pages based on the specified `maxResponseSize`. This allows us to generate paginated data on-the-fly without storing pre-computed arrays.

## Considerations for Future Enhancements

- **Dynamic Page Size**: Allow the page size (`maxResponseSize`) to be configurable.
- **Caching**: Implement caching mechanisms to optimize repeated requests for the same page.
- **Error Handling**: Improve error handling and validation for pagination requests.

## Known Issues

- **Memory Usage**: Storing large raw strings may lead to high memory usage. Consider implementing memory optimization techniques.
- **Performance**: Dynamic pagination may introduce performance overhead. Explore ways to optimize the pagination logic.
