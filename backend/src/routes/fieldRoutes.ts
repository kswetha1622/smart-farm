import { Router } from 'express';
import { protect } from '../middleware/auth';
import { createField, getFields, getFieldById, updateField, deleteField } from '../controllers/fieldController';

const router = Router();

router.use(protect);

router.post('/', createField);
router.get('/', getFields);
router.get('/:id', getFieldById);
router.put('/:id', updateField);
router.delete('/:id', deleteField);

export default router;
