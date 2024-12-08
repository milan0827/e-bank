import express from 'express';
import userController from './../controller/users/users.controller';

const router = express.Router();

router.route('/').post(userController.createUser).get(userController.getAllUser);

router.route('/:username').get(userController.getUser);

export default router;
