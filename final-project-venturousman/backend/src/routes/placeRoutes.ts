import express from 'express';
import { search } from '../controllers/placeController';

const router = express.Router();
router.get('/search', search);

export default router;
