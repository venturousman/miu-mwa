import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import aiService from '../services/aiService';
import itineraryService from '../services/itineraryService';
import { ErrorWithStatus } from '../models/errorWithStatus';
import { StandardResponse } from '../models/standardResponse';
import CustomRequest from '../models/customRequest';
import { envConfig } from '../config/environment';
import ItineraryViewModel from '../models/itineraryViewModel';
import { PaginationResponse } from '../models/paginationResponse';

export const recommend: RequestHandler = async (
    req: CustomRequest,
    res,
    next,
) => {
    try {
        // console.log('### userController recommend:', req.body, req.user);
        const { destination, lon, lat, startDate, endDate, preferences } =
            req.body;

        // support to generate itinerary for anonymous user and logged in user
        // let userId = undefined;
        // const authHeader = req.headers['authorization'];
        // const token = authHeader && authHeader.split(' ')[1];
        // if (token) {
        //     try {
        //         const decoded = jwt.verify(
        //             token,
        //             envConfig.accessTokenSecret,
        //         ) as jwt.JwtPayload;
        //         userId = decoded.userId;
        //     } catch (error) {
        //         // in case of invalid token, dont stop the process
        //         console.error('userController getUsers error:', error);
        //     }
        // }

        const result = await aiService.recommend(
            destination,
            lon,
            lat,
            startDate,
            endDate,
            preferences,
            // userId,
        );
        res.status(200).json(result);
    } catch (error) {
        console.error('userController getUsers error:', error);
        next(error);
    }
};

export const save: RequestHandler<any, StandardResponse<number>, any> = async (
    req: CustomRequest,
    res,
    next,
) => {
    try {
        console.log('### userController save itinerary:', req.params, req.user);
        const { id } = req.params; // id is itineraryId
        const itinerary = await itineraryService.getById(id);
        if (!itinerary) {
            throw new ErrorWithStatus('Itinerary not found', 404);
        }
        const currentUser = req.user as jwt.JwtPayload;
        if (
            itinerary.userId &&
            itinerary.userId.toString() !== currentUser.userId
        ) {
            throw new ErrorWithStatus('Itinerary belongs to other user', 401); // not allowed to update, belong to other user
        }
        itinerary.userId = currentUser.userId; // update
        const result = await itineraryService.updateById(id, itinerary);
        res.status(200).json({ success: true, data: result.modifiedCount });
    } catch (error) {
        console.log('userController save itinerary error:', error);
        next(error);
    }
};

export const share: RequestHandler<any, StandardResponse<string>, any> = async (
    req: CustomRequest,
    res,
    next,
) => {
    try {
        const { id } = req.params; // id is itineraryId
        const itinerary = await itineraryService.getById(id);
        if (!itinerary) {
            throw new ErrorWithStatus('Itinerary not found', 404);
        }
        const currentUser = req.user as jwt.JwtPayload;
        if (
            itinerary.userId &&
            itinerary.userId.toString() !== currentUser.userId
        ) {
            throw new ErrorWithStatus('Itinerary belongs to other user', 401); // not allowed to update, belong to other user
        }

        const shareableId = itinerary.shareableId || uuidv4();
        // update itinerary
        itinerary.isShared = true;
        if (!itinerary.userId) itinerary.userId = currentUser.userId;
        if (!itinerary.shareableId) itinerary.shareableId = shareableId;

        itineraryService.updateById(id, itinerary); // dont wait

        res.status(200).json({ success: true, data: shareableId }); // create new sharedlist successfully
    } catch (error) {
        console.log('userController share itinerary error:', error);
        next(error);
    }
};

export const getMyItineraries: RequestHandler<
    any,
    PaginationResponse<ItineraryViewModel>,
    any
> = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const { id: userId } = req.params; // id is userId
        const itineraries = await itineraryService.getByUserId(
            userId,
            page,
            limit,
        );
        const total = await itineraryService.countByUserId(userId);
        // map to view model
        const itinerariesVM = itineraries.map((itinerary) => {
            const startDate = itinerary.startDate?.toISOString();
            const endDate = itinerary.endDate?.toISOString();
            return {
                id: itinerary._id.toString(),
                destination: itinerary.destination,
                longitude: itinerary.longitude,
                latitude: itinerary.latitude,
                startDate,
                endDate,
                preferences: itinerary.preferences,
                userId: itinerary.userId?.toString(),
                recommendationId: itinerary.recommendationId?.toString(),
                shareableId: itinerary.shareableId?.toString(),
                title: `${itinerary.destination} (${startDate} - ${endDate})`,
                // content: itinerary.content,
            } as ItineraryViewModel;
        });
        res.status(200).json({ total, items: itinerariesVM, page, limit });
    } catch (error) {
        console.log('userController getMyItineraries error:', error);
        next(error);
    }
};

export const getMySharedItineraries: RequestHandler<
    any,
    PaginationResponse<ItineraryViewModel>,
    any
> = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const { id: userId } = req.params; // id is userId
        const sharedlist = await itineraryService.getSharedlistByUserId(
            userId,
            page,
            limit,
        );
        const total = await itineraryService.countSharedlistByUserId(userId);
        // map to view model
        const itinerariesVM = sharedlist.map((itinerary) => {
            const startDate = itinerary.startDate?.toISOString();
            const endDate = itinerary.endDate?.toISOString();
            return {
                id: itinerary._id.toString(),
                destination: itinerary.destination,
                longitude: itinerary.longitude,
                latitude: itinerary.latitude,
                startDate,
                endDate,
                preferences: itinerary.preferences,
                userId: itinerary.userId?.toString(),
                recommendationId: itinerary.recommendationId?.toString(),
                shareableId: itinerary.shareableId?.toString(),
                title: `${itinerary.destination} (${startDate} - ${endDate})`,
                // content: itinerary.content,
            } as ItineraryViewModel;
        });
        res.status(200).json({ total, items: itinerariesVM, page, limit });
    } catch (error) {
        console.log('userController getMySharedItineraries error:', error);
        next(error);
    }
};

