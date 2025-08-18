const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/profile', protect, userController.getMyProfile);
router.get('/:id', userController.getUserProfile);
router.put('/profile', protect, userController.updateProfile);

module.exports = router;