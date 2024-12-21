import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { envConfig } from './config/environment';
import diaryRoutes from './routes/diaryRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import { connectDB } from './config/database';

const app = express();

// Connect to the database
connectDB();

app.use(express.json()); // middleware for parsing JSON
app.use(morgan('dev')); // middleware for logging HTTP requests
// app.use(cors()); // middleware for enabling CORS

// Define a route
app.use('/api/auth', authRoutes);
app.use('/api/diaries', diaryRoutes);
app.use('/api/users', userRoutes);

// Catch-all route for 404 Not Found
app.all('*', (req, res) => {
    res.status(404).send('404 Not Found');
});

// OR can use middleware to create a more detailed or custom "not found" page:
// TODO: Add error handling middleware
// app.use(notFoundHandler);
// app.use(errorHandler);

// Start the server
const PORT = envConfig.port;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
