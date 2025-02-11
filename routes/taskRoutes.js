const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const TaskController = require('../controllers/taskController');

router.post('/', authMiddleware, TaskController.createTask);
router.get('/:todo_list_id', authMiddleware, TaskController.getTasksByTodoList);
router.put('/:id', authMiddleware, TaskController.updateTask);
router.delete('/:id', authMiddleware, TaskController.deleteTask);

module.exports = router;