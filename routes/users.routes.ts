import express from 'express';
import userController from './../controller/users/users.controller';
import { login } from '../controller/auth/auth.controller';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.route('/login').post(login);

router.route('/').post(userController.createUser).get(authMiddleware, userController.getAllUser);

router.use(authMiddleware);
router.route('/:username').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

export default router;
