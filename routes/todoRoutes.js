const express = require('express');
const router = express.Router();
const { authenticateUser, verifyTodoOwnership } = require('../middlewares/authMiddleware');
const TodoController = require('../controllers/todoController');

router.post('/', authenticateUser, TodoController.createTodoList);
router.get('/', authenticateUser, TodoController.getUserTodoLists);
router.get('/:id', authenticateUser, verifyTodoOwnership, TodoController.getTodoListById);
router.put('/:id', authenticateUser, verifyTodoOwnership, TodoController.updateTodoList);
router.delete('/:id', authenticateUser, verifyTodoOwnership, TodoController.deleteTodoList);

module.exports = router;