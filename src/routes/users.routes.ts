import express from 'express';
import userController from './../controller/users/users.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(authMiddleware, userController.getAllUser);

router.use(authMiddleware);
router.route('/:username').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

export default router;
