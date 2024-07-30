import { createFile } from '../../src/handlers/local/functions/createFile';
import * as path from 'path';

describe('LocalServerHandler', () => {
    it('should fail to create file in nonexistent directory', () => {
        const directory = path.join(__dirname, 'nonexistent-directory');
        const filename = 'test.txt';
        const content = 'Hello, World!';
        const backup = false;

        expect(() => {
            createFile(directory, filename, content, backup);
        }).toThrowError(new Error('Directory does not exist: ' + directory));
    });

    it('should list files correctly', () => {
        // Further test cases...
    });
});
