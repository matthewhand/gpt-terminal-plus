import express, { Request, Response } from 'express';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { convictConfig } from '../config/convictConfig';
import Debug from 'debug';

const debug = Debug('app:healthRoutes');
const router = express.Router();
const startTime = Date.now();

/**
 * GET /health
 * Basic health check endpoint
 */
router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - startTime) / 1000),
    version: process.env.npm_package_version || '1.0.0'
  });
});

/**
 * GET /health/detailed
 * Comprehensive health check with system metrics
 */
router.get('/detailed', (req: Request, res: Response) => {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - startTime) / 1000),
    version: process.env.npm_package_version || '1.0.0',
    system: {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      memory: {
        total: Math.round(os.totalmem() / 1024 / 1024), // MB
        free: Math.round(os.freemem() / 1024 / 1024), // MB
        used: Math.round((os.totalmem() - os.freemem()) / 1024 / 1024), // MB
        usagePercent: Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100)
      },
      cpu: {
        cores: os.cpus().length,
        model: os.cpus()[0]?.model || 'Unknown',
        loadAverage: os.loadavg()
      },
      disk: getDiskUsage()
    },
    application: {
      environment: process.env.NODE_ENV || 'development',
      pid: process.pid,
      cwd: process.cwd()
    },
    configuration: getConfigHealth(),
    dependencies: getDependencyHealth()
  };

  // Determine overall health status
  const isHealthy = checkOverallHealth(healthCheck);
  healthCheck.status = isHealthy ? 'ok' : 'degraded';

  res.status(isHealthy ? 200 : 503).json(healthCheck);
});

/**
 * GET /health/ready
 * Readiness probe for Kubernetes/load balancers
 */
router.get('/ready', (req: Request, res: Response) => {
  // Check if application is ready to serve requests
  const isReady = checkReadiness();

  if (isReady) {
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /health/live
 * Liveness probe for Kubernetes
 */
router.get('/live', (req: Request, res: Response) => {
  // Basic liveness check - if we can respond, we're alive
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - startTime) / 1000)
  });
});

function getDiskUsage() {
  try {
    const cwd = process.cwd();
    const stats = fs.statSync(cwd);
    const diskInfo = {
      cwd: cwd,
      available: 'Unknown',
      total: 'Unknown'
    };

    // Try to get disk usage if possible
    try {
      const diskUsage = require('diskusage');
      const info = diskUsage.checkSync(cwd);
      diskInfo.available = Math.round(info.available / 1024 / 1024 / 1024) + 'GB'; // GB
      diskInfo.total = Math.round(info.total / 1024 / 1024 / 1024) + 'GB'; // GB
    } catch {
      // diskusage module not available, skip
    }

    return diskInfo;
  } catch (error) {
    debug('Failed to get disk usage:', error);
    return { error: 'Unable to determine disk usage' };
  }
}

function getConfigHealth() {
  try {
    const cfg = convictConfig();
    return {
      status: 'loaded',
      environment: process.env.NODE_ENV || 'development',
      hasApiToken: !!cfg.get('security.apiToken'),
      hasCorsOrigin: !!cfg.get('server.corsOrigin'),
      executorsConfigured: !!cfg.get('executors')
    };
  } catch (error) {
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function getDependencyHealth() {
  const dependencies = [
    { name: 'express', module: 'express' },
    { name: 'config', module: 'config' },
    { name: 'convict', module: 'convict' }
  ];

  const results: Record<string, string> = {};
  dependencies.forEach(dep => {
    try {
      require.resolve(dep.module);
      results[dep.name] = 'available';
    } catch {
      results[dep.name] = 'missing';
    }
  });

  return results;
}

function checkOverallHealth(healthCheck: any) {
  // Check memory usage - if over 90%, consider unhealthy
  if (healthCheck.system.memory.usagePercent > 90) {
    return false;
  }

  // Check if configuration loaded properly
  if (healthCheck.configuration.status !== 'loaded') {
    return false;
  }

  // Check critical dependencies
  if (healthCheck.dependencies.express !== 'available' ||
      healthCheck.dependencies.config !== 'available') {
    return false;
  }

  return true;
}

function checkReadiness() {
  // For readiness, we might want to check database connections,
  // external services, etc. For now, just check if config is loaded.
  try {
    convictConfig();
    return true;
  } catch {
    return false;
  }
}

export default router;