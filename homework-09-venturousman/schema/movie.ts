import { Schema, model, InferSchemaType } from 'mongoose';

const movieSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    embedding: { type: [Number], required: true },
});

export type MovieSchemaType = InferSchemaType<typeof movieSchema>;

export default model<MovieSchemaType>('movie', movieSchema);
