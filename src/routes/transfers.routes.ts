import express from 'express';
import transferController from '../controller/transfers/transfers.controller';
import { validateData } from '../middleware/validateDataMiddleware.ts';
import { CreateTransferSchema } from '../controller/transfers/schema/transfers.schema';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authMiddleware);
router.route('/').post(validateData(CreateTransferSchema), transferController.createTransfer).get(transferController.getAllTransfer);

router.route('/:accountId').get(transferController.getOneAccountTransfers);
router.route('/:id').get(transferController.getTransfer);

export default router;
