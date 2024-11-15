import express from 'express';
import entriesController from '../controller/entries.controller';

const router = express.Router();

router.route('/').post(entriesController.createEntry).get(entriesController.getAllEntries);

router.route('/:id').get(entriesController.getEntry);

export default router;
