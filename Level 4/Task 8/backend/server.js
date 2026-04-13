require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./src/utils/logger');
const { apiLimiter } = require('./src/middleware/rateLimiter');
const errorHandler = require('./src/middleware/errorHandler');
const cacheService = require('./src/services/cache.service');
const taskQueue = require('./src/services/queue.service');

const assetsController = require('./src/controllers/assets.controller');

const app = express();
const PORT = process.env.PORT || 5003;

// 1. GLOBAL MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use('/api/', apiLimiter); // Apply rate limiting to all API routes

// 2. ROUTES
app.get('/api/assets', assetsController.getAssets);
app.post('/api/assets', assetsController.createAsset);
app.post('/api/process-task', async (req, res, next) => {
  try {
    const { taskId, type, userEmail } = req.body;

    // A. Check Cache
    const cachedResult = cacheService.get(`task_${taskId}`);
    if (cachedResult) {
      return res.json({ success: true, fromCache: true, data: cachedResult });
    }

    // B. Main Logic (Simulated)
    const result = { taskId, status: 'PROCESSED', timestamp: new Date() };

    // C. Set Cache
    cacheService.set(`task_${taskId}`, result);

    // D. Offload Background Jobs
    taskQueue.push('EMAIL', { email: userEmail });
    taskQueue.push('ANALYTICS', { taskId });

    res.status(202).json({
      success: true,
      message: 'Task received and queued for background processing.',
      data: result
    });

  } catch (error) {
    next(error); // Pass to global error handler
  }
});

// 3. HEALTH CHECK
app.get('/health', (req, res) => {
  res.json({ status: 'UP', environment: process.env.NODE_ENV || 'development' });
});

// 4. GLOBAL ERROR HANDLER (MUST BE LAST)
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`✨ Scalable Production Backend running on port ${PORT}`);
});
