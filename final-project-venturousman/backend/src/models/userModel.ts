import { Schema, model, InferSchemaType, pluralize } from 'mongoose';

pluralize(null);

export const userSchema = new Schema(
    {
        fullname: String,
        email: { type: String, unique: true, required: true, index: true },
        password: { type: String, required: true },
        picture_url: String,
        // savedItineraries: [Schema.Types.ObjectId], // necessary ??
        // preferences: {
        //     travelStyles: [String], // e.g., ["Adventure", "Luxury", "Family"]
        //     budget: Number, // Daily budget
        //     preferredActivities: [String], // e.g., ["Hiking", "Museum", "Shopping"]
        //     dietaryRestrictions: [String], // e.g., ["Vegetarian", "Gluten-free"]
        // },
    },
    { timestamps: true },
);

type UserWithTimestamps = InferSchemaType<typeof userSchema>;
export type User = Partial<UserWithTimestamps>;

// export type User = InferSchemaType<typeof userSchema>;

export const UserModel = model<User>('user', userSchema);
