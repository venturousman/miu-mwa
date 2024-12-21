// swagger.js
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { envConfig } from './environment';

// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'This is the API documentation for my project.',
    },
    servers: [
        {
            url: envConfig.url, // Replace with your server's URL
        },
    ],
};

// Options for swagger-jsdoc
const options: swaggerJsdoc.Options = {
    definition: swaggerDefinition,
    apis: ['./src/routes/*.ts'], // Path to the API docs
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
