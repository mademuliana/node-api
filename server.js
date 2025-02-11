require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // No need for body-parser in Express 4.16+

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/tasks', taskRoutes);

// Server Configuration
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

// Start the Server
app.listen(PORT, () => {
    console.log(`🚀 Server running at: http://${HOST}:${PORT}`);
});