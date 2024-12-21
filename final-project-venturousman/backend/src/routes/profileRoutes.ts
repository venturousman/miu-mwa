import express from 'express';
import {
    deleteProfile,
    getProfile,
    updateProfile,
} from '../controllers/profileController';
import { validateRequest } from '../middlewares/validationMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';
import { currentUserMiddleware } from '../middlewares/currentUserMiddleware';
import { updateProfileSchema } from '../validations/profileValidation';
import { imageUpload } from '../config/fileUpload';
import {
    deleteItineraries,
    getMyItineraries,
    getMySharedItineraries,
    unshareItineraries,
} from '../controllers/itineraryController';

const router = express.Router();
// router.get('/', authMiddleware, getUsers);
router.get('/:id', authMiddleware, currentUserMiddleware, getProfile);
router.get(
    '/:id/itineraries',
    authMiddleware,
    currentUserMiddleware,
    getMyItineraries,
);
router.get(
    '/:id/shared-itineraries',
    authMiddleware,
    currentUserMiddleware,
    getMySharedItineraries,
);
router.put(
    '/:id',
    authMiddleware,
    currentUserMiddleware,
    validateRequest(updateProfileSchema),
    imageUpload.single('profile_picture'),
    updateProfile,
);
router.delete('/:id', authMiddleware, currentUserMiddleware, deleteProfile);
router.delete(
    '/:id/itineraries',
    authMiddleware,
    currentUserMiddleware,
    deleteItineraries,
);
router.post(
    '/:id/itineraries/unshare',
    authMiddleware,
    currentUserMiddleware,
    unshareItineraries,
);

export default router;
