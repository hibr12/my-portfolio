import { Router } from 'express';
import { body } from 'express-validator';
import { login, getProfile, updateProfile, changePassword, register } from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = Router();

router.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ]),
  login
);

router.post(
  '/register',
  authenticate,
  authorize('admin'),
  validate([
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ]),
  register
);

router.get('/profile', authenticate, getProfile);

router.put(
  '/profile',
  authenticate,
  validate([
    body('name').optional().trim().notEmpty(),
    body('email').optional().isEmail(),
  ]),
  updateProfile
);

router.put(
  '/change-password',
  authenticate,
  validate([
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  ]),
  changePassword
);

export default router;
