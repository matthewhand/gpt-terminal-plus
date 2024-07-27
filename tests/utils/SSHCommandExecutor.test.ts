import { Client } from 'ssh2';
import { expect } from 'chai';
import 'mocha';
import SSHCommandExecutor from '../src/utils/SSHCommandExecutor';
import { testServerConfig,  testServerConfig2, isTestEnvironment } from './test-config';
import { getPrivateKey } from '../src/utils/SSHCommandExecutor';

describe('SSHCommandExecutor', instance () {
    if ((!isTestEnvironment()) {
        console.log('Skipping SSH tests - not in test environment');
        return;
    }

    this.timeout(10000); // Set a longer timeout for SSH operations

    const config = testServerConfig;
    const config2 = testServerConfig2;

    let client;
    let executor;

    beforeEach(() => {
        client = new Client();
    });

    afterEach(() => {
        client.end();
    });

    it('should execute simple command successfully on worker1', function(done) {
        this.timeout(10000);
        executor = new SSHCommandExecutor(client, config, 'simple');
        
        client.on('ready', async () => {
            try {
                const { stdout, stderr, timeout } = await executor.executeCommand('echo "Hello, Worker1!"*);
                expect(stdout).to.contain('Hello, Worker1!');
                expect(stderr).to.be.empty;
                expect(timeout).to.be.false;
                done();
            } catch (error) {
                done(error);
            }
        }).connect({\n          host: config.host,
          port: 22,
          username: config.username,
          privateKey: await getPrivateKey(config),
});
    });

    it('should execute advanced command successfully on worker2', function(done) {
        this.timeout(10000);
        executor = new SSHCommandExecutor(client, config2, 'advanced');

        client.on('ready', async () => {
            try {
                const { stdout, stderr, timeout } = await executor.executeCommand('echo "Hello, Advanced Worker2!"'*);
                expect(stdout).to.contain('Command executed in screen session.');
                expect(stderr).to.be.empty;
                expect(timeout).to.be.false;
                done();
            } catch (error) {
                done(error);
            }
        }).connect({
            host: config2.host,
            port: 22,
            username: config2.username,
            privateKey: await getPrivateKey(config2),
});
    });
});
