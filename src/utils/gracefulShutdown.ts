import Debug from 'debug';
import { Server } from 'http';

const debug = Debug('app:gracefulShutdown');

interface ShutdownOptions {
  server: Server;
  timeout?: number;
  onShutdown?: () => Promise<void> | void;
}

/**
 * Sets up graceful shutdown handling for the application
 */
export function setupGracefulShutdown(options: ShutdownOptions): void {
  const { server, timeout = 30000, onShutdown } = options;

  let isShuttingDown = false;

  const shutdown = async (signal: string) => {
    if (isShuttingDown) {
      debug('Shutdown already in progress, forcing exit');
      process.exit(1);
    }

    isShuttingDown = true;
    debug(`Received ${signal}, initiating graceful shutdown`);

    // Stop accepting new connections
    server.close(async (err) => {
      if (err) {
        debug('Error closing server:', err);
        process.exit(1);
      }

      debug('Server closed, no longer accepting connections');

      try {
        // Run custom shutdown logic
        if (onShutdown) {
          debug('Running custom shutdown logic');
          await onShutdown();
        }

        debug('Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        debug('Error during shutdown:', error);
        process.exit(1);
      }
    });

    // Force shutdown after timeout
    setTimeout(() => {
      debug(`Shutdown timeout (${timeout}ms) reached, forcing exit`);
      process.exit(1);
    }, timeout);
  };

  // Handle common termination signals
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    debug('Uncaught exception:', error);
    shutdown('uncaughtException');
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    debug('Unhandled rejection at:', promise, 'reason:', reason);
    shutdown('unhandledRejection');
  });

  debug('Graceful shutdown handlers registered');
}

/**
 * Creates a shutdown handler for common cleanup tasks
 */
export function createShutdownHandler(): () => Promise<void> {
  return async () => {
    debug('Performing cleanup tasks...');

    // Add cleanup tasks here
    const cleanupTasks: Array<() => Promise<void> | void> = [
      // Close database connections
      // Close file handles
      // Clean up temporary files
      // Flush logs
      // Close external service connections
    ];

    for (const task of cleanupTasks) {
      try {
        await task();
      } catch (error) {
        debug('Error during cleanup task:', error);
      }
    }

    debug('Cleanup tasks completed');
  };
}