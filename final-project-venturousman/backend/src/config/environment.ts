import dotenv from 'dotenv';

// Load the correct .env file based on NODE_ENV
const isEqual = process.env.NODE_ENV?.trim() === 'production';
const envFile = isEqual ? '.env' : '.env.local';
// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
// console.log(`Loading environment variables from: ${envFile}`);
dotenv.config({ path: envFile });

export const envConfig = {
    port: process.env.PORT || 3000,
    url: process.env.URL || 'http://localhost:3000',
    dbUrl: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/mwa-project',
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || '',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || '',
    githubToken: process.env.GITHUB_TOKEN || '',
    openWeatherApiKey: process.env.OPENWEATHER_API_KEY || '',
    yelpApiKey: process.env.YELP_API_KEY || '',
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [],
};
