import { RequestHandler } from 'express';
import diaryService from '../services/diaryService';

export const getDiaries: RequestHandler = async (req, res, next) => {
    try {
        // TODO: get only diaries of user_id from the request token
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const diaries = await diaryService.getDiaries(page, limit);
        res.status(200).json(diaries);
    } catch (error) {
        console.log('diaryController getDiaries error:', error);
        next(error);
    }
};

export const getDiary: RequestHandler = (req, res) => {
    // TODO: get only diaries of user_id from the request token
    console.log(req.params);
    res.send('Get diary');
};

export const createDiary: RequestHandler = async (req, res, next) => {
    console.log('diaryController createDiary:', req.body);
    // if (!req.body) {
    //     res.status(400).send({ message: 'Body can not be empty!' });
    //     return;
    // }
    try {
        // TODO: get user_id from the request token
        const { user_id, title, description } = req.body;
        const diary = await diaryService.createDiary(
            user_id,
            title,
            description,
        );
        res.status(201).json(diary);
    } catch (error) {
        console.log('diaryController createDiary error:', error);
        next(error);
    }
};

export const updateDiary: RequestHandler = (req, res) => {
    res.send('Update diary');
};

export const deleteDiary: RequestHandler = (req, res) => {
    res.send('Delete diary');
};
