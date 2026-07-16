import { Router } from 'express';
import { body } from 'express-validator';
import { get, getByKey, update, updateMany } from '../controllers/settingsController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = Router();

router.get('/', get);
router.get('/:key', getByKey);

router.put(
  '/:key',
  authenticate,
  authorize('admin'),
  validate([
    body('value').exists().withMessage('Value is required'),
  ]),
  update
);

router.put(
  '/',
  authenticate,
  authorize('admin'),
  validate([
    body('settings').isObject().withMessage('Settings object is required'),
  ]),
  updateMany
);

export default router;
