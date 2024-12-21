import { Schema, model, InferSchemaType, pluralize } from 'mongoose';

pluralize(null);

export const itinerarySchema = new Schema(
    {
        destination: { type: String, required: true },
        longitude: { type: Number, required: true },
        latitude: { type: Number, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        preferences: { type: String },
        userId: Schema.Types.ObjectId, // References Users
        recommendationId: Schema.Types.ObjectId, // References Recommendations
        shareableId: { type: String, unique: true }, // Unique ID for sharing
        isShared: { type: Boolean, default: false },
        content: { type: String }, // Itinerary text
    },
    { timestamps: true },
);

itinerarySchema.index({ shareableId: 1, userId: 1, recommendationId: 1 });

type ItineraryWithTimestamps = InferSchemaType<typeof itinerarySchema>;
export type Itinerary = Partial<ItineraryWithTimestamps>;

export const ItineraryModel = model<Itinerary>('itinerary', itinerarySchema);
