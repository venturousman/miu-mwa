import mongoose from 'mongoose';
import { envConfig } from './environment';

export const connectDB = async () => {
    try {
        const dbUrl = envConfig.dbUrl;
        await mongoose.connect(dbUrl);
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit process with failure
    }
};
