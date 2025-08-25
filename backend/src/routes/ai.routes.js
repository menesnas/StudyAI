const express = require('express');
const { chatWithAI, askAI } = require('../controllers/aiController');
const router = express.Router();

router.post("/chat", chatWithAI);
router.post("/ask", askAI);

module.exports = router;
