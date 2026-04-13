const express = require('express');
const cors = require('cors');
const taskController = require('./src/controllers/task.controller');

const app = express();
const PORT = 5005;

app.use(cors());
app.use(express.json());

// Main Endpoint
app.post('/api/task/analyze', taskController.analyzeTask);

app.get('/health', (req, res) => {
    res.json({ success: true, mode: 'Stateless-Analysis-v4' });
});

// Start server with basic error resilience
const server = app.listen(PORT, () => {
    console.log(`🚀 TaskInsight API Server Live: http://localhost:${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is occupied. Please kill other processes.`);
        process.exit(1);
    } else {
        console.error('❌ Server Error:', err);
    }
});
