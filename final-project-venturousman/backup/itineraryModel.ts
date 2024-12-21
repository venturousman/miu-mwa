import { Schema, model, InferSchemaType, pluralize } from 'mongoose';
import { destinationSchema } from './destinationModel';

pluralize(null);

export const activitySchema = new Schema({
    time: String, // e.g., "10:00 AM"
    type: String, // e.g., "Attraction", "Meal", "Rest"
    name: String,
    location: String,
    details: String, // e.g., "Guided tour at the museum"
});

export type Activity = InferSchemaType<typeof activitySchema>;

export const dailyPlanSchema = new Schema({
    day: Number,
    activities: [activitySchema],
    // weather: {
    //     temperature: Number, // Predicted temperature for the day
    //     conditions: String, // e.g., "Sunny", "Rainy"
    // },
});

export type DailyPlan = InferSchemaType<typeof dailyPlanSchema>;

export const itinerarySchema = new Schema(
    {
        userId: Schema.Types.ObjectId, // References Users
        destinationId: Schema.Types.ObjectId, // References Destinations OR nested destinations ??
        // destinations: [destinationSchema], // Nested destinations
        title: String, // Custom title for the itinerary
        startDate: Date,
        endDate: Date,
        dailyPlan: [dailyPlanSchema],
        estimatedCost: Number,
        // sharedWith: [String], // Emails of friends the itinerary is shared with
    },
    { timestamps: true },
);

type ItineraryWithTimestamps = InferSchemaType<typeof itinerarySchema>;
export type Itinerary = Partial<ItineraryWithTimestamps>;

export const ItineraryModel = model<Itinerary>('itinerary', itinerarySchema);
