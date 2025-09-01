// routes/search.routes.js
const express = require("express");
const router = express.Router();
const { search } = require("../services/searchService");

router.get("/", async (req, res) => {
  const q = req.query.q;
  if (!q) {
    return res.status(400).json({ error: "Sorgu parametresi eksik: q" });
  }

  try {
    const links = await search(q);
    res.json({ links });
  } catch (err) {
    res.status(500).json({ error: "Arama başarısız", details: err.message });
  }
});

module.exports = router;
