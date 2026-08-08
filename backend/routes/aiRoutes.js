import express from 'express';
import { generateStudyPlan } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to protect the route
router.post('/:id/generate-plan', protect, generateStudyPlan);

export default router;
