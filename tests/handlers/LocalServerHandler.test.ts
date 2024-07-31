import { createFile } from '../../src/handlers/local/actions/createFile';
import fs from 'fs';
import path from 'path';

describe('LocalServerHandler', () => {
    const directory = 'tests/handlers/nonexistent-directory';
    const filename = 'test.txt';
    const content = 'test content';
    const backup = false;
    const fullPath = path.join(directory, filename);

    afterEach(() => {
        // Clean up created files
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
        // Clean up created directories
        if (fs.existsSync(directory)) {
            fs.rmdirSync(directory, { recursive: true });
        }
    });

    it('should successfully create a file in an existing directory', () => {
        fs.mkdirSync(directory, { recursive: true });
        createFile(directory, filename, content, backup);
        expect(fs.existsSync(fullPath)).toBe(true);
        const fileContent = fs.readFileSync(fullPath, 'utf-8');
        expect(fileContent).toBe(content);
    });

    it('should throw an error if directory does not exist', () => {
        const nonExistentDirectory = 'tests/handlers/another-nonexistent-directory';
        expect(() => createFile(nonExistentDirectory, filename, content, backup)).toThrowError(
            `Directory does not exist: ${nonExistentDirectory}`
        );
    });
});
