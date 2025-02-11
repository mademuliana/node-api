const express = require('express');
const router = express.Router();
const { authenticateUser, verifyTaskOwnership, verifyTodoOwnership } = require('../middlewares/authMiddleware');
const TaskController = require('../controllers/taskController');

router.post('/', authenticateUser, TaskController.createTask);
router.get('/', authenticateUser, TaskController.getAllTasks);
router.get('/todolist/:todo_list_id', authenticateUser, verifyTodoOwnership, TaskController.getTasksByTodoList);
router.get('/:id', authenticateUser, TaskController.getTaskById);
router.put('/:id', authenticateUser, verifyTaskOwnership, TaskController.updateTask);
router.delete('/:id', authenticateUser, verifyTaskOwnership, TaskController.deleteTask);
router.patch('/:id/item', authenticateUser, verifyTaskOwnership, TaskController.toggleTaskStatus);

module.exports = router;