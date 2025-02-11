const db = require('../config/db');


exports.getAllTasks = (req, res) => {
    const userId = req.user.id;

    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    db.query(
        `SELECT COUNT(*) AS total FROM tasks 
         WHERE todo_list_id IN (SELECT id FROM todo_lists WHERE user_id = ?)`, [userId],
        (err, countResult) => {
            if (err) return res.status(500).json({ message: 'Error fetching task count' });

            const total = countResult[0].total;
            const total_pages = Math.ceil(total / limit);

            db.query(
                `SELECT * FROM tasks 
                 WHERE todo_list_id IN (SELECT id FROM todo_lists WHERE user_id = ?) 
                 LIMIT ? OFFSET ?`, [userId, limit, offset],
                (err, tasks) => {
                    if (err) return res.status(500).json({ message: 'Error fetching tasks' });

                    res.json({ total, total_pages, current_page: page, data: tasks });
                }
            );
        }
    );
};

exports.createTask = (req, res) => {
    const { name, todo_list_id } = req.body;

    db.query('INSERT INTO tasks (name, todo_list_id) VALUES (?, ?)', [name, todo_list_id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error creating task' });
        res.status(201).json({ id: result.insertId, name, todo_list_id });
    });
};

exports.getTaskById = (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM tasks WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching task' });

        if (results.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(results[0]);
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

exports.toggleTaskStatus = (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.id;

    db.query(
        'SELECT t.checked, tl.user_id FROM tasks t JOIN todo_lists tl ON t.todo_list_id = tl.id WHERE t.id = ?', [taskId],
        (err, results) => {
            if (err || results.length === 0) {
                return res.status(404).json({ message: 'Task not found' });
            }
            const { checked: currentStatus, user_id: ownerId } = results[0];
            if (ownerId !== userId) {
                return res.status(403).json({ message: 'You are not authorized to modify this task' });
            }
            const newStatus = !currentStatus;
            db.query(
                'UPDATE tasks SET checked = ? WHERE id = ?', [newStatus, taskId],
                (updateErr) => {
                    if (updateErr) {
                        return res.status(500).json({ message: 'Failed to update task' });
                    }
                    res.json({ message: `Task marked as ${newStatus ? 'checked' : 'unchecked'}` });
                }
            );
        }
    );
};

exports.deleteTask = (req, res) => {
    db.query('DELETE FROM tasks WHERE id = ?', [req.params.id], (err, result) => {
        if (err || result.affectedRows === 0) return res.status(403).json({ message: 'Delete failed' });
        res.json({ message: 'Task deleted' });
    });
};