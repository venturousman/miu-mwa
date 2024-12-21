import express from 'express';
import { createUser, getUsers } from '../controllers/userController';
import { validateRequest } from '../middlewares/validationMiddleware';
import { createUserSchema } from '../validations/userValidation';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();
router.get('/', authMiddleware, getUsers);
// router.get('/:id', getUser);
router.post('/', validateRequest(createUserSchema), createUser);
// router.put('/:id', updateUser);
// router.delete('/:id', deleteUser);

export default router;
