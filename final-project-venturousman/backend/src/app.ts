import express from 'express';
import morgan from 'morgan';
import cors, { CorsOptions } from 'cors';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import { envConfig } from './config/environment';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import { connectDB } from './config/database';
import { errorHandler, routeNotFoundHandler } from './middlewares/errorHandler';
import placeRoutes from './routes/placeRoutes';
import itineraryRoutes from './routes/itineraryRoutes';
import shareRoutes from './routes/shareRoutes';
import { swaggerSpec, swaggerUi } from './config/swagger';

const app = express();

// List of allowed origins
// const allowedOrigins: string[] = [
//     'http://localhost:4200',
//     'https://jolly-glacier-0d49bc61e.4.azurestaticapps.net',
// ];
const allowedOrigins: string[] = envConfig.allowedOrigins;

// CORS configuration
const corsOptions: CorsOptions = {
    origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void,
    ) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // Allow the request
        } else {
            callback(new Error('Not allowed by CORS')); // Block the request
        }
    },
    credentials: true, // Allow cookies
};

// Connect to the database
connectDB().then((r) => console.log());

app.use(express.json()); // middleware for parsing JSON
app.use(morgan('dev')); // middleware for logging HTTP requests
app.use(cors(corsOptions)); // middleware for enabling CORS
app.use(cookieParser());

// Serve static files from the 'uploads' directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Serve static files for images and PDFs
app.use(
    '/uploads/images',
    express.static(path.join(__dirname, '../uploads/images')),
);
app.use(
    '/uploads/pdfs',
    express.static(path.join(__dirname, '../uploads/pdfs')),
);

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define a route
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/place', placeRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/share', shareRoutes);

// Catch-all route for 404 Not Found
// app.all('*', (req, res) => {
//     res.status(404).send('404 Not Found');
// });

// OR can use middleware to create a more detailed or custom "not found" page:
app.use(routeNotFoundHandler);
app.use(errorHandler);

// Start the server
const PORT = envConfig.port;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
