import { Router } from 'express';
import { uploadSingle, handleUpload } from '../controllers/uploadController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, uploadSingle('file'), handleUpload);

export default router;
