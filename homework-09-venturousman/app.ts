import dotenv from 'dotenv';
import OpenAI from 'openai';
import fs from 'fs/promises';
import mongoose, { Schema } from 'mongoose';
import MovieModel from './schema/movie';

dotenv.config();

const token = process.env.GITHUB_TOKEN;
const endpoint = 'https://models.inference.ai.azure.com';
const model = 'gpt-4o-mini';
const openai = new OpenAI({ baseURL: endpoint, apiKey: token });

async function readJsonFile(filePath: string) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const jsonArray = JSON.parse(data);
        // console.log('Array of objects:', jsonArray);
        return jsonArray;
    } catch (err) {
        console.error('Error reading or parsing the file:', err);
    }
    return [];
}

async function embedding(content: string) {
    try {
        const embedding = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: content,
            encoding_format: 'float',
        });

        return embedding;
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        throw new Error('Failed to process request');
    }
}

type Movie = {
    name: string;
    description: string;
    embedding: number[];
};

main().catch((err) => console.log(err));

async function main() {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
        throw new Error('MongoDB URL is not provided');
    }
    await mongoose.connect(mongoUrl);
    console.log('Connected to MongoDB');

    if (!token) {
        throw new Error('GITHUB_TOKEN is not set');
    }

    // NOTE: Uncomment the following code to run the question 1 and 2
    /*
    const readData = await readJsonFile('movies.json');

    const movies: Movie[] = [];
    for (const movie of readData) {
        const content = movie.description;
        const result = await embedding(content); // question 1
        const newMovie = { ...movie, embedding: result.data[0].embedding };
        movies.push(newMovie);
        await MovieModel.create(newMovie); // question 2
    }
    */
    // console.log(movies);
    // console.log('Movies are saved to MongoDB');

    // question 3: do on Atlas
    // 1. Go to Atlas Search
    // 2. Click button Create Search Index
    // 3. Atlas Vector Search > JSON Editor > Next
    // 4. Select the database and collection
    // 5. Input field name, similarity, and numDimensions > Next
    // ex:{
    //     "fields": [
    //       {
    //         "numDimensions": 1536,
    //         "path": "embedding",
    //         "similarity": "cosine",
    //         "type": "vector"
    //       }
    //     ]
    //   }

    // question 4
    const movie = await MovieModel.findOne({ name: 'The Godfather' });
    // console.log('Movie:', movie);

    const queryVector = movie?.embedding || [];

    const result = await MovieModel.aggregate([
        {
            $vectorSearch: {
                index: 'vector_index',
                path: 'embedding',
                queryVector: queryVector,
                numCandidates: 20,
                limit: 5,
            },
        },
        {
            $project: { _id: 0, embedding: 0 },
        },
    ]);
    console.log('vector search result: ', result);

    console.log('The end!');
}
