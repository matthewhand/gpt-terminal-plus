import { expect } from 'chai';
import SSHCommandExecutor, { getPrivateKey } from '../../src/utils/SSHCommandExecutor';
import { config } from '../../src/config';
import { Client } from 'ssh2';

describe('SSHCommandExecutor', function () {
    if (!isTestEnvironment()) {
        console.log('Skipping SSH tests - not in test environment');
        return;
    }

    this.timeout(10000); // Set a longer timeout for SSH operations

    let client: Client;
    let executor: SSHCommandExecutor;

    beforeEach(() => {
        client = new Client();
    });

    afterEach(() => {
        client.end();
    });

    it('should execute simple command successfully on worker1', function (done) {
        this.timeout(10000);
        executor = new SSHCommandExecutor(client, config, 'simple');

        client.on('ready', async () => {
            const { stdout, stderr, timeout } = await executor.executeCommand('echo "Hello, Worker1!"');
            expect(stdout).to.contain('Hello, Worker1!');
            done();
        }).connect({
            host: config.host,
            port: config.port,
            username: config.username,
            privateKey: getPrivateKey(config.privateKeyPath),
        });
    });

    it('should execute advanced command successfully on worker2', function (done) {
        this.timeout(10000);
        executor = new SSHCommandExecutor(client, config, 'advanced');

        client.on('ready', async () => {
            const { stdout, stderr, timeout } = await executor.executeCommand('echo "Hello, Advanced Worker2!"');
            expect(stdout).to.contain('Hello, Advanced Worker2!');
            done();
        }).connect({
            host: config.host,
            port: config.port,
            username: config.username,
            privateKey: getPrivateKey(config.privateKeyPath),
        });
    });
});
