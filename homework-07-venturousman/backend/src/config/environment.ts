import dotenv from 'dotenv';

dotenv.config();

export const envConfig = {
    port: process.env.PORT || 3000,
    dbUrl: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/mwa-diary',
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
};
