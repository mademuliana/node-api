const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const TodoController = require('../controllers/todoController');

router.post('/', authMiddleware, TodoController.createTodoList);
router.get('/', authMiddleware, TodoController.getUserTodoLists);
router.put('/:id', authMiddleware, TodoController.updateTodoList);
router.delete('/:id', authMiddleware, TodoController.deleteTodoList);

module.exports = router;