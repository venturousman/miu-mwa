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
    accessTokenSecret:
        process.env.ACCESS_TOKEN_SECRET ||
        'aede8ed9269ebddc5493301fdbfd361747b2e3393edc5be0ac311740c2d8ae1c',
    refreshTokenSecret:
        process.env.REFRESH_TOKEN_SECRET ||
        '526cef15159c509813d849e9402fefb16cc309fc58f50332ac19695753fbf888',
    githubToken:
        process.env.GITHUB_TOKEN || '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',
    openWeatherApiKey:
        process.env.OPENWEATHER_API_KEY || 'fd00911bf792222cc2235e78a1a18131',
    yelpApiKey:
        process.env.YELP_API_KEY ||
        'xDZ82T47GjXaBwDMnZZaVcuOOKhvVFlPSchgZywMhljQxsJqvbp9ggDTCmLDn_AqmBg40ywOgT43LynDgz1dZ6rQqnLXcgu0LtsW24qpnCPt5UNZdezw5bjt2QZeZ3Yx',
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [],
};
