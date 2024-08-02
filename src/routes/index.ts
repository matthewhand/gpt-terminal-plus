import { Express } from 'express';
import fileRoutes from './fileRoutes';
import commandRoutes from './commandRoutes';

export const setupRoutes = (app: Express) => {
  const enableFileManagement = process.env.ENABLE_FILE_MANAGEMENT === 'true';
  const enableCommandManagement = process.env.ENABLE_COMMAND_MANAGEMENT === 'true';

  if (enableFileManagement) {
    app.use('/files', fileRoutes);
  }

  if (enableCommandManagement) {
    app.use('/commands', commandRoutes);
  }

  // Add other routes here
};
