import { Schema, model, InferSchemaType, pluralize } from 'mongoose';
import { itinerarySchema } from './itineraryModel';

pluralize(null);

export const recommendationContextSchema = new Schema({
    role: String, // 'system', 'user', or 'assistant'
    content: String, // Message content or answer
});

export type RecommendationContext = InferSchemaType<
    typeof recommendationContextSchema
>;

// AI generated recommendation schema
export const recommendationSchema = new Schema(
    {
        destination: { type: String, required: true },
        longitude: { type: Number, required: true },
        latitude: { type: Number, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        preferences: { type: String },
        // hotels: String,
        // restaurants: String,
        // attractions: String,
        // weather: String,
        context: [recommendationContextSchema], // Array to store messages
        userId: Schema.Types.ObjectId, // References Users
    },
    { timestamps: true },
);

recommendationSchema.index({ userId: 1 });

type RecommendationWithTimestamps = InferSchemaType<
    typeof recommendationSchema
>;
export type Recommendation = Partial<RecommendationWithTimestamps>;

export const RecommendationModel = model<Recommendation>(
    'recommendation',
    recommendationSchema,
);
