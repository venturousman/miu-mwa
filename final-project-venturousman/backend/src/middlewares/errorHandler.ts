import { ErrorRequestHandler, RequestHandler } from 'express';
import { ErrorWithStatus } from '../models/errorWithStatus';

export const routeNotFoundHandler: RequestHandler = (req, res, next) => {
    // console.log(`### RrouteNotFoundHandler equest URL: ${req.url}`);
    next(new ErrorWithStatus('Route not found', 404));
};

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    if (error instanceof ErrorWithStatus) {
        res.status(error.status || 500).json({ error: error.message });
    } else {
        res.status(500).json({ error: error.message });
    }
};
