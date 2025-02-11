const db = require('../config/db');

exports.createTodoList = (req, res) => {
    const { name } = req.body;
    const user_id = req.user.id;

    db.query('INSERT INTO todo_lists (name, user_id) VALUES (?, ?)', [name, user_id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error creating to-do list' });
        res.status(201).json({ id: result.insertId, name, user_id });
    });
};

exports.getUserTodoLists = (req, res) => {
    db.query('SELECT * FROM todo_lists WHERE user_id = ?', [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching to-do lists' });
        res.json(results);
    });
};

exports.updateTodoList = (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    const user_id = req.user.id;

    db.query('UPDATE todo_lists SET name = ? WHERE id = ? AND user_id = ?', [name, id, user_id], (err, result) => {
        if (err || result.affectedRows === 0) return res.status(403).json({ message: 'Update failed or not authorized' });
        res.json({ message: 'To-Do List updated' });
    });
};

exports.deleteTodoList = (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    db.query('DELETE FROM todo_lists WHERE id = ? AND user_id = ?', [id, user_id], (err, result) => {
        if (err || result.affectedRows === 0) return res.status(403).json({ message: 'Delete failed or not authorized' });
        res.json({ message: 'To-Do List deleted' });
    });
};