export const getById: RequestHandler = async (
    req: CustomRequest,
    res,
    next,
) => {
    try {
        const { id } = req.params; // id is itineraryId
        const itinerary = await itineraryService.getById(id);
        if (!itinerary) {
            throw new ErrorWithStatus('Itinerary not found', 404);
        }
        const currentUser = req.user as jwt.JwtPayload;
        if (
            itinerary.userId &&
            itinerary.userId.toString() !== currentUser.userId
        ) {
            throw new ErrorWithStatus('Itinerary belongs to other user', 401); // not allowed to update, belong to other user
        }
        const startDate = itinerary.startDate?.toISOString();
        const endDate = itinerary.endDate?.toISOString();
        const itineraryVM = {
            id: itinerary._id.toString(),
            destination: itinerary.destination,
            longitude: itinerary.longitude,
            latitude: itinerary.latitude,
            startDate,
            endDate,
            preferences: itinerary.preferences,
            userId: itinerary.userId?.toString(),
            recommendationId: itinerary.recommendationId?.toString(),
            shareableId: itinerary.shareableId?.toString(),
            title: `${itinerary.destination} (${startDate} - ${endDate})`,
            content: itinerary.content,
        } as ItineraryViewModel;
        res.status(200).json(itineraryVM);
    } catch (error) {
        console.log('userController getById error:', error);
        next(error);
    }
};

export const getByShareableId: RequestHandler = async (
    req: CustomRequest,
    res,
    next,
) => {
    try {
        const { id } = req.params; // id is shareableId
        const itinerary = await itineraryService.getByShareableId(id);
        if (!itinerary) {
            throw new ErrorWithStatus('Itinerary not found', 404);
        }
        if (!itinerary.isShared) {
            throw new ErrorWithStatus('Itinerary not shared', 401);
        }
        const startDate = itinerary.startDate?.toISOString();
        const endDate = itinerary.endDate?.toISOString();
        const itineraryVM = {
            id: itinerary._id.toString(),
            destination: itinerary.destination,
            longitude: itinerary.longitude,
            latitude: itinerary.latitude,
            startDate,
            endDate,
            preferences: itinerary.preferences,
            userId: itinerary.userId?.toString(),
            recommendationId: itinerary.recommendationId?.toString(),
            shareableId: itinerary.shareableId?.toString(),
            title: `${itinerary.destination} (${startDate} - ${endDate})`,
            content: itinerary.content,
        } as ItineraryViewModel;
        res.status(200).json(itineraryVM);
    } catch (error) {
        console.log('userController getById error:', error);
        next(error);
    }
};

export const deleteById: RequestHandler<
    any,
    StandardResponse<number>,
    any
> = async (req: CustomRequest, res, next) => {
    try {
        const { id } = req.params; // id is itineraryId
        const itinerary = await itineraryService.getById(id);
        if (!itinerary) {
            throw new ErrorWithStatus('Itinerary not found', 404);
        }
        const currentUser = req.user as jwt.JwtPayload;
        if (
            itinerary.userId &&
            itinerary.userId.toString() !== currentUser.userId
        ) {
            throw new ErrorWithStatus('Itinerary belongs to other user', 401); // not allowed to update, belong to other user
        }
        const result = await itineraryService.deleteById(id);
        res.status(200).json({ success: true, data: result.deletedCount });
    } catch (error) {
        console.log('userController deleteById error:', error);
        next(error);
    }
};

export const deleteItineraries: RequestHandler<
    any,
    StandardResponse<number>,
    any
> = async (req, res, next) => {
    try {
        const { id } = req.params; // id is userId
        const result = await itineraryService.deleteByUserId(id);
        res.status(200).json({ success: true, data: result.deletedCount });
    } catch (error) {
        console.log('userController deleteItineraries error:', error);
        next(error);
    }
};

export const unshare: RequestHandler<
    any,
    StandardResponse<number>,
    any
> = async (req: CustomRequest, res, next) => {
    try {
        const { id } = req.params; // id is itineraryId
        const itinerary = await itineraryService.getById(id);
        if (!itinerary) {
            throw new ErrorWithStatus('Itinerary not found', 404);
        }
        const currentUser = req.user as jwt.JwtPayload;
        if (
            itinerary.userId &&
            itinerary.userId.toString() !== currentUser.userId
        ) {
            throw new ErrorWithStatus('Itinerary belongs to other user', 401); // not allowed to update, belong to other user
        }

        // update itinerary
        itinerary.isShared = false;
        const result = await itineraryService.updateById(id, itinerary);
        res.status(200).json({ success: true, data: result.modifiedCount });
    } catch (error) {
        console.log('userController unshare itinerary error:', error);
        next(error);
    }
};

export const unshareItineraries: RequestHandler<
    any,
    StandardResponse<number>,
    any
> = async (req, res, next) => {
    try {
        const { id } = req.params; // id is userId
        const result = await itineraryService.unshareByUserId(id);
        res.status(200).json({ success: true, data: result.modifiedCount });
    } catch (error) {
        console.log('userController unshareItineraries error:', error);
        next(error);
    }
};
