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
    const user_id = req.user.id;
    let { page = 1, limit = 10 } = req.query; // Default values
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    // Get total count of to-do lists
    db.query('SELECT COUNT(*) AS total FROM todo_lists WHERE user_id = ?', [user_id], (err, countResult) => {
        if (err) return res.status(500).json({ message: 'Error fetching to-do count' });

        const total = countResult[0].total;
        const total_pages = Math.ceil(total / limit);

        // Fetch paginated to-do lists
        db.query('SELECT * FROM todo_lists WHERE user_id = ? LIMIT ? OFFSET ?', [user_id, limit, offset], (err, todoLists) => {
            if (err) return res.status(500).json({ message: 'Error fetching to-do lists' });

            const todoIds = todoLists.map(todo => todo.id);
            if (todoIds.length === 0) return res.json({ total, total_pages, data: [] });

            // Fetch tasks for these to-do lists
            db.query('SELECT * FROM tasks WHERE todo_list_id IN (?)', [todoIds], (err, tasks) => {
                if (err) return res.status(500).json({ message: 'Error fetching tasks' });

                // Attach tasks to their respective to-do lists
                const todosWithTasks = todoLists.map(todo => ({
                    ...todo,
                    tasks: tasks.filter(task => task.todo_list_id === todo.id)
                }));

                res.json({ total, total_pages, current_page: page, data: todosWithTasks });
            });
        });
    });
};

exports.getTodoListById = (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    db.query('SELECT * FROM todo_lists WHERE id = ? AND user_id = ?', [id, user_id], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ message: 'To-Do List not found or not authorized' });

        const todo = results[0];

        // Fetch tasks for this specific To-Do List
        db.query('SELECT * FROM tasks WHERE todo_list_id = ?', [id], (err, tasks) => {
            if (err) return res.status(500).json({ message: 'Error fetching tasks' });

            res.json({
                ...todo,
                tasks
            });
        });
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