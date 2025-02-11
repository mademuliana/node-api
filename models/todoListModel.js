const db = require('../config/db');

const TodoModel = {
    create: (name, user_id, callback) => {
        db.query('INSERT INTO todo_lists (name, user_id) VALUES (?, ?)', [name, user_id], callback);
    },

    findByUserId: (user_id, page, limit, callback) => {
        const offset = (page - 1) * limit;

        db.query('SELECT COUNT(*) AS total FROM todo_lists WHERE user_id = ?', [user_id], (err, countResult) => {
            if (err) return callback(err, null);

            const total = countResult[0].total;
            const total_pages = Math.ceil(total / limit);

            const query = `
                SELECT 
                    tl.id AS todo_id, tl.name AS todo_name, tl.user_id, 
                    t.id AS task_id, t.name AS task_name, t.checked
                FROM todo_lists tl
                LEFT JOIN tasks t ON tl.id = t.todo_list_id
                WHERE tl.user_id = ?
                LIMIT ? OFFSET ?
            `;

            db.query(query, [user_id, limit, offset], (err, results) => {
                if (err) return callback(err, null);

                const todoListsMap = new Map();

                results.forEach(row => {
                    if (!todoListsMap.has(row.todo_id)) {
                        todoListsMap.set(row.todo_id, {
                            id: row.todo_id,
                            name: row.todo_name,
                            user_id: row.user_id,
                            tasks: []
                        });
                    }

                    if (row.task_id) {
                        todoListsMap.get(row.todo_id).tasks.push({
                            id: row.task_id,
                            name: row.task_name,
                            checked: row.checked
                        });
                    }
                });

                callback(null, {
                    total,
                    total_pages,
                    current_page: page,
                    data: Array.from(todoListsMap.values())
                });
            });
        });
    },

    findById: (id, callback) => {
        const query = `
            SELECT 
                tl.id AS todo_id, tl.name AS todo_name, tl.user_id, 
                t.id AS task_id, t.name AS task_name, t.checked
            FROM todo_lists tl
            LEFT JOIN tasks t ON tl.id = t.todo_list_id
            WHERE tl.id = ?
        `;

        db.query(query, [id], (err, results) => {
            if (err) return callback(err, null);
            if (results.length === 0) return callback(null, null);

            const todo = {
                id: results[0].todo_id,
                name: results[0].todo_name,
                user_id: results[0].user_id,
                tasks: results[0].task_id ?
                    results.map(task => ({
                        id: task.task_id,
                        name: task.task_name,
                        checked: task.checked
                    })) :
                    []
            };

            callback(null, todo);
        });
    },

    update: (id, name, callback) => {
        db.query('UPDATE todo_lists SET name = ? WHERE id = ?', [name, id], callback);
    },

    delete: (id, callback) => {
        db.query('DELETE FROM todo_lists WHERE id = ?', [id], callback);
    }
};

module.exports = TodoModel;