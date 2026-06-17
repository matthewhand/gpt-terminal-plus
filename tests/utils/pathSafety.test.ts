import path from 'path';
import { getWorkingRoot, resolveSafePath, escapesRelativeRoot } from '../../src/utils/pathSafety';

describe('pathSafety', () => {
  describe('getWorkingRoot', () => {
    const original = process.env.FILE_OPS_ROOT;

    afterEach(() => {
      if (original === undefined) delete process.env.FILE_OPS_ROOT;
      else process.env.FILE_OPS_ROOT = original;
    });

    it('defaults to the process working directory', () => {
      delete process.env.FILE_OPS_ROOT;
      expect(getWorkingRoot()).toBe(path.resolve(process.cwd()));
    });

    it('honours FILE_OPS_ROOT', () => {
      process.env.FILE_OPS_ROOT = '/tmp/file-ops-root';
      expect(getWorkingRoot()).toBe(path.resolve('/tmp/file-ops-root'));
    });
  });

  describe('resolveSafePath', () => {
    const root = '/srv/app';

    it('resolves relative paths inside the root', () => {
      expect(resolveSafePath('sub/dir/file.txt', root)).toBe('/srv/app/sub/dir/file.txt');
    });

    it('accepts the root itself', () => {
      expect(resolveSafePath('.', root)).toBe('/srv/app');
    });

    it('accepts absolute paths inside the root', () => {
      expect(resolveSafePath('/srv/app/file.txt', root)).toBe('/srv/app/file.txt');
    });

    it('rejects traversal outside the root', () => {
      expect(resolveSafePath('../etc/passwd', root)).toBeNull();
      expect(resolveSafePath('sub/../../etc/passwd', root)).toBeNull();
    });

    it('rejects absolute paths outside the root', () => {
      expect(resolveSafePath('/etc/passwd', root)).toBeNull();
    });

    it('rejects sibling directories sharing a prefix with the root', () => {
      expect(resolveSafePath('/srv/app-evil/file.txt', root)).toBeNull();
    });

    it('rejects empty input', () => {
      expect(resolveSafePath('', root)).toBeNull();
      expect(resolveSafePath('   ', root)).toBeNull();
    });
  });

  describe('escapesRelativeRoot', () => {
    it.each([
      ['sub/file.txt', false],
      ['./sub/file.txt', false],
      ['sub/../other/file.txt', false],
      ['..', true],
      ['../file.txt', true],
      ['sub/../../file.txt', true],
      ['..\\file.txt', true],
      ['', true],
    ])('returns expected for %s', (input, expected) => {
      const result = escapesRelativeRoot(input);
      expect(result).toBe(expected);
      expect(typeof result).toBe('boolean'); // type assert
      if (expected) {
        expect(result && (input.includes('..') || input === '')).toBe(true); // combo assert
      }
    });
  });
});
