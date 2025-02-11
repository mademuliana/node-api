const db = require('../config/db');

exports.getAllTasks = (userId, limit, page, callback) => {
    const offset = (page - 1) * limit;

    db.query(
        `SELECT COUNT(*) AS total FROM tasks 
         WHERE todo_list_id IN (SELECT id FROM todo_lists WHERE user_id = ?)`, [userId],
        (err, countResult) => {
            if (err) return callback(err);

            const total = countResult[0].total;
            const total_pages = Math.ceil(total / limit);

            db.query(
                `SELECT t.* FROM tasks t
                 JOIN todo_lists tl ON t.todo_list_id = tl.id
                 WHERE tl.user_id = ? 
                 ORDER BY t.created_at DESC
                 LIMIT ? OFFSET ?`, [userId, limit, offset],
                (err, tasks) => {
                    if (err) return callback(err);
                    callback(null, { total, total_pages, tasks });
                }
            );
        }
    );
};

exports.createTask = (name, todo_list_id, callback) => {
    db.query(
        'INSERT INTO tasks (name, todo_list_id, checked) VALUES (?, ?, ?)', [name, todo_list_id, false],
        (err, result) => {
            if (err) return callback(err);
            callback(null, { id: result.insertId, name, todo_list_id, checked: false });
        }
    );
};

exports.getTaskById = (id, callback) => {
    db.query(
        'SELECT * FROM tasks WHERE id = ?', [id],
        (err, results) => {
            if (err) return callback(err);
            if (results.length === 0) return callback(null, null); // No task found
            callback(null, results[0]);
        }
    );
};

exports.getTasksByTodoList = (userId, todo_list_id, limit, page, callback) => {
    const offset = (page - 1) * limit;

    // Get total count of tasks for the given to-do list
    db.query(
        `SELECT COUNT(*) AS total FROM tasks 
         WHERE todo_list_id = ? 
         AND todo_list_id IN (SELECT id FROM todo_lists WHERE user_id = ?)`, [todo_list_id, userId],
        (err, countResult) => {
            if (err) return callback(err);

            const total = countResult[0].total;
            const total_pages = Math.ceil(total / limit);

            // Fetch paginated tasks for the specific to-do list
            db.query(
                `SELECT * FROM tasks 
                 WHERE todo_list_id = ? 
                 AND todo_list_id IN (SELECT id FROM todo_lists WHERE user_id = ?)
                 ORDER BY created_at DESC 
                 LIMIT ? OFFSET ?`, [todo_list_id, userId, limit, offset],
                (err, tasks) => {
                    if (err) return callback(err);
                    callback(null, { total, total_pages, tasks });
                }
            );
        }
    );
};


exports.updateTask = (id, name, checked, callback) => {
    db.query(
        'UPDATE tasks SET name = ?, checked = ? WHERE id = ?', [name, checked, id],
        (err, result) => {
            if (err) return callback(err);
            if (result.affectedRows === 0) return callback(null, null); // No task updated
            callback(null, { message: 'Task updated' });
        }
    );
};

exports.toggleTaskStatus = (id, callback) => {
    db.query(
        'UPDATE tasks SET checked = NOT checked WHERE id = ?', [id],
        (err, result) => {
            if (err) return callback(err);
            if (result.affectedRows === 0) return callback(null, null); // No task updated
            callback(null, { message: 'Task status toggled' });
        }
    );
};

exports.deleteTask = (id, callback) => {
    db.query(
        'DELETE FROM tasks WHERE id = ?', [id],
        (err, result) => {
            if (err) return callback(err);
            if (result.affectedRows === 0) return callback(null, null); // No task deleted
            callback(null, { message: 'Task deleted' });
        }
    );
};