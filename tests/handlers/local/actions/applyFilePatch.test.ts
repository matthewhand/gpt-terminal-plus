import fs from 'fs';
import path from 'path';
import { applyFilePatch, ApplyFilePatchOptions } from '../../../../src/handlers/local/actions/applyFilePatch';

describe('applyFilePatch (local fuzzy patching)', () => {
  const tmpDir = path.join(__dirname, '../../../../tmp-applyFilePatch');
  const filePath = path.join(tmpDir, 'sample.txt');

  beforeAll(() => {
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  });

  afterAll(() => {
    if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    const initial = [
      'function greet() {',
      '  console.log("hello");',
      '}',
      ''
    ].join('\n');
    fs.writeFileSync(filePath, initial, 'utf-8');
  });

  afterEach(() => {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  });

  it('returns preview of patched text without writing', () => {
    const oldText = [
      'function greet() {',
      '  console.log("hello");',
      '}',
      ''
    ].join('\n');
    const newText = [
      'function greet() {',
      '  console.log("hello world");',
      '}',
      ''
    ].join('\n');

    const result = applyFilePatch({ filePath, oldText, newText, preview: true });

    expect(result.success).toBe(true);
    expect(result.patchedText).toContain('hello world');
    // File remains unchanged
    const current = fs.readFileSync(filePath, 'utf-8');
    expect(current).toContain('hello');
    expect(current).not.toContain('hello world');
  });

  it('writes patched text to disk when not preview', () => {
    const oldText = [
      'function greet() {',
      '  console.log("hello");',
      '}',
      ''
    ].join('\n');
    const newText = [
      'function greet() {',
      '  console.log("goodbye");',
      '}',
      ''
    ].join('\n');

    const result = applyFilePatch({ filePath, oldText, newText });
    expect(result.success).toBe(true);
    const current = fs.readFileSync(filePath, 'utf-8');
    expect(current).toContain('goodbye');
  });

  it('applies fuzzily when file drifted', () => {
    // Simulate someone adding whitespace/comment to current file
    const drifted = [
      '// note: drifted content',
      'function greet() {',
      '  console.log("hello");',
      '}',
      ''
    ].join('\n');
    fs.writeFileSync(filePath, drifted, 'utf-8');

    const oldText = [
      'function greet() {',
      '  console.log("hello");',
      '}',
      ''
    ].join('\n');
    const newText = [
      'function greet() {',
      '  console.log("drift-ok");',
      '}',
      ''
    ].join('\n');

    const result = applyFilePatch({ filePath, oldText, newText });
    expect(result.success).toBe(true);
    const current = fs.readFileSync(filePath, 'utf-8');
    expect(current).toContain('// note: drifted content');
    expect(current).toContain('drift-ok');
  });

  it('rejects when file does not exist', () => {
    const opts: ApplyFilePatchOptions = {
      filePath: path.join(tmpDir, 'missing.txt'),
      oldText: 'a',
      newText: 'b',
      preview: true
    };
    const result = applyFilePatch(opts);
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/File not found/);
  });

  it('rejects when no hunks applied (no changes)', () => {
    const oldText = fs.readFileSync(filePath, 'utf-8');
    const newText = oldText; // no change

    const result = applyFilePatch({ filePath, oldText, newText });
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Patch could not be applied/);
  });
});

