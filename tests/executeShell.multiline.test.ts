import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';

describe('execute-shell multiline commands', () => {
	let app: express.Express;
	let token: string;
	let originalEnv: string | undefined;
	let originalConfigDir: string | undefined;

	beforeAll(() => {
		originalEnv = process.env.NODE_ENV;
		originalConfigDir = process.env.NODE_CONFIG_DIR;
		
		process.env.NODE_ENV = 'test';
		process.env.NODE_CONFIG_DIR = 'config/test';
		token = getOrGenerateApiToken();
	});

	afterAll(() => {
		// Restore original environment
		if (originalEnv !== undefined) {
			process.env.NODE_ENV = originalEnv;
		} else {
			delete process.env.NODE_ENV;
		}
		
		if (originalConfigDir !== undefined) {
			process.env.NODE_CONFIG_DIR = originalConfigDir;
		} else {
			delete process.env.NODE_CONFIG_DIR;
		}
	});

	beforeEach(() => {
		app = express();
		app.use(express.json());
		setupApiRouter(app);
	});

	describe('basic multiline execution', () => {
		it('should execute simple multiline bash script successfully', async () => {
			const script = 'echo hi\necho bye';
			const res = await request(app)
				.post('/command/execute-shell')
				.set('Authorization', `Bearer ${token}`)
				.send({ shell: 'bash', command: script });
				
			expect(res.status).toBe(200);
			
			const result = res.body?.result || {};
			expect(String(result.stdout)).toContain('hi');
			expect(String(result.stdout)).toContain('bye');
			expect(String(result.stderr || '')).toBe('');
			expect(Number(result.exitCode)).toBe(0);
			expect(result.success).toBe(true);
		});

		it('should handle multiline commands with different separators', async () => {
			const testCases = [
				{ script: 'echo line1\necho line2', separator: '\\n' },
				{ script: 'echo line1; echo line2', separator: ';' },
				{ script: 'echo line1 && echo line2', separator: '&&' }
			];

			for (const { script, separator } of testCases) {
				const res = await request(app)
					.post('/command/execute-shell')
					.set('Authorization', `Bearer ${token}`)
					.send({ shell: 'bash', command: script });
					
				expect(res.status).toBe(200);
				expect(String(res.body.result.stdout)).toContain('line1');
				expect(String(res.body.result.stdout)).toContain('line2');
				expect(res.body.result.exitCode).toBe(0);
			}
		});

		it('should preserve command order in multiline execution', async () => {
			const script = 'echo first\necho second\necho third';
			const res = await request(app)
				.post('/command/execute-shell')
				.set('Authorization', `Bearer ${token}`)
				.send({ shell: 'bash', command: script });
				
			expect(res.status).toBe(200);
			
			const stdout = String(res.body.result.stdout);
			const firstIndex = stdout.indexOf('first');
			const secondIndex = stdout.indexOf('second');
			const thirdIndex = stdout.indexOf('third');
			
			expect(firstIndex).toBeGreaterThan(-1);
			expect(secondIndex).toBeGreaterThan(firstIndex);
			expect(thirdIndex).toBeGreaterThan(secondIndex);
		});
	});

	describe('complex multiline scenarios', () => {
		it('should handle multiline scripts with variables', async () => {
			const script = `VAR1="hello"
VAR2="world"
echo "$VAR1 $VAR2"`;
			
			const res = await request(app)
				.post('/command/execute-shell')
				.set('Authorization', `Bearer ${token}`)
				.send({ shell: 'bash', command: script });
				
			expect(res.status).toBe(200);
			expect(String(res.body.result.stdout)).toContain('hello world');
			expect(res.body.result.exitCode).toBe(0);
		});

		it('should handle multiline scripts with conditionals', async () => {
			const script = `if [ "test" = "test" ]; then
  echo "condition true"
else
  echo "condition false"
fi`;
			
			const res = await request(app)
				.post('/command/execute-shell')
				.set('Authorization', `Bearer ${token}`)
				.send({ shell: 'bash', command: script });
				
			expect(res.status).toBe(200);
			expect(String(res.body.result.stdout)).toContain('condition true');
			expect(res.body.result.exitCode).toBe(0);
		});

		it('should handle multiline scripts with loops', async () => {
			const script = `for i in 1 2 3; do
  echo "number $i"
done`;
			
			const res = await request(app)
				.post('/command/execute-shell')
				.set('Authorization', `Bearer ${token}`)
				.send({ shell: 'bash', command: script });
				
			expect(res.status).toBe(200);
			
			const stdout = String(res.body.result.stdout);
			expect(stdout).toContain('number 1');
			expect(stdout).toContain('number 2');
			expect(stdout).toContain('number 3');
			expect(res.body.result.exitCode).toBe(0);
		});

		it('should handle multiline scripts with functions', async () => {
			const script = `greet() {
  echo "Hello, $1!"
}
greet "World"
greet "Test"`;
			
			const res = await request(app)
				.post('/command/execute-shell')
				.set('Authorization', `Bearer ${token}`)
				.send({ shell: 'bash', command: script });
				
			expect(res.status).toBe(200);
			
			const stdout = String(res.body.result.stdout);
			expect(stdout).toContain('Hello, World!');
			expect(stdout).toContain('Hello, Test!');
			expect(res.body.result.exitCode).toBe(0);
		});
	});

	describe('error handling in multiline scripts', () => {
		it('should handle errors in multiline scripts', async () => {
			const script = `echo "before error"
false
echo "after error"`;
			
			const res = await request(app)
				.post('/command/execute-shell')
				.set('Authorization', `Bearer ${token}`)
				.send({ shell: 'bash', command: script });
				
			expect(res.status).toBe(200);
			expect(String(res.body.result.stdout)).toContain('before error');
			expect(String(res.body.result.stdout)).toContain('after error');
			expect(res.body.result.exitCode).toBe(1); // Last command failed
		});

		it('should handle scripts with set -e (exit on error)', async () => {
			const script = `set -e
echo "before error"
false
echo "this should not execute"`;
			
			const res = await request(app)
				.post('/command/execute-shell')
				.set('Authorization', `Bearer ${token}`)
				.send({ shell: 'bash', command: script });
				
			expect(res.status).toBe(200);
			expect(String(res.body.result.stdout)).toContain('before error');
			expect(String(res.body.result.stdout)).not.toContain('this should not execute');
			expect(res.body.result.exitCode).not.toBe(0);
		});

		it('should capture stderr from multiline scripts', async () => {
			const script = `echo "stdout line 1"
echo "stderr line 1" >&2
echo "stdout line 2"
echo "stderr line 2" >&2`;
			
			const res = await request(app)
				.post('/command/execute-shell')
				.set('Authorization', `Bearer ${token}`)
				.send({ shell: 'bash', command: script });
				
			expect(res.status).toBe(200);
			
			const stdout = String(res.body.result.stdout);
			const stderr = String(res.body.result.stderr);
			
			expect(stdout).toContain('stdout line 1');
			expect(stdout).toContain('stdout line 2');
			expect(stderr).toContain('stderr line 1');
			expect(stderr).toContain('stderr line 2');
		});
	});

	describe('different shell types', () => {
		it('should handle multiline commands in sh shell', async () => {
			const script = 'echo first\necho second';
			const res = await request(app)
				.post('/command/execute-shell')
				.set('Authorization', `Bearer ${token}`)
				.send({ shell: 'sh', command: script });
				
			expect(res.status).toBe(200);
			expect(String(res.body.result.stdout)).toContain('first');
			expect(String(res.body.result.stdout)).toContain('second');
		});

		it('should handle shell-specific syntax differences', async () => {
			// Test bash-specific features
			const bashScript = `arr=(one two three)
echo ${arr[1]}`;
			
			const res = await request(app)
				.post('/command/execute-shell')
				.set('Authorization', `Bearer ${token}`)
				.send({ shell: 'bash', command: bashScript });
				
			expect(res.status).toBe(200);
			// Should work in bash
			expect(String(res.body.result.stdout)).toContain('two');
		});
	});

	describe('performance and limits', () => {
		it('should handle moderately long multiline scripts', async () => {
			const lines = Array.from({ length: 50 }, (_, i) => `echo "line ${i + 1}"`);
			const script = lines.join('\n');
			
			const startTime = Date.now();
			const res = await request(app)
				.post('/command/execute-shell')
				.set('Authorization', `Bearer ${token}`)
				.send({ shell: 'bash', command: script });
			const endTime = Date.now();
				
			expect(res.status).toBe(200);
			expect(res.body.result.exitCode).toBe(0);
			expect(String(res.body.result.stdout)).toContain('line 1');
			expect(String(res.body.result.stdout)).toContain('line 50');
			
			// Should complete within reasonable time
			expect(endTime - startTime).toBeLessThan(5000);
		});

		it('should handle scripts with mixed output timing', async () => {
			const script = `echo "immediate"
sleep 0.1
echo "delayed"
echo "final"`;
			
			const res = await request(app)
				.post('/command/execute-shell')
				.set('Authorization', `Bearer ${token}`)
				.send({ shell: 'bash', command: script });
				
			expect(res.status).toBe(200);
			
			const stdout = String(res.body.result.stdout);
			expect(stdout).toContain('immediate');
			expect(stdout).toContain('delayed');
			expect(stdout).toContain('final');
		});
	});

	describe('security considerations', () => {
		it('should handle scripts with special characters safely', async () => {
			const script = `echo "Special chars: \$@#%^&*()"
echo 'Single quotes work'
echo "Double quotes work"`;
			
			const res = await request(app)
				.post('/command/execute-shell')
				.set('Authorization', `Bearer ${token}`)
				.send({ shell: 'bash', command: script });
				
			expect(res.status).toBe(200);
			expect(String(res.body.result.stdout)).toContain('Special chars:');
			expect(String(res.body.result.stdout)).toContain('Single quotes work');
			expect(String(res.body.result.stdout)).toContain('Double quotes work');
		});

		it('should handle scripts with escaped characters', async () => {
			const script = `echo "Line 1"
echo "Line with \\"escaped quotes\\""
echo 'Line with \\$escaped dollar'`;
			
			const res = await request(app)
				.post('/command/execute-shell')
				.set('Authorization', `Bearer ${token}`)
				.send({ shell: 'bash', command: script });
				
			expect(res.status).toBe(200);
			expect(String(res.body.result.stdout)).toContain('Line 1');
			expect(String(res.body.result.stdout)).toContain('escaped quotes');
		});
	});
});
