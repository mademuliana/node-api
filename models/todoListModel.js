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

            db.query('SELECT * FROM todo_lists WHERE user_id = ? LIMIT ? OFFSET ?', [user_id, limit, offset], (err, todoLists) => {
                if (err) return callback(err, null);
                callback(null, { total, total_pages, current_page: page, data: todoLists });
            });
        });
    },

    findById: (id, callback) => {
        db.query('SELECT * FROM todo_lists WHERE id = ?', [id], callback);
    },

    update: (id, name, callback) => {
        db.query('UPDATE todo_lists SET name = ? WHERE id = ?', [name, id], callback);
    },

    delete: (id, callback) => {
        db.query('DELETE FROM todo_lists WHERE id = ?', [id], callback);
    }
};

module.exports = TodoModel;