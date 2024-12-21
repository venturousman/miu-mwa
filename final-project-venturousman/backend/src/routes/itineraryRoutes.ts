import express from 'express';
import { validateRequest } from '../middlewares/validationMiddleware';
import { recommendItineraryValidationSchema } from '../validations/itineraryValidation';
import {
    deleteById,
    getById,
    recommend,
    save,
    share,
    unshare,
} from '../controllers/itineraryController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * /api/itiinerary/recommend:
 *   post:
 *     summary: Generate/Recommend an itinerary endpoint
 *     description: Returns a travel itinerary.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: string
 *                   example: "Travel itinerary for New York city..."
 *                 recommendationId:
 *                   type: string
 *                   example: "60b3b3b3b3b3b3b3b3b3b3b3"
 *                 itineraryId:
 *                   type: string
 *                   example: "60b3b3b3b3b3b3b3b3b3b3"
 */
router.post(
    '/recommend',
    // authMiddleware,
    validateRequest(recommendItineraryValidationSchema),
    recommend,
);
/**
 * @swagger
 * /api/itinerary/{id}/save:
 *   post:
 *     summary: Save an itinerary endpoint
 *     description: Returns the modified count.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 modifiedCount:
 *                   type: number
 *                   example: 1
 */
router.post('/:id/save', authMiddleware, save);
/**
 * @swagger
 * /api/itinerary/{id}/share:
 *   post:
 *     summary: Share an itinerary endpoint
 *     description: Returns the shareable id.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 shareableId:
 *                   type: string
 *                   example: "60b3b3b3b3b3b3b3b3b3b3"
 */
router.post('/:id/share', authMiddleware, share);
/**
 * @swagger
 * /api/itinerary/{id}/unshare:
 *   post:
 *     summary: Unshare an itinerary endpoint
 *     description: Returns the modified count.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 modifiedCount:
 *                   type: number
 *                   example: 1
 */
router.post('/:id/unshare', authMiddleware, unshare);
/**
 * @swagger
 * /api/itinerary/{id}:
 *   get:
 *     summary: Get an itinerary by id endpoint
 *     description: Returns an itinerary.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "60b3b3b3b3b3b3b3b3b3b3"
 *                 destination:
 *                   type: string
 *                   example: "New York City"
 *                 longitude:
 *                   type: number
 *                   example: -74.006
 *                 latitude:
 *                   type: number
 *                   example: 40.7128
 *                 startDate:
 *                   type: string
 *                   example: "2022-06-01"
 *                 endDate:
 *                   type: string
 *                   example: "2022-06-07"
 *                 preferences:
 *                   type: string
 *                   example: "travel group size = 4, budget = $1000"
 *                 title:
 *                   type: string
 *                   example: "New York City Itinerary"
 */
router.get('/:id', authMiddleware, getById);
/**
 * @swagger
 * /api/itinerary/{id}:
 *   delete:
 *     summary: Delete an itinerary endpoint
 *     description: Returns the deleted count.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 deletedCount:
 *                   type: number
 *                   example: 1
 */
router.delete('/:id', authMiddleware, deleteById);

export default router;
