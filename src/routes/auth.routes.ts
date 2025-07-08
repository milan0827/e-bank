import express from 'express';
import authController from '../controller/auth/auth.controller';
import { validateData } from '../middleware/validateDataMiddleware.ts';
import { changePasswordSchema, LoginSchema, RegisterUserSchema } from '../controller/auth/schema/auth.schema';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/login').post(validateData(LoginSchema), authController.login);
router.route('/register-user').post(validateData(RegisterUserSchema), authController.registerUser);
router.route('/change-password').post(authMiddleware, validateData(changePasswordSchema), authController.changePassword);

export default router;
