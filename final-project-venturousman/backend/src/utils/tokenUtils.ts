import { sign } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { envConfig } from '../config/environment';
import { ErrorWithStatus } from '../models/errorWithStatus';

const generateAccessToken = (
    userId: Types.ObjectId,
    fullname: string,
    email: string,
) => {
    if (!envConfig.accessTokenSecret) {
        throw new ErrorWithStatus('Token secrets are not defined', 500);
    }
    const payload = { userId, fullname, email, jti: uuidv4() };
    const accessToken = sign(payload, envConfig.accessTokenSecret, {
        expiresIn: '15m',
    });
    return accessToken;
};

const generateRefreshToken = (
    userId: Types.ObjectId,
    fullname: string,
    email: string,
) => {
    if (!envConfig.refreshTokenSecret) {
        throw new ErrorWithStatus('Token secrets are not defined', 500);
    }
    const payload = { userId, fullname, email, jti: uuidv4() };
    const refreshToken = sign(payload, envConfig.refreshTokenSecret, {
        expiresIn: '7d',
    });
    return refreshToken;
};

// Generate access and refresh tokens
export const generateTokens = (
    userId: Types.ObjectId,
    fullname: string,
    email: string,
) => {
    const accessToken = generateAccessToken(userId, fullname, email);
    const refreshToken = generateRefreshToken(userId, fullname, email);
    return { accessToken, refreshToken };
};
// Store refresh tokens (e.g., in a database)
