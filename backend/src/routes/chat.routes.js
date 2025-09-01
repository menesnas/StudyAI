// routes/search.routes.js
const express = require("express");
const router = express.Router();
const { searchQuery } = require("../services/searchService");

// GET /api/search?q=makine%20öğrenmesi
router.get("/", searchQuery);

module.exports = router;
