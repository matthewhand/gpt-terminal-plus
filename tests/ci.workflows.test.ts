import fs from 'fs';
import path from 'path';
import { parse } from 'yaml';

const workflowsDir = path.join(__dirname, '..', '.github', 'workflows');

const loadWorkflow = (file: string): any =>
  parse(fs.readFileSync(path.join(workflowsDir, file), 'utf8'));

describe('GitHub Actions workflows', () => {
  it('all workflow files parse as valid YAML with a jobs section', () => {
    const files = fs
      .readdirSync(workflowsDir)
      .filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'));
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      const wf = loadWorkflow(file);
      expect(wf).toBeTruthy();
      expect(wf.jobs).toBeDefined();
      expect(Object.keys(wf.jobs).length).toBeGreaterThan(0);
    }
  });

  describe('ci.yml', () => {
    const wf = loadWorkflow('ci.yml');
    const job = wf.jobs['build-and-test'];
    const runSteps: string[] = job.steps
      .filter((s: any) => s.run)
      .map((s: any) => s.run);

    it('triggers on push and pull_request to main', () => {
      const triggers = wf.on;
      expect(triggers.push.branches).toContain('main');
      expect(triggers.pull_request.branches).toContain('main');
    });

    it('runs a node 20.x and 22.x matrix', () => {
      expect(job.strategy.matrix['node-version']).toEqual(['20.x', '22.x']);
    });

    it('uses npm ci, then gates on check-types, test, and build', () => {
      expect(runSteps).toContain('npm ci');
      const gated = job.steps.filter((s: any) => s.run && !s['continue-on-error']);
      const gatedRuns = gated.map((s: any) => s.run);
      expect(gatedRuns).toContain('npm run check-types');
      expect(gatedRuns).toContain('npm test');
      expect(gatedRuns).toContain('npm run build');
    });

    it('runs eslint but does not gate on it', () => {
      const lintStep = job.steps.find((s: any) => s.run === 'npm run lint');
      expect(lintStep).toBeDefined();
      expect(lintStep['continue-on-error']).toBe(true);
    });

    it('lints the OpenAPI spec after the build that generates it', () => {
      const buildIdx = runSteps.indexOf('npm run build');
      const openapiIdx = runSteps.indexOf('npm run openapi:lint');
      expect(buildIdx).toBeGreaterThanOrEqual(0);
      expect(openapiIdx).toBeGreaterThan(buildIdx);
    });

    it('runs tests before build so pretest dist cleanup cannot clobber artifacts', () => {
      expect(runSteps.indexOf('npm test')).toBeLessThan(runSteps.indexOf('npm run build'));
    });
  });
});
