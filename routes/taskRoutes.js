const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const TaskController = require('../controllers/taskController');

router.post('/', authMiddleware, TaskController.createTask);
router.get('/', authMiddleware, TaskController.getAllTasks);
router.get('/:id', authMiddleware, TaskController.getTaskById);
router.put('/:id', authMiddleware, TaskController.updateTask);
router.delete('/:id', authMiddleware, TaskController.deleteTask);
router.patch('/:id/toggle', authMiddleware, TaskController.toggleTaskStatus);

module.exports = router;