import { Router } from 'express';
import { body } from 'express-validator';
import { getAll, getById, create, update, remove, reorder } from '../controllers/skillGroupController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = Router();

router.get('/', getAll);

router.post(
  '/',
  authenticate,
  authorize('admin', 'editor'),
  validate([
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('skills').isArray({ min: 1 }).withMessage('At least one skill is required'),
  ]),
  create
);

router.put(
  '/reorder/all',
  authenticate,
  authorize('admin'),
  validate([
    body('items').isArray().withMessage('Items array is required'),
  ]),
  reorder
);

router.get('/:id', getById);

router.put(
  '/:id',
  authenticate,
  authorize('admin', 'editor'),
  validate([
    body('title').optional().trim().notEmpty(),
    body('skills').optional().isArray({ min: 1 }),
  ]),
  update
);

router.delete('/:id', authenticate, authorize('admin'), remove);

export default router;
