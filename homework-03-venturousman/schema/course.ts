import { Schema, model, InferSchemaType } from 'mongoose';

const fileSchema = new Schema({
    originalname: { type: String, required: true },
    mimetype: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
});

const questionSchema = new Schema({
    question: { type: String, required: true },
    due_date: { type: Number, default: () => Date.now() + 86400000 },
});

const lectureSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    files: [fileSchema],
    questions: [questionSchema],
});

const courseSchema = new Schema(
    {
        code: { type: String, required: true },
        title: { type: String, required: true },
        created_by: {
            user_id: Schema.Types.ObjectId,
            fullname: String,
            email: String,
        },
        lectures: [lectureSchema],
    },
    { versionKey: false },
);

export type Course = InferSchemaType<typeof courseSchema>;
export type Lecture = InferSchemaType<typeof lectureSchema>;
export type File = InferSchemaType<typeof fileSchema>;
export type Question = InferSchemaType<typeof questionSchema>;

export default model<Course>('course', courseSchema);
