const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, planController.createPlan);
router.get('/user/:userId', planController.getUserPlans);
router.get('/:id', protect, planController.getPlanById);
router.put('/:id', protect, planController.updatePlan);
router.delete('/:id', protect, planController.deletePlan);

module.exports = router;