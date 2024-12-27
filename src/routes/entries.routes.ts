import express from 'express';
import entriesController from '../controller/entries/entries.controller';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.use(authMiddleware);
router.route('/').post(entriesController.createEntry).get(entriesController.getAllEntries);

router.route('/:id').get(entriesController.getEntry);

export default router;
