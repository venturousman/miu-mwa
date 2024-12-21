import express from 'express';
import {
    createDiary,
    deleteDiary,
    getDiaries,
    getDiary,
    updateDiary,
} from '../controllers/diaryController';
import { validateRequest } from '../middlewares/validationMiddleware';
import { createDiarySchema } from '../validations/diaryValidation';

const router = express.Router();
router.get('/', getDiaries);
router.get('/:id', getDiary);
router.post('/', validateRequest(createDiarySchema), createDiary);
router.put('/:id', updateDiary);
router.delete('/:id', deleteDiary);

export default router;
