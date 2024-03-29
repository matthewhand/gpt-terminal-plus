// src/middlewares/checkAuthToken.ts

import { Request, Response, NextFunction } from 'express';
import Debug from 'debug';

const debugMiddleware = Debug('app:middleware:checkAuthToken');

/**
 * Middleware to check for API token in the request headers.
 * Ensures that each request to the server contains a valid API token.
 * If the token is missing, invalid, or not provided, the middleware
 * will block the request and respond with an appropriate HTTP status code.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function in the call stack.
 */
export const checkAuthToken = (req: Request, res: Response, next: NextFunction): void => {
    debugMiddleware('Checking authorization token');
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        debugMiddleware('No authorization token provided');
        res.sendStatus(401); // if there's no token
        return;
    }

    if (token !== process.env.API_TOKEN) {
        debugMiddleware('Authorization token mismatch');
        res.sendStatus(403); // if the token is wrong
        return;
    }

    debugMiddleware('Authorization token validated successfully');
    next(); // if the token is correct
};
