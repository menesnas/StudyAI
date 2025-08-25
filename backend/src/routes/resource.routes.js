const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { protect } = require('../middlewares/authMiddleware');

// Tüm kaynakları getir
router.get('/', protect, resourceController.getAllResources);

// Plana ait kaynakları getir
router.get('/plan/:planId', protect, resourceController.getPlanResources);

// Yeni kaynak oluştur
router.post('/', protect, resourceController.createResource);

// Kaynak güncelle
router.put('/:id', protect, resourceController.updateResource);

// Kaynak sil
router.delete('/:id', protect, resourceController.deleteResource);

module.exports = router;