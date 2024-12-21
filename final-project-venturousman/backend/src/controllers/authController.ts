import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { envConfig } from '../config/environment';
import { generateTokens } from '../utils/tokenUtils';
import userService from '../services/userService';
import blacklistService from '../services/blacklistService';
import { ErrorWithStatus } from '../models/errorWithStatus';

// How to generate secret key
// Open cmd, node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

export const signin: RequestHandler = async (req, res, next) => {
    console.log('authController signin: ', req.body);
    try {
        const { email, password } = req.body;
        const user = await userService.getUserByEmail(email);
        // console.log('authController signin user: ', user);
        if (!user) {
            // res.status(401).json({ message: 'Invalid credentials' }); return;
            throw new ErrorWithStatus('User not found', 404);
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password!);
        if (!isMatch) {
            // res.status(401).json({ message: 'Invalid credentials' }); return;
            throw new ErrorWithStatus('Passwords do not match', 401);
        }

        const tokens = generateTokens(user._id, user.fullname!, user.email!);
        // set refresh token in secured cookie
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            // secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            // sameSite: 'none',
            sameSite: 'strict', // Prevent CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.json({
            email,
            accessToken: tokens.accessToken,
            avatar: user.picture_url,
        });
    } catch (error) {
        console.log('authController signin error:', error);
        next(error);
    }
};

export const signup: RequestHandler = async (req, res, next) => {
    console.log('authController signup: ', req.body);
    try {
        const { fullname, email, password } = req.body;

        // Check if user already exists
        const existingUser = await userService.getUserByEmail(email);
        if (existingUser) {
            // res.status(409).json({ message: 'User already exists' }); return;
            throw new ErrorWithStatus('User already exists', 409);
        }

        const picture_url = req.file?.path || ''; // '/images/default.jpg';
        // console.log('authController signup picture_url: ', picture_url);

        // if (!req.file) throw new ErrorWithStatus('No file uploaded', 400); // optional
        // let picture_url = ''; // default image
        // if (req.file) {
        //     if (req.file.mimetype.startsWith('image/')) {
        //         picture_url = `/images/${req.file.filename}`;
        //     } else if (req.file.mimetype === 'application/pdf') {
        //         picture_url = `/pdfs/${req.file.filename}`;
        //     } else {
        //         picture_url = `/others/${req.file.filename}`;
        //     }
        // }
        // console.log('authController signup filePath: ', picture_url);

        const user = await userService.createUser(
            fullname,
            email,
            password,
            picture_url,
        );
        // console.log('authController signup user: ', user);
        res.status(201).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
        });
    } catch (error) {
        console.log('authController signup error:', error);
        next(error);
    }
};

export const refreshToken: RequestHandler = async (req, res, next) => {
    console.log('authController refreshToken: ', req.body);
    try {
        // get refresh token from cookie
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            // res.status(401).json({ message: 'Unauthorized' }); return;
            throw new ErrorWithStatus('Invalid refresh token', 401);
        }

        const payload = jwt.verify(
            refreshToken,
            envConfig.refreshTokenSecret,
        ) as jwt.JwtPayload;
        // console.log('authController refreshToken payload: ', payload);
        const { userId, fullname, email } = payload;

        // Verify if the refresh token exists in the store
        const jti = payload.jti as string;
        const isBlacklisted = await blacklistService.isTokenBlacklisted(jti);
        if (isBlacklisted) {
            throw new ErrorWithStatus('Token is blacklisted', 403); // forbidden
        }

        const tokens = generateTokens(userId, fullname, email);

        // Put the old refresh token in the store
        const age = 7 * 24 * 60 * 60; // 7 days in seconds
        blacklistService.blacklistToken(jti, age, userId, 'refresh'); // dont need to await

        // set refresh token in secured cookie
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            // secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            // sameSite: 'none',
            sameSite: 'strict', // Prevent CSRF
            maxAge: age * 1000, // 7 days
        });

        res.json({ email, accessToken: tokens.accessToken });
    } catch (error) {
        console.log('authController refreshToken error:', error);
        next(error);
    }
};

export const signout: RequestHandler = async (req, res, next) => {
    console.log('authController signout: ', req.body);
    try {
        const authHeader = req.headers['authorization'];
        const accessToken = authHeader && authHeader.split(' ')[1];
        if (accessToken) {
            try {
                const payload = jwt.verify(
                    accessToken,
                    envConfig.accessTokenSecret,
                ) as jwt.JwtPayload;
                // console.log(
                //     'authController signout accessToken payload: ',
                //     payload,
                // );
                const jti = payload.jti as string;

                // Put the old access token in the store
                const age = 15 * 60; // 15 minutes in seconds
                blacklistService.blacklistToken(
                    jti,
                    age,
                    payload.userId,
                    'access',
                );
            } catch (error) {
                console.log('authController signout error:', error);
                // next(error);
            }
        }

        // get refresh token from cookie
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const age = 7 * 24 * 60 * 60; // 7 days in seconds
            try {
                const payload = jwt.verify(
                    refreshToken,
                    envConfig.refreshTokenSecret,
                ) as jwt.JwtPayload;
                // console.log(
                //     'authController signout refreshToken payload: ',
                //     payload,
                // );
                const jti = payload.jti as string;

                // Put the old refresh token in the store
                blacklistService.blacklistToken(
                    jti,
                    age,
                    payload.userId,
                    'refresh',
                );
            } catch (error) {
                console.log('authController signout error:', error);
                // next(error);
            }

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
                // secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                // sameSite: 'none',
                sameSite: 'strict', // Prevent CSRF
                maxAge: age * 1000, // 7 days
            });
        }

        res.json({ message: 'Signout successful' });
    } catch (error) {
        console.log('authController signout error:', error);
        next(error);
    }
};
