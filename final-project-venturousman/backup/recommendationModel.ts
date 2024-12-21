import { Schema, model, InferSchemaType, pluralize } from 'mongoose';

pluralize(null);

// AI generated recommendation schema
export const recommendationSchema = new Schema(
    {
        userId: Schema.Types.ObjectId, // References Users
        preferences: {
            travelStyles: [String],
            budget: Number,
            preferredActivities: [String],
            destination: String, // Optional, if user inputs a specific destination
        },
        recommendations: [
            {
                destinationId: Schema.Types.ObjectId, // References Destinations
                reason: String, // Optional, why the destination is recommended
            },
        ],
    },
    { timestamps: true },
);

type RecommendationWithTimestamps = InferSchemaType<
    typeof recommendationSchema
>;
export type Recommendation = Partial<RecommendationWithTimestamps>;

export const RecommendationModel = model<Recommendation>(
    'recommendation',
    recommendationSchema,
);
