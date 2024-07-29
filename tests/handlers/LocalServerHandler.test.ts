import { mkdirSync, existsSync, readdirSync, writeFileSync } from 'fs';
import path from 'path';
import { createFile } from '../../src/handlers/local/functions/createFile';
import { getSelectedServer, getCurrentFolder } from '../../src/utils/GlobalStateHelper';

jest.mock('../../src/utils/GlobalStateHelper', () => ({
    getSelectedServer: jest.fn().mockReturnValue('test-server'),
    getCurrentFolder: jest.fn().mockReturnValue('/test-folder')
}));

describe('LocalServerHandler', () => {
    const baseDir = path.resolve(__dirname);
    const scriptPath = path.join(baseDir, 'mockScripts/systemInfo.sh');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fail to create file in nonexistent directory', () => {
        const directory = path.join(baseDir, 'nonexistent-directory');
        const filename = 'test.txt';
        const content = 'test content';
        const backup = false;
        expect(() => {
            createFile(directory, filename, content, backup);
        }).toThrowError(new Error('Directory does not exist: ' + directory));
    });

    it('should list files correctly', () => {
        const directory = path.join(baseDir, 'tmp');
        if (!existsSync(directory)) {
            mkdirSync(directory, { recursive: true });
        }
        const filename = 'expectedFile.txt';
        const filePath = path.join(directory, filename);
        writeFileSync(filePath, 'test content');
        const files: string[] = readdirSync(directory);
        expect(files).toContain(filename);
    });
});
