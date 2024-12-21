import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import CustomRequest from '../models/customRequest';
import { ErrorWithStatus } from '../models/errorWithStatus';

export const currentUserMiddleware: RequestHandler = async (
    req: CustomRequest,
    res,
    next,
) => {
    if (!req.user) {
        //   res.status(403).json({ message: 'Access Forbidden. Unauthorized profile access.' });
        next(
            new ErrorWithStatus(
                'Access Forbidden. Unauthorized profile access.',
                403,
            ),
        );
        return;
    }

    const { id } = req.params; // Extract the profile ID from the route params

    const currentUser = req.user as jwt.JwtPayload;
    // console.log('### currentUser:', currentUser);
    if (currentUser.userId !== id) {
        next(
            new ErrorWithStatus(
                'Access Forbidden. Unauthorized profile access.',
                403,
            ),
        );
        return;
    }

    next();
};
