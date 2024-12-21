import { Schema, InferSchemaType, model } from "mongoose";

const CommentSchema = new Schema({
    text: { type: String, required: true },
    user: {
        email: { type: String, required: true },
        name: { type: String, required: true }
    },
}, { timestamps: true });

const PostSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    draft: { type: Boolean, default: true },
    comments: [CommentSchema],
}, { timestamps: true });

type PostWithTimestamps = InferSchemaType<typeof PostSchema>;
type CommentWithTimestamps = InferSchemaType<typeof CommentSchema>;

export type Post = Partial<PostWithTimestamps>;
export type Comment = Partial<CommentWithTimestamps>;
export const PostModel = model<Post>('post', PostSchema);