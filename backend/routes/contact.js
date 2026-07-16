import { Router } from 'express';
import { body } from 'express-validator';
import { submit, getAll, getById, updateStatus, remove, getStats } from '../controllers/contactController.js';
import { authenticate } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import rateLimit from 'express-rate-limit';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many messages. Please try again later.' },
});

router.post(
  '/',
  contactLimiter,
  validate([
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').trim().isLength({ min: 12, max: 5000 }).withMessage('Message must be 12-5000 characters'),
  ]),
  submit
);

router.get('/', authenticate, getAll);
router.get('/stats', authenticate, getStats);
router.patch('/:id/status', authenticate, updateStatus);
router.get('/:id', authenticate, getById);
router.delete('/:id', authenticate, remove);

export default router;
