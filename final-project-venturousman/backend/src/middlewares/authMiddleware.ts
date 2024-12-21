import { RequestHandler } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { envConfig } from '../config/environment';
import CustomRequest from '../models/customRequest';
import { ErrorWithStatus } from '../models/errorWithStatus';
import blacklistService from '../services/blacklistService';

export const authMiddleware: RequestHandler = async (
    req: CustomRequest,
    res,
    next,
) => {
    if (!envConfig.accessTokenSecret) {
        next(new ErrorWithStatus('Token secret not defined', 500));
        return;
    }
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        next(new ErrorWithStatus('Unauthorized', 401));
        return;
    }

    try {
        const decoded = jwt.verify(
            token,
            envConfig.accessTokenSecret,
        ) as jwt.JwtPayload;

        const jti = decoded.jti as string;
        const isBlacklisted = await blacklistService.isTokenBlacklisted(jti);
        if (isBlacklisted) {
            // res.status(401).json({ message: 'Token is blacklisted' }); return;
            next(new ErrorWithStatus('Token is blacklisted', 401));
            return;
        }

        req.user = decoded; // extend the request object
        next();
    } catch (error) {
        // console.log('### authMiddleware error:', JSON.stringify(error));
        if (error instanceof TokenExpiredError) {
            res.status(401).json({
                message: 'Token has expired',
                expiredAt: error.expiredAt,
                name: error.name,
            });
            // next(new ErrorWithStatus('Token has expired', 401, error.name));
        } else {
            res.status(401).json({ message: 'Invalid token' });
            // next(error);
        }
    }
};
