import { RequestHandler } from 'express';
import userService from '../services/userService';

export const getUsers: RequestHandler = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const users = await userService.getUsers(page, limit);
        res.status(200).json(users);
    } catch (error) {
        console.log('userController getUsers error:', error);
        next(error);
    }
};

export const createUser: RequestHandler = async (req, res, next) => {
    console.log('userController createUser:', req.body);
    // if (!req.body) {
    //     res.status(400).send({ message: 'Body can not be empty!' });
    //     return;
    // }
    try {
        const { fullname, email, password, picture_url } = req.body;
        const user = await userService.createUser(
            fullname,
            email,
            password,
            picture_url,
        );
        res.status(201).json(user);
    } catch (error) {
        console.log('userController createUser error:', error);
        next(error);
    }
};
