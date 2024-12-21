import express from 'express';
import { getByShareableId } from '../controllers/itineraryController';

const router = express.Router();
router.get('/:id', getByShareableId); // public route

export default router;
