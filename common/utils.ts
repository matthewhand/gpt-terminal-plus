/**
 * Common utility functions for "gpt-terminal-plus"
 */

import Debug from 'debug';
import fs from 'fs';
import { PaginatedResponse } from '../types/PaginatedResponse';

const debug = Debug('app:common:utils');

/**
 * Escapes special characters in a string for use in a regular expression.
 * @param {string} string - The string to escape.
 * @returns {string} The escaped string.
 */
export function escapeRegExp(string: string): string {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Paginates an array of items.
 * @param {T[]} items - The items to paginate.
 * @param {number} limit - Number of items per page.
 * @param {number} offset - Number of items to skip.
 * @returns {PaginatedResponse<T>} The paginated response.
 */
export function paginate<T>(items: T[], limit: number, offset: number): PaginatedResponse<T> {
    const paginatedItems = items.slice(offset, offset + limit);
    return {
        items: paginatedItems,
        limit,
        offset,
        total: items.length
    };
}

/**
 * Safely reads a JSON file.
 * @param {string} filePath - Path to the JSON file.
 * @returns {any} Parsed JSON content.
 * @throws Will throw an error if the file cannot be read or parsed.
 */
export function readJsonFile(filePath: string): any {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        debug(`Failed to read or parse JSON file at ${filePath}: ${(error as Error).message}`);
        throw error;
    }
}

// Add more shared utility functions here as needed
