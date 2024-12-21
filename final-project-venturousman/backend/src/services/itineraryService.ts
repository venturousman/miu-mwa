import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Itinerary, ItineraryModel } from '../models/itineraryModel';

async function create(
    destination: string,
    longitude: number,
    latitude: number,
    startDate: string,
    endDate: string,
    preferences: string | null = null,
    userId: string | null = null,
    recommendationId: string | null = null,
    content: string | null = null,
) {
    const shareableId = uuidv4();
    return ItineraryModel.create({
        destination,
        longitude,
        latitude,
        startDate,
        endDate,
        preferences,
        userId,
        recommendationId,
        shareableId,
        isShared: false,
        content,
    });
}

async function getById(id: string) {
    return ItineraryModel.findById(id);
}

async function getByShareableId(shareableId: string) {
    return ItineraryModel.findOne({ shareableId });
}

async function getByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10,
) {
    const skip = (page - 1) * limit;
    return ItineraryModel.find({ userId }).skip(skip).limit(limit);
}

async function countByUserId(userId: string) {
    return ItineraryModel.countDocuments({ userId });
}

async function getByRecommendationId(recommendationId: string) {
    return ItineraryModel.find({ recommendationId });
}

async function updateById(id: string, itinerary: Itinerary) {
    return ItineraryModel.updateOne({ _id: id }, itinerary);
}

// async function share(shareableId: string) {
//     return ItineraryModel.updateOne({ shareableId }, { isShared: true });
// }

// async function unshare(shareableId: string) {
//     return ItineraryModel.updateOne({ shareableId }, { isShared: false });
// }

async function unshareByUserId(userId: string) {
    return ItineraryModel.updateMany({ userId }, { isShared: false });
}

async function getSharedlistByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10,
) {
    const skip = (page - 1) * limit;
    return ItineraryModel.find({ userId, isShared: true })
        .skip(skip)
        .limit(limit);
}

async function countSharedlistByUserId(userId: string) {
    return ItineraryModel.countDocuments({ userId, isShared: true });
}

async function deleteById(id: string) {
    return ItineraryModel.deleteOne({ _id: id });
}

async function deleteByUserId(userId: string) {
    return ItineraryModel.deleteMany({ userId });
}

export default {
    create,
    getById,
    getByShareableId,
    getByUserId,
    countByUserId,
    getByRecommendationId,
    updateById,
    // share,
    // unshare,
    unshareByUserId,
    getSharedlistByUserId,
    countSharedlistByUserId,
    deleteById,
    deleteByUserId,
};
