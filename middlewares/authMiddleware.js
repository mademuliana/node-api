const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Middleware to verify JWT token
exports.authenticateUser = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'Access denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Middleware to check if the user owns the requested To-Do List
exports.verifyTodoOwnership = (req, res, next) => {
    const { todo_list_id } = req.params; // To-Do List ID
    const userId = req.user.id; // Authenticated User ID

    db.query(
        `SELECT id FROM todo_lists WHERE id = ? AND user_id = ?`, [todo_list_id, userId],
        (err, results) => {
            if (err) return res.status(500).json({ message: 'Error verifying to-do list ownership' });
            if (results.length === 0) return res.status(403).json({ message: 'Unauthorized: You do not own this to-do list' });

            next();
        }
    );
};

// Middleware to check if the user owns the requested Task
exports.verifyTaskOwnership = (req, res, next) => {
    const { id } = req.params; // Task ID
    const userId = req.user.id; // Authenticated User ID

    db.query(
        `SELECT tasks.id FROM tasks 
         JOIN todo_lists ON tasks.todo_list_id = todo_lists.id 
         WHERE tasks.id = ? AND todo_lists.user_id = ?`, [id, userId],
        (err, results) => {
            if (err) return res.status(500).json({ message: 'Error verifying task ownership' });
            if (results.length === 0) return res.status(403).json({ message: 'Unauthorized: You do not own this task' });

            next();
        }
    );
};