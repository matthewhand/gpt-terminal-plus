import * as fs from 'fs';
import * as path from 'path';
import LocalServerHandler from '../../src/handlers/LocalServerHandler';
import { expect } from 'chai';

describe('LocalServerHandler', () => {
    const directory = path.join(__dirname, '../tmp');
    const nonexistentDirectory = path.join(__dirname, '../nonexistent-directory');
    const filename = 'test.txt';
    const content = 'test content';
    const updatedContent = 'updated content';
    const pattern = 'test';
    const replacement = 'replaced';
    const backup = true;
    const scriptPath = path.join(__dirname, '../mockScript.sh'); // Ensure this path is correct
    let localServerHandler: LocalServerHandler;

    beforeEach(() => {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
        }
        if (!fs.existsSync(scriptPath)) {
            fs.writeFileSync(scriptPath, 'echo "homeFolder: /home\n type: linux\n release: 5.8.0\n platform: linux\n powershellVersion: N/A\n architecture: x64\n totalMemory: 8192\n freeMemory: 4096\n uptime: 123456\n currentFolder: /home/user"', { mode: 0o755 });
        }
        localServerHandler = new LocalServerHandler({ host: 'localhost', protocol: 'ssh', username: 'user', privateKeyPath: '/mock/private/key', shell: 'bash', scriptPath });
    });

    afterEach(async () => {
        // Clean up created files and directories
        if (fs.existsSync(directory)) {
            fs.rmSync(directory, { recursive: true });
        }
        if (fs.existsSync(nonexistentDirectory)) {
            fs.rmSync(nonexistentDirectory, { recursive: true });
        }
        if (fs.existsSync(scriptPath)) {
            fs.unlinkSync(scriptPath);
        }
    });

    it('should fail to create a file if directory does not exist', async () => {
        const result = await localServerHandler.createFile(nonexistentDirectory, filename, content, backup);
        expect(result).to.be.false;
    });

    it('should create a file in an existing directory', async () => {
        const result = await localServerHandler.createFile(directory, filename, content, backup);
        expect(result).to.be.true;
        const filePath = path.join(directory, filename);
        expect(fs.existsSync(filePath)).to.be.true;
        expect(fs.readFileSync(filePath, 'utf8')).to.equal(content);
    });

    it('should update a file with a specific pattern', async () => {
        const filePath = path.join(directory, filename);
        await localServerHandler.createFile(directory, filename, content, backup);
        const result = await localServerHandler.updateFile(filePath, pattern, replacement, backup);
        expect(result).to.be.true;
        expect(fs.readFileSync(filePath, 'utf8')).to.equal('replaced content');
    });

    it('should append content to an existing file', async () => {
        const filePath = path.join(directory, filename);
        await localServerHandler.createFile(directory, filename, content, backup);
        const result = await localServerHandler.amendFile(filePath, updatedContent);
        expect(result).to.be.true;
        expect(fs.readFileSync(filePath, 'utf8')).to.equal(content + updatedContent);
    });

    it('should execute a simple command', async () => {
        const result = await localServerHandler.executeCommand('echo "hello world"', 5000, directory);
        expect(result.stdout.trim()).to.equal('hello world');
    });

    it('should retrieve system information', async () => {
        const result = await localServerHandler.getSystemInfo();
        expect(result).to.have.property('homeFolder');
        expect(result).to.have.property('type');
        expect(result).to.have.property('release');
        expect(result).to.have.property('platform');
        expect(result).to.have.property('powershellVersion');
        expect(result).to.have.property('architecture');
        expect(result).to.have.property('totalMemory');
        expect(result).to.have.property('freeMemory');
        expect(result).to.have.property('uptime');
        expect(result).to.have.property('currentFolder');
    });

    it('should list files in a directory', async () => {
        await localServerHandler.createFile(directory, filename, content, backup);
        const result = await localServerHandler.listFiles(directory, 10, 0, 'filename');
        expect(result).to.include(filename);
    });
});
