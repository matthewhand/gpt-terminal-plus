import fs from 'fs';
import path from 'path';

/**
 * WCAG 2.1 contrast guard for the shared design tokens. Parses the real
 * :root custom properties out of public/assets/base.css and asserts every
 * foreground/background pairing the UI actually uses clears AA (4.5:1 for
 * normal text). Keeps a future token tweak from silently regressing legibility.
 */
function relLuminance(hex: string): number {
  const m = hex.replace('#', '');
  const ch = [0, 2, 4].map((i) => parseInt(m.slice(i, i + 2), 16) / 255);
  const lin = ch.map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}
function contrast(a: string, b: string): number {
  const la = relLuminance(a);
  const lb = relLuminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

function loadTokens(): Record<string, string> {
  const css = fs.readFileSync(path.resolve('public/assets/base.css'), 'utf8');
  const root = css.slice(css.indexOf(':root'), css.indexOf('}', css.indexOf(':root')));
  const tokens: Record<string, string> = {};
  const re = /--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g;
  let mt: RegExpExecArray | null;
  while ((mt = re.exec(root))) tokens['--' + mt[1]] = mt[2];
  return tokens;
}

describe('design token contrast (WCAG AA)', () => {
  const t = loadTokens();

  // Foreground text tokens that must clear 4.5:1 on each surface they appear on.
  const PAIRS: Array<[string, string]> = [
    ['--text', '--bg'],
    ['--text', '--surface'],
    ['--text-muted', '--bg'],
    ['--text-muted', '--surface'],
    ['--text-dim', '--bg'],
    ['--text-dim', '--surface'],
    ['--text-dim', '--surface-2'],
    ['--accent', '--bg'],
    ['--accent', '--surface'],
    ['--success', '--surface'],
    ['--error', '--surface'],
    ['--warning', '--surface'],
  ];

  it('parses hex tokens out of base.css', () => {
    expect(t['--bg']).toMatch(/^#[0-9a-f]{6}$/i);
    expect(Object.keys(t).length).toBeGreaterThan(8);
  });

  it.each(PAIRS)('%s on %s clears AA (4.5:1)', (fg, bg) => {
    expect(t[fg]).toBeDefined();
    expect(t[bg]).toBeDefined();
    const ratio = contrast(t[fg], t[bg]);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});
