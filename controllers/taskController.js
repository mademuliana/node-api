const db = require('../config/db');

exports.createTask = (req, res) => {
    const { name, todo_list_id } = req.body;

    db.query('INSERT INTO tasks (name, todo_list_id) VALUES (?, ?)', [name, todo_list_id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error creating task' });
        res.status(201).json({ id: result.insertId, name, todo_list_id });
    });
};

exports.getTasksByTodoList = (req, res) => {
    db.query('SELECT * FROM tasks WHERE todo_list_id = ?', [req.params.todo_list_id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching tasks' });
        res.json(results);
    });
};

exports.updateTask = (req, res) => {
    const { name, checked } = req.body;
    const { id } = req.params;

    db.query('UPDATE tasks SET name = ?, checked = ? WHERE id = ?', [name, checked, id], (err, result) => {
        if (err || result.affectedRows === 0) return res.status(403).json({ message: 'Update failed' });
        res.json({ message: 'Task updated' });
    });
};

exports.deleteTask = (req, res) => {
    db.query('DELETE FROM tasks WHERE id = ?', [req.params.id], (err, result) => {
        if (err || result.affectedRows === 0) return res.status(403).json({ message: 'Delete failed' });
        res.json({ message: 'Task deleted' });
    });
};