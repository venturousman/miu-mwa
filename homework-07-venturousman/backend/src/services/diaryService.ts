import { Schema } from 'mongoose';
import { Diary, DiaryModel } from '../models/diaryModel';

async function createDiaryObject(diary: Diary) {
    return DiaryModel.create(diary);
}

async function createDiary(
    user_id: Schema.Types.ObjectId,
    title: String,
    description: String,
) {
    return DiaryModel.create({ user_id, title, description });
}

async function getDiaries(page: number = 1, limit: number = 10) {
    return DiaryModel.find()
        .skip((page - 1) * limit)
        .limit(limit);
}

async function getDiaryById(id: Schema.Types.ObjectId) {
    return DiaryModel.findById(id);
}

async function getDiariesByUserId(
    user_id: Schema.Types.ObjectId,
    page: number = 1,
    limit: number = 10,
) {
    return DiaryModel.find({ user_id })
        .skip((page - 1) * limit)
        .limit(limit);
}

async function updateDiaryById(id: Schema.Types.ObjectId, diary: Diary) {
    return DiaryModel.findByIdAndUpdate(id, diary, { new: true });
}

async function deleteDiaryById(id: Schema.Types.ObjectId) {
    return DiaryModel.findByIdAndDelete(id);
}

export default {
    createDiaryObject,
    createDiary,
    getDiaries,
    getDiaryById,
    getDiariesByUserId,
    updateDiaryById,
    deleteDiaryById,
};
