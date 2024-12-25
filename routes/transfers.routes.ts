import express from 'express';
import transferController from '../controller/transfers/transfers.controller';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.use(authMiddleware);
router.route('/').post(transferController.createTransfer).get(transferController.getAllTransfer);

router.route('/:id').get(transferController.getTransfer);

export default router;
