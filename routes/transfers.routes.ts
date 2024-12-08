import express from 'express';
import transferController from '../controller/transfers/transfers.controller';

const router = express.Router();

router.route('/').post(transferController.createTransfer).get(transferController.getAllTransfer);

router.route('/:id').get(transferController.getTransfer);

export default router;
