const TodoModel = require('../models/todoListModel');
const { verifyTodoOwnership } = require('../middlewares/authMiddleware');

exports.createTodoList = (req, res) => {
    const { name } = req.body;
    const user_id = req.user.id;

    TodoModel.create(name, user_id, (err, result) => {
        if (err) return res.status(500).json({ message: 'Error creating to-do list' });
        res.status(201).json({ id: result.insertId, name, user_id });
    });
};

exports.getUserTodoLists = (req, res) => {
    const user_id = req.user.id;
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    TodoModel.findByUserId(user_id, page, limit, (err, result) => {
        if (err) return res.status(500).json({ message: 'Error fetching to-do lists' });
        res.json(result);
    });
};

exports.getTodoListById = [verifyTodoOwnership, (req, res) => {
    const { id } = req.params;

    TodoModel.findById(id, (err, result) => {
        if (err) return res.status(500).json({ message: 'Error fetching to-do list' });
        if (result.length === 0) return res.status(404).json({ message: 'To-Do List not found' });

        res.json(result[0]);
    });
}];

exports.updateTodoList = [verifyTodoOwnership, (req, res) => {
    const { name } = req.body;
    const { id } = req.params;

    TodoModel.update(id, name, (err, result) => {
        if (err) return res.status(500).json({ message: 'Update failed' });
        res.json({ message: 'To-Do List updated' });
    });
}];

exports.deleteTodoList = [verifyTodoOwnership, (req, res) => {
    const { id } = req.params;

    TodoModel.delete(id, (err, result) => {
        if (err) return res.status(500).json({ message: 'Delete failed' });
        res.json({ message: 'To-Do List deleted' });
    });
}];