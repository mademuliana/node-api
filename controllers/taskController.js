const taskModel = require('../models/taskModel');

exports.getAllTasks = (req, res) => {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    if (page < 1) return res.status(400).json({ message: 'Page must be 1 or greater' });

    const offset = (page - 1) * limit;

    taskModel.getAllTasks(userId, limit, offset, (err, data) => {
        if (err) return res.status(500).json({ message: 'Error fetching tasks' });

        res.json({
            page,
            limit,
            total: data.total,
            total_pages: data.total_pages,
            tasks: data.tasks
        });
    });
};

exports.createTask = (req, res) => {
    const { name, todo_list_id } = req.body;

    if (!name || !todo_list_id) {
        return res.status(400).json({ message: 'Task name and to-do list ID are required' });
    }

    taskModel.createTask(name, todo_list_id, (err, task) => {
        if (err) return res.status(500).json({ message: 'Error creating task' });

        res.status(201).json(task);
    });
};

exports.getTaskById = (req, res) => {
    const { id } = req.params;

    taskModel.getTaskById(id, (err, task) => {
        if (err) return res.status(500).json({ message: 'Error fetching task' });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        res.json(task);
    });
};

exports.getTasksByTodoList = (req, res) => {
    const { todo_list_id } = req.params;
    const userId = req.user.id; // Assuming authenticated user info is available
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    if (page < 1) return res.status(400).json({ message: 'Page must be 1 or greater' });

    taskModel.getTasksByTodoList(userId, todo_list_id, limit, page, (err, data) => {
        if (err) return res.status(500).json({ message: 'Error fetching tasks' });
        if (!data.tasks.length) return res.status(404).json({ message: 'No tasks found for this to-do list' });

        res.json({
            page,
            limit,
            total: data.total,
            total_pages: data.total_pages,
            tasks: data.tasks
        });
    });
};


exports.updateTask = (req, res) => {
    const { id } = req.params;
    const { name, checked } = req.body;

    if (checked !== undefined && typeof checked !== 'boolean') {
        return res.status(400).json({ message: 'Checked must be a boolean value' });
    }

    taskModel.updateTask(id, name, checked, (err, result) => {
        if (err) return res.status(500).json({ message: 'Update failed' });
        if (!result) return res.status(404).json({ message: 'Task not found' });

        res.json({ message: 'Task updated' });
    });
};

exports.toggleTaskStatus = (req, res) => {
    const { id } = req.params;

    taskModel.toggleTaskStatus(id, (err, result) => {
        if (err) return res.status(500).json({ message: 'Failed to update task' });
        if (!result) return res.status(404).json({ message: 'Task not found' });

        res.json({ message: 'Task status toggled' });
    });
};

exports.deleteTask = (req, res) => {
    const { id } = req.params;

    taskModel.deleteTask(id, (err, result) => {
        if (err) return res.status(500).json({ message: 'Delete failed' });
        if (!result) return res.status(404).json({ message: 'Task not found' });

        res.json({ message: 'Task deleted' });
    });
};