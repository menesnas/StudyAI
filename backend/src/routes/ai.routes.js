const express = require('express');
const { chatWithAI, askAI } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/chat', protect,chatWithAI);
// saving AI-generated plans/tasks/resources requires authentication
router.post('/ask', protect, askAI);

module.exports = router;
