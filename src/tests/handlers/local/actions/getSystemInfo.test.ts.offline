/**
 * @fileoverview Tests for the getSystemInfo function.
 */

import { expect } from 'chai';
import { getSystemInfo } from '@src/handlers/local/actions/getSystemInfo';
import sinon from 'sinon';
import os from 'os';
import { SystemInfo } from '@types/SystemInfo';

describe('getSystemInfo', () => {
  let platformStub: sinon.SinonStub;
  let releaseStub: sinon.SinonStub;
  let cpusStub: sinon.SinonStub;

  beforeEach(() => {
    platformStub = sinon.stub(os, 'platform').returns('linux');
    releaseStub = sinon.stub(os, 'release').returns('5.8.0-53-generic');
    cpusStub = sinon.stub(os, 'cpus').returns([
      {
        model: 'Intel',
        speed: 2400,
        times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 }, // Added times
      },
    ]);
  });

  afterEach(() => {
    platformStub.restore();
    releaseStub.restore();
    cpusStub.restore();
  });

  it('should retrieve system information', async () => {
    const systemInfo: SystemInfo = await getSystemInfo('bash');

    expect(systemInfo.type).toBe('linux'); // Changed from osType
    expect(systemInfo.osVersion).toBe('5.8.0-53-generic');
    expect(systemInfo.cpuModel).toBe('Intel');
    expect(systemInfo.cpuSpeed).toBe(2400);
  });

  it('should handle different operating systems', async () => {
    console.log('Test Case: Handle different operating systems');
    platformStub.returns('darwin');
    releaseStub.returns('19.6.0');
    cpusStub.returns([
      {
        model: 'Apple M1',
        speed: 1600,
        times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 }, // Added times
      },
    ]);

    const systemInfo: SystemInfo = await getSystemInfo('zsh');

    expect(systemInfo.type).toBe('darwin'); // Changed from osType
    expect(systemInfo.osVersion).toBe('19.6.0');
    expect(systemInfo.cpuModel).toBe('Apple M1');
    expect(systemInfo.cpuSpeed).toBe(1600);
  });
});
