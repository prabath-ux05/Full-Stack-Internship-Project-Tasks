const logger = require('../utils/logger');
const cacheService = require('../services/cache.service');
const taskQueue = require('../services/queue.service');

// Demo In-Memory DB
let assets = [
  { id: 1, name: "Initial Server", category: "Infrastructure", quantity: 1, status: "Active" }
];

const getAssets = (req, res, next) => {
  try {
    const cacheKey = 'all_assets';
    const cachedData = cacheService.get(cacheKey);

    if (cachedData) {
      return res.status(200).json({
        success: true,
        source: 'cache',
        data: cachedData
      });
    }

    // If not in cache
    cacheService.set(cacheKey, assets);
    res.status(200).json({
      success: true,
      source: 'database',
      data: assets
    });
  } catch (err) {
    next(err);
  }
};

const createAsset = (req, res, next) => {
  try {
    const newAsset = { id: assets.length + 1, ...req.body };
    assets.push(newAsset);

    // Invalidate Cache
    cacheService.clear();

    // Trigger Background Analytics Task
    taskQueue.push('ANALYTICS', { taskId: newAsset.id });
    
    // Trigger Background Email Notification
    taskQueue.push('EMAIL', { email: 'admin@company.com' });

    res.status(201).json({
      success: true,
      message: "Asset created and background jobs initialized",
      data: newAsset
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAssets, createAsset };
