declare module 'swagger-ui-express' {
  import { RequestHandler } from 'express';

  export const serve: RequestHandler;

  export function setup(swaggerDoc?: any, options?: any, customCss?: string, customfavIcon?: string, swaggerUrl?: string, customeSiteTitle?: string): RequestHandler;

  const _default: {
    serve: RequestHandler;
    setup: typeof setup;
  };

  export default _default;
}