import express from 'express';
import accountController from '../controller/accounts.controller';

const router = express.Router();

router.route('/').post(accountController.createAccount).get(accountController.getAllAccounts);

router.route('/:id').get(accountController.getAccount).patch(accountController.updateBalance).delete(accountController.deleteAccount);

export default router;
