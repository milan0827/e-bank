import express from 'express';
import accountController from '../controller/accounts/accounts.controller';
import { validateData } from '../middleware/validateDataMiddleware.ts';
import { CreateAccountSchema } from '../controller/accounts/schema/accounts.schema';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authMiddleware);
router.route('/').post(validateData(CreateAccountSchema), accountController.createAccount).get(accountController.getAllAccounts);

router.route('/:id').get(accountController.getAccount).patch(accountController.updateBalance).delete(accountController.deleteAccount);

export default router;
