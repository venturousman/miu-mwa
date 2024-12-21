import { Schema, model, InferSchemaType } from 'mongoose';

const userSchema = new Schema(
    {
        fullname: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        location: { type: [Number], required: false, index: '2d' },
        hobbies: { type: [String], required: false },
    },
    { versionKey: false },
);

export type User = InferSchemaType<typeof userSchema>;

export default model<User>('user', userSchema);
