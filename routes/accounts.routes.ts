import express from 'express';
import accountController from '../controller/accounts.controller';

const router = express.Router();

router.route('/').get(accountController.getAccount).post(accountController.createAccount);

export default router;
