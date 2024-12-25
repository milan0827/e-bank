import express from 'express';
import accountController from '../controller/accounts/accounts.controller';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.use(authMiddleware);
router.route('/').post(accountController.createAccount).get(accountController.getAllAccounts);

router.route('/:id').get(accountController.getAccount).patch(accountController.updateBalance).delete(accountController.deleteAccount);

export default router;
