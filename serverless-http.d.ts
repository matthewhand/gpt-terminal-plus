declare module 'serverless-http' {
  import { Handler } from 'aws-lambda';
  import { Application } from 'express';

  function serverless(app: Application): Handler;

  export default serverless;
}
