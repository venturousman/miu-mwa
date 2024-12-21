import { Schema, model, InferSchemaType, pluralize } from 'mongoose';

pluralize(null);

const diarySchema = new Schema(
    {
        user_id: Schema.Types.ObjectId,
        title: String,
        description: String,
    },
    {
        timestamps: true,
    },
);

// type DiaryWithTimestamps = InferSchemaType<typeof diarySchema>;
// export type Diary = Partial<DiaryWithTimestamps>;

export type Diary = InferSchemaType<typeof diarySchema>;

export const DiaryModel = model<Diary>('diary', diarySchema);
