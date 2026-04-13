const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');

// Advanced Analysis Endpoint
router.post('/analyze', taskController.analyzeTask);

module.exports = router;
