import { Schema, model, InferSchemaType, pluralize } from 'mongoose';
import { userSchema } from './userModel';

pluralize(null);

const blacklistSchema = new Schema(
    {
        jti: { type: String, required: true, unique: true }, // Token identifier
        userId: { type: Schema.Types.ObjectId }, // Optional: User reference
        // user: userSchema, // Optional: User object
        reason: { type: String }, // Optional: Reason for blacklisting
        expiresAt: { type: Date, required: true }, // Expiration time
    },
    { timestamps: true },
);

blacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Automatically delete expired documents

blacklistSchema.index({ jti: 1 }); // Index for faster lookups by token identifier

type BlacklistWithTimestamps = InferSchemaType<typeof blacklistSchema>;
export type Blacklist = Partial<BlacklistWithTimestamps>;

export const BlacklistModel = model<Blacklist>('blacklist', blacklistSchema);
