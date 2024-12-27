import express from 'express';
import authController from '../controller/auth/auth.controller';
import { validateData } from '../middleware/validateDataMiddleware.ts';
import { LoginSchema, RegisterUserSchema } from '../controller/auth/schema/auth.schema';

const router = express.Router();

router.route('/login').post(validateData(LoginSchema), authController.login);
router.route('/register-user').post(validateData(RegisterUserSchema), authController.registerUser);

export default router;
