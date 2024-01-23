import express from 'express';
import fileRoutes from './fileRoutes';
import commandRoutes from './commandRoutes';
import serverRoutes from './serverRoutes';
import staticFilesRouter from './staticFilesRouter';

const customRouter = express.Router();

customRouter.use('/files', fileRoutes);
customRouter.use('/commands', commandRoutes);
customRouter.use('/server', serverRoutes);
customRouter.use('/public', staticFilesRouter);

// Add any other routes or middleware you need

export default customRouter;
