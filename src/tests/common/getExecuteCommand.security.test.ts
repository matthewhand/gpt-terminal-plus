import { getExecuteCommand } from '../../common/getExecuteCommand';

describe('getExecuteCommand - quoting and safety', () => {
  const specialPaths = [
    '/tmp/script&run.sh',
    '/tmp/script|pipe.sh',
    '/tmp/script;then.sh',
    '/tmp/read<in.sh',
    '/tmp/write>out.sh',
    '/tmp/paren (test).sh',
    '/tmp/multi &|;<> (combo).sh',
  ];

  test('bash: quotes when path includes unsafe characters', () => {
    for (const p of specialPaths) {
      const cmd = getExecuteCommand('bash', p);
      expect(cmd).toBe(`bash "${p}"`);
    }
  });

  test('powershell: quotes when path includes unsafe characters', () => {
    const winPaths = [
      'C:/Temp/file&run.ps1',
      'C:/Temp/file|pipe.ps1',
      'C:/Temp/file;then.ps1',
      'C:/Temp/read<in.ps1',
      'C:/Temp/write>out.ps1',
      'C:/Temp/paren (test).ps1',
      'C:/Temp/multi &|;<> (combo).ps1',
    ];
    for (const p of winPaths) {
      const cmd = getExecuteCommand('powershell', p);
      expect(cmd).toBe(`Powershell -File "${p}"`);
    }
  });

  test('python: quotes when path includes spaces or special chars', () => {
    const paths = ['/tmp/with space.py', '/tmp/with&(special).py'];
    for (const p of paths) {
      const cmd = getExecuteCommand('python', p);
      expect(cmd).toBe(`python "${p}"`);
    }
  });
});

