const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, resourceController.createResource);
router.get('/plan/:planId', protect, resourceController.getPlanResources);
router.put('/:id', protect, resourceController.updateResource);
router.delete('/:id', protect, resourceController.deleteResource);

module.exports = router;