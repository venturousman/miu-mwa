import express from 'express';
import {
    refreshToken,
    signin,
    signout,
    signup,
} from '../controllers/authController';
import { validateRequest } from '../middlewares/validationMiddleware';
import {
    signinValidationSchema,
    signupValidationSchema,
} from '../validations/authValidation';
import { imageUpload } from '../config/fileUpload';

const router = express.Router();
router.post('/signin', validateRequest(signinValidationSchema), signin);
router.post(
    '/signup',
    validateRequest(signupValidationSchema),
    imageUpload.single('profile_picture'),
    signup,
);
router.post('/refresh-token', refreshToken);
router.post('/signout', signout);

export default router;
