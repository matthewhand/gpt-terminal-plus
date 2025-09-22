import { paginateOutput } from '../../../src/handlers/ssm/actions/paginateOutput';

describe('paginateOutput', () => {
  it('should paginate output with default lines per page', () => {
    const stdout = 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9\nline10\nline11';
    const pages = paginateOutput(stdout);
    expect(pages).toHaveLength(1);
    expect(pages[0]).toBe(stdout);
  });

  it('should paginate output into multiple pages', () => {
    const stdout = 'line1\nline2\nline3\nline4\nline5\nline6';
    const pages = paginateOutput(stdout, 2);
    expect(pages).toHaveLength(3);
    expect(pages[0]).toBe('line1\nline2');
    expect(pages[1]).toBe('line3\nline4');
    expect(pages[2]).toBe('line5\nline6');
  });

  it('should handle empty output', () => {
    const pages = paginateOutput('');
    expect(pages).toEqual(['']);
  });

  it('should handle output with no newlines', () => {
    const stdout = 'single line output';
    const pages = paginateOutput(stdout, 10);
    expect(pages).toEqual(['single line output']);
  });

  it('should handle exact page size', () => {
    const stdout = 'line1\nline2\nline3\nline4';
    const pages = paginateOutput(stdout, 2);
    expect(pages).toHaveLength(2);
    expect(pages[0]).toBe('line1\nline2');
    expect(pages[1]).toBe('line3\nline4');
  });

  it('should handle partial last page', () => {
    const stdout = 'line1\nline2\nline3';
    const pages = paginateOutput(stdout, 2);
    expect(pages).toHaveLength(2);
    expect(pages[0]).toBe('line1\nline2');
    expect(pages[1]).toBe('line3');
  });

  it('should handle linesPerPage larger than total lines', () => {
    const stdout = 'line1\nline2';
    const pages = paginateOutput(stdout, 10);
    expect(pages).toHaveLength(1);
    expect(pages[0]).toBe('line1\nline2');
  });

  it('should handle linesPerPage of 1', () => {
    const stdout = 'line1\nline2\nline3';
    const pages = paginateOutput(stdout, 1);
    expect(pages).toHaveLength(3);
    expect(pages[0]).toBe('line1');
    expect(pages[1]).toBe('line2');
    expect(pages[2]).toBe('line3');
  });

  it('should handle trailing newline', () => {
    const stdout = 'line1\nline2\n';
    const pages = paginateOutput(stdout, 2);
    expect(pages).toHaveLength(1);
    expect(pages[0]).toBe('line1\nline2\n');
  });

  it('should handle multiple consecutive newlines', () => {
    const stdout = 'line1\n\nline3';
    const pages = paginateOutput(stdout, 2);
    expect(pages).toHaveLength(2);
    expect(pages[0]).toBe('line1\n\n');
    expect(pages[1]).toBe('line3');
  });
});