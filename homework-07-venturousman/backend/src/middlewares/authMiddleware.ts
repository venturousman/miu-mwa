import { Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { envConfig } from '../config/environment';
import CustomRequest from '../models/customRequest';

export const authMiddleware: RequestHandler = (
    req: CustomRequest,
    res,
    next,
) => {
    if (!envConfig.accessTokenSecret) {
        next(new Error('Token secret not defined'));
        return;
    }
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        // next(new Error('Token not found'));
        return;
    }
    const decoded = jwt.verify(token, envConfig.accessTokenSecret);
    req.user = decoded; // extend the request object
    next();
};
