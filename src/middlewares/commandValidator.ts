import { Request, Response, NextFunction } from 'express';
import { convictConfig } from '../config/convictConfig';

const DANGEROUS_COMMANDS = [
  'rm -rf /', 'sudo rm -rf', 'mkfs', 'dd if=', 'format', 'fdisk',
  'shutdown', 'reboot', 'halt', 'init 0', 'init 6',
  'chmod 777 /', 'chown -R root:root /',
];

export function validateCommand(req: Request, res: Response, next: NextFunction) {
  const { command } = req.body;
  
  if (!command) {
    return next();
  }
  
  const cfg = convictConfig();
  const safeGet = (key: string, def: string = ''): string => {
    try { return String(cfg.get(key) ?? def); } catch { return def; }
  };
  // Support both new 'security.*' keys and legacy 'policy.*' used in tests/config
  const denyRegex = safeGet('policy.denyRegex', safeGet('security.denyCommandRegex', ''));
  const confirmRegex = safeGet('policy.confirmRegex', safeGet('security.confirmCommandRegex', ''));
  
  // Check dangerous commands
  const isDangerous = DANGEROUS_COMMANDS.some(dangerous => 
    command.toLowerCase().includes(dangerous.toLowerCase())
  );
  
  if (isDangerous) {
    return res.status(403).json({
      message: 'Dangerous command blocked',
      command,
      reason: 'potentially destructive'
    });
  }

  // Then check deny patterns (lower precedence than explicit dangerous set)
  if (denyRegex && new RegExp(denyRegex, 'i').test(command)) {
    return res.status(403).json({ 
      message: 'Command blocked by policy',
      command,
      reason: 'matches deny pattern'
    });
  }
  
  // Check if confirmation required
  if (confirmRegex && new RegExp(confirmRegex, 'i').test(command)) {
    req.body.needsConfirmation = true;
  }
  
  next();
}
