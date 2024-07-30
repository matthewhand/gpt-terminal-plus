import { Router, Request, Response } from 'express';
import os from 'os';
import fs from 'fs';
import path from 'path';
import config from 'config';

const router = Router();

/**
 * Helper function to format uptime into a readable format.
 * @param {number} seconds - Uptime in seconds.
 * @returns {string} - Formatted uptime string.
 */
const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return (
    (days > 0 ? days + 'd ' : '') +
    (hours > 0 ? hours + 'h ' : '') +
    (minutes > 0 ? minutes + 'm ' : '') +
    secs + 's'
  );
};

/**
 * Uptime endpoint
 */
router.get('/uptime', (_: Request, res: Response) => {
  const uptime = process.uptime(); // Get uptime in seconds
  const formattedUptime = formatUptime(uptime);
  res.status(200).json({ uptime: formattedUptime });
});

/**
 * Health check endpoint
 */
router.get('/health', (_: Request, res: Response) => {
  try {
    // Check if API_TOKEN is present
    const isApiTokenPresent = !!process.env.API_TOKEN;

    // Check for valid server configuration
    const nodeEnv = process.env.NODE_ENV || 'default';
    const nodeConfigDir = process.env.NODE_CONFIG_DIR || path.resolve(__dirname, '../../config');
    const configFilePath = path.join(nodeConfigDir, `${nodeEnv}.json`);
    const isConfigFilePresent = fs.existsSync(configFilePath);

    // Check for free disk space
    const stat = fs.statSync(nodeConfigDir);
    const diskFree = os.freemem();
    const diskTotal = os.totalmem();
    const isDiskSpaceSufficient = diskFree / diskTotal > 0.2; // At least 20% free space

    // Check CPU load (average over the last 5 minutes)
    const cpuLoad = os.loadavg()[1]; // 5 minute load average
    const isCpuLoadAcceptable = cpuLoad < os.cpus().length * 0.7; // Less than 70% of CPU cores

    // Check for free memory
    const memoryFree = os.freemem();
    const totalMemory = os.totalmem();
    const isMemorySufficient = memoryFree / totalMemory > 0.2; // At least 20% free memory

    const isHealthy =
      isApiTokenPresent &&
      isConfigFilePresent &&
      isDiskSpaceSufficient &&
      isCpuLoadAcceptable &&
      isMemorySufficient;

    if (!isHealthy) {
      const reasons: string[] = [];
      if (!isApiTokenPresent) reasons.push('API_TOKEN missing');
      if (!isConfigFilePresent) reasons.push(`Configuration file ${nodeEnv}.json missing`);
      if (!isDiskSpaceSufficient) reasons.push('Insufficient disk space');
      if (!isCpuLoadAcceptable) reasons.push('High CPU load');
      if (!isMemorySufficient) reasons.push('Insufficient memory');

      return res.status(503).json({
        status: 'unhealthy',
        reasons,
      });
    }

    return res.status(200).json({ status: 'healthy' });
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

export default router;
