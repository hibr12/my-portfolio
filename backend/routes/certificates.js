import { Router } from 'express';
import { body } from 'express-validator';
import { getAll, getById, create, update, remove, reorder } from '../controllers/certificateController.js';
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
    body('issuer').trim().notEmpty().withMessage('Issuer is required'),
    body('year').trim().notEmpty().withMessage('Year is required'),
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
    body('issuer').optional().trim().notEmpty(),
    body('year').optional().trim().notEmpty(),
  ]),
  update
);

router.delete('/:id', authenticate, authorize('admin'), remove);

export default router;
