import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { envConfig } from '../config/environment';
import { generateTokens } from '../utils/tokenUtils';
import userService from '../services/userService';
import bcrypt from 'bcrypt';

// How to generate secret key
// Open cmd, node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

export const login: RequestHandler = async (req, res) => {
    console.log('authController login: ', req.body);

    if (!envConfig.accessTokenSecret || !envConfig.refreshTokenSecret) {
        res.status(500).json({ message: 'Token secret not defined' });
        return;
    }

    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);
    console.log('authController login user: ', user);
    if (!user || !user.password) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }

    const tokens = generateTokens(user._id, user.fullname!, user.email!);
    // set refresh token in secured cookie
    res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    });
    res.json({ accessToken: tokens.accessToken });
};

export const register: RequestHandler = (req, res) => {
    console.log(req.body);
    res.send('Register');
};

export const refreshToken: RequestHandler = (req, res) => {
    console.log('authController refreshToken: ', req.body);
    // get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    if (!envConfig.refreshTokenSecret) {
        res.status(500).json({ message: 'Token secret not defined' });
        return;
    }
    res.send('Refresh Token');

    //     const refreshToken = req.body.refreshToken;
    //     // Verify user_id from database
    //     const user_id = '123'; // TODO: Get user_id from database
    //     const decoded = jwt.verify(refreshToken, envConfig.refreshTokenSecret);
    //     const tokens = generateTokens(user_id);
    //     res.json(tokens);
};
