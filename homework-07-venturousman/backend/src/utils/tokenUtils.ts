import { sign } from 'jsonwebtoken';
import { envConfig } from '../config/environment';
import { Types } from 'mongoose';

// Generate access and refresh tokens
export const generateTokens = (
    userId: Types.ObjectId,
    fullname: string,
    email: string,
) => {
    if (!envConfig.accessTokenSecret || !envConfig.refreshTokenSecret) {
        throw new Error('Token secrets are not defined');
    }
    const payload = { userId, fullname, email };
    const accessToken = sign(payload, envConfig.accessTokenSecret, {
        expiresIn: '15m',
    });
    const refreshToken = sign(payload, envConfig.refreshTokenSecret, {
        expiresIn: '7d',
    });
    return { accessToken, refreshToken };
};
// Store refresh tokens (e.g., in a database)
