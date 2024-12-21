import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { endpoint1, endpoint2 } from './controllers/newController';

dotenv.config();

const app = express();

app.use(express.json()); // middleware for parsing JSON

// Define a route
app.post('/api/endpoint1', endpoint1);
app.post('/api/endpoint2', endpoint2);

// Catch-all route for 404 Not Found
app.all('*', (req, res) => {
    res.status(404).send('404 Not Found');
});

// OR can use middleware to create a more detailed or custom "not found" page:
// Add error handling middleware
// app.use(notFoundHandler);
// app.use(errorHandler);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
