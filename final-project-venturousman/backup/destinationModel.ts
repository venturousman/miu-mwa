import { Schema, model, InferSchemaType, pluralize } from 'mongoose';

pluralize(null);

export const coordinateSchema = new Schema({
    latitude: Number,
    longitude: Number,
});

export type Coordinate = InferSchemaType<typeof coordinateSchema>;

export const popularAttractionSchema = new Schema({
    name: String,
    description: String,
    coordinates: coordinateSchema,
    averageCost: Number, // Optional, cost for entry or activity
});

popularAttractionSchema.index({ name: 1, coordinates: '2d' }); // query by name and coordinates ??

export type PopularAttraction = InferSchemaType<typeof popularAttractionSchema>;

export const restaurantSchema = new Schema({
    name: String,
    cuisine: [String], // e.g., ["Italian", "Seafood"]
    averageCostPerMeal: Number,
    coordinates: coordinateSchema,
    rating: Number, // 1-5 scale
});

restaurantSchema.index({ name: 1, coordinates: '2d' }); // query by name and coordinates ??

export type Restaurant = InferSchemaType<typeof restaurantSchema>;

export const accommodationSchema = new Schema({
    name: String,
    type: String, // e.g., "Hotel", "Hostel", "Airbnb"
    pricePerNight: Number,
    coordinates: coordinateSchema,
    rating: Number, // 1-5 scale
    // allowsPets: Boolean, // Indicates if pets are allowed ?? not sure api response will have this
    // amenities: [String], // e.g., ["WiFi", "Pool", "Free Breakfast"]
});

accommodationSchema.index({ name: 1, coordinates: '2d' }); // query by name and coordinates ??

export type Accommodation = InferSchemaType<typeof accommodationSchema>;

export const destinationSchema = new Schema(
    {
        name: String,
        country: String,
        coordinates: coordinateSchema,
        description: String,
        popularAttractions: [popularAttractionSchema],
        restaurants: [restaurantSchema],
        accommodations: [accommodationSchema],
        images: [String], // URLs of images
        bestTravelSeason: [String], // e.g., ["Spring", "Summer"]
    },
    { timestamps: true },
);

destinationSchema.index({ name: 1, coordinates: '2d' });

type DestinationWithTimestamps = InferSchemaType<typeof destinationSchema>;
export type Destination = Partial<DestinationWithTimestamps>;

export const DestinationModel = model<Destination>(
    'destination',
    destinationSchema,
);
