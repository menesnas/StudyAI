const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, taskController.createTask);
router.get('/plan/:planId', protect, taskController.getPlanTasks);
router.put('/:id', protect, taskController.updateTask);
router.delete('/:id', protect, taskController.deleteTask);

module.exports = router;