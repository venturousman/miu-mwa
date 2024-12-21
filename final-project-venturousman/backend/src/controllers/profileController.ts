import { RequestHandler } from 'express';
import userService from '../services/userService';
import UserViewModel from '../models/userViewModel';
import { ErrorWithStatus } from '../models/errorWithStatus';
import { StandardResponse } from '../models/standardResponse';
import bcrypt from 'bcrypt';
import { User } from '../models/userModel';

// export const getUsers: RequestHandler = async (req, res, next) => {
//     try {
//         const page = parseInt(req.query.page as string) || 1;
//         const limit = parseInt(req.query.limit as string) || 10;
//         const users = await userService.getUsers(page, limit);
//         res.status(200).json(users);
//     } catch (error) {
//         console.log('userController getUsers error:', error);
//         next(error);
//     }
// };

export const getProfile: RequestHandler = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        // console.log('### userController getUserById:', user);
        if (!user) {
            throw new ErrorWithStatus('User not found', 404);
        }
        const userVM: UserViewModel = {
            id: user._id.toString(),
            fullname: user.fullname,
            email: user.email!,
            avatar: user.picture_url,
        };
        res.status(200).json(userVM);
    } catch (error) {
        console.log('userController getUserById error:', error);
        next(error);
    }
};

export const updateProfile: RequestHandler<
    any,
    StandardResponse<number>,
    any
> = async (req, res, next) => {
    try {
        console.log('### userController updateProfileById:', req.body);
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            throw new ErrorWithStatus('User not found', 404);
        }
        const { fullname, password } = req.body;

        const picture_url = req.file?.path || ''; // '/images/default.jpg';
        const updateData: User = { fullname };

        if (password && password.length > 0) {
            const encryptedPassword = await bcrypt.hash(password, 10);
            updateData.password = encryptedPassword;
        }
        if (picture_url && picture_url.length > 0) {
            updateData.picture_url = picture_url;
        }
        const result = await userService.updateUserById(
            req.params.id,
            updateData,
        );
        res.status(200).json({ success: true, data: result.modifiedCount });
    } catch (error) {
        console.log('userController updateProfileById error:', error);
        next(error);
    }
};

export const deleteProfile: RequestHandler<
    any,
    StandardResponse<number>,
    any
> = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            throw new ErrorWithStatus('User not found', 404);
        }
        const result = await userService.deleteUserById(req.params.id);
        // console.log('### userController deleteProfile:', result);
        res.status(200).json({ success: true, data: result.deletedCount });
    } catch (error) {
        console.log('userController deleteProfile error:', error);
        next(error);
    }
};
