import { Router } from 'express';
import { body } from 'express-validator';
import { track, updateSession, getDashboard, getVisitors } from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = Router();

router.post(
  '/',
  validate([
    body('visitorId').trim().notEmpty().withMessage('Visitor ID is required'),
  ]),
  track
);

router.put('/session', authenticate, updateSession);

router.get('/dashboard', authenticate, getDashboard);
router.get('/visitors', authenticate, getVisitors);

export default router;
