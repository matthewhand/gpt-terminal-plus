import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';

// Mock the server handler to simulate interpreter availability and execution
jest.mock('../src/utils/getServerHandler', () => ({
	getServerHandler: jest.fn(() => ({
		presentWorkingDirectory: async () => process.cwd(),
		executeCommand: async (cmd: string) => {
			if (/^which\s+/.test(cmd) || /command -v/.test(cmd)) {
				return { stdout: '/usr/bin/mock', stderr: '', exitCode: 0, error: false };
			}
			if (/node\s+/.test(cmd)) {
				return { stdout: 'node-ok', stderr: '', exitCode: 0, error: false };
			}
			if (/npx.*ts-node/.test(cmd)) {
				return { stdout: 'tsnode-ok', stderr: '', exitCode: 0, error: false };
			}
			return { stdout: '', stderr: 'unknown cmd', exitCode: 1, error: true };
		}
	}))
}));

describe('execute-code node/typescript', () => {
	let app: express.Express;
	let token: string;

	beforeAll(() => {
		process.env.NODE_ENV = 'test';
		process.env.NODE_CONFIG_DIR = 'config/test';
		token = getOrGenerateApiToken();
		app = express();
		app.use(express.json());
		setupApiRouter(app);
	});

	it('executes node code via temp file', async () => {
		const res = await request(app)
			.post('/command/execute-code')
			.set('Authorization', `Bearer ${token}`)
			.send({ code: 'console.log("hello")', language: 'node' });
		expect(res.status).toBe(200);
		expect(res.body?.interpreter).toBe('node');
		expect(String(res.body?.result?.stdout)).toContain('node-ok');
	});

	it('executes typescript code via ts-node', async () => {
		const res = await request(app)
			.post('/command/execute-code')
			.set('Authorization', `Bearer ${token}`)
			.send({ code: 'console.log("hi-ts")', language: 'typescript' });
		expect(res.status).toBe(200);
		expect(res.body?.interpreter).toBe('ts-node');
		expect(String(res.body?.result?.stdout)).toContain('tsnode-ok');
	});
});
