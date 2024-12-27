import express from 'express';
import transferController from '../controller/transfers/transfers.controller';
import authMiddleware from '../middleware/auth';
import { validateData } from '../middleware/validateData';
import { CreateTransferSchema } from '../controller/transfers/schema/transfers.schema';

const router = express.Router();

router.use(authMiddleware);
router.route('/').post(validateData(CreateTransferSchema), transferController.createTransfer).get(transferController.getAllTransfer);

router.route('/:accountId').get(transferController.getOneAccountTransfers);
router.route('/:id').get(transferController.getTransfer);

export default router;
