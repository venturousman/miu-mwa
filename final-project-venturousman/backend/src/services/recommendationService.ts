import { Schema } from 'mongoose';
import {
    Recommendation,
    RecommendationContext,
    RecommendationModel,
} from '../models/recommendationModel';

async function create(
    destination: string,
    longitude: number,
    latitude: number,
    startDate: string,
    endDate: string,
    preferences: string | undefined = undefined,
    context: RecommendationContext[] | undefined = undefined,
    userId: string | undefined = undefined,
) {
    return RecommendationModel.create({
        destination,
        longitude,
        latitude,
        startDate,
        endDate,
        preferences,
        context,
        userId,
    });
}

async function getById(id: string) {
    return RecommendationModel.findById(id);
}

async function getByUserId(userId: string) {
    return RecommendationModel.find({ userId });
}

async function updateById(id: string, recommendation: Recommendation) {
    return RecommendationModel.updateOne({ _id: id }, recommendation);
}

export default {
    create,
    getById,
    getByUserId,
    updateById,
};
