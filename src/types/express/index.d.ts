// src/types/express/index.d.ts

import 'express';

declare module 'express' {
  export interface Request {
    serverHandler?: any; // Replace 'any' with the actual type if available
  }
}

