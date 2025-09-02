import fs from 'fs';
import { isConfigLoaded, generateDefaultConfig, persistConfig } from '../../src/config/configHandler';

describe('configHandler', () => {
  describe('isConfigLoaded', () => {
    it('returns true when file exists and false otherwise', () => {
      const spy = jest.spyOn(fs, 'existsSync');
      spy.mockReturnValueOnce(true);
      expect(isConfigLoaded('/tmp/exists.json')).toBe(true);

      spy.mockReturnValueOnce(false);
      expect(isConfigLoaded('/tmp/missing.json')).toBe(false);
      spy.mockRestore();
    });
  });

  describe('generateDefaultConfig', () => {
    it('produces a stable shape with nested sections', () => {
      const cfg = generateDefaultConfig() as any;

      // top-level
      expect(cfg).toMatchObject({
        default: true,
        protocol: 'local',
        hostname: 'localhost',
        port: expect.any(Number),
      });

      // local
      expect(cfg.local).toEqual(expect.objectContaining({ code: true }));

      // ssh
      expect(Array.isArray(cfg.ssh?.hosts)).toBe(true);
      expect(cfg.ssh.hosts[0]).toEqual(
        expect.objectContaining({
          name: expect.any(String),
          host: expect.any(String),
          port: expect.any(Number),
          username: expect.any(String),
          privateKey: expect.any(String),
        })
      );

      // ssm
      expect(Array.isArray(cfg.ssm?.targets)).toBe(true);
      expect(cfg.ssm.targets[0]).toEqual(
        expect.objectContaining({
          name: expect.any(String),
          instanceId: expect.stringMatching(/^i-[a-z0-9]+/),
        })
      );

      // sanity: port within typical range
      expect(cfg.port).toBeGreaterThanOrEqual(1);
      expect(cfg.port).toBeLessThanOrEqual(65535);
    });
  });

  describe('persistConfig', () => {
    it('writes JSON to the specified file with indentation', () => {
      const writeSpy = jest.spyOn(fs, 'writeFileSync') as unknown as jest.SpyInstance<any, any>;
      writeSpy.mockImplementation(() => undefined);
      const data = { a: 1, nested: { b: true } };
      const target = '/tmp/config.json';
      persistConfig(data, target);
      expect(writeSpy).toHaveBeenCalledWith(target, JSON.stringify(data, null, 3));
      writeSpy.mockRestore();
    });
  });
});
