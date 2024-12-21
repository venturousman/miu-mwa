import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
    friendly,
    keypoints,
    professional,
    proofread,
    summarize,
} from './controllers/question2Controller';
import { weather } from './controllers/question3Controller';

dotenv.config();

const app = express();

app.use(express.json()); // middleware for parsing JSON

// Define a route
app.post('/api/proofread', proofread);
app.post('/api/friendly', friendly);
app.post('/api/professional', professional);
app.post('/api/summarize', summarize);
app.post('/api/keypoints', keypoints);
app.post('/api/weather', weather);

// Catch-all route for 404 Not Found
app.all('*', (req, res) => {
    res.status(404).send('404 Not Found');
});

// OR can use middleware to create a more detailed or custom "not found" page:
// TODO: Add error handling middleware
// app.use(notFoundHandler);
// app.use(errorHandler);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
