const logger = require('../utils/logger');

// Simulated In-Memory Caching (Redis-Ready Interface)
class CacheService {
  constructor() {
    this.cache = new Map();
    this.ttl = 3600 * 1000; // Default 1 hour
  }

  get(key) {
    const data = this.cache.get(key);
    if (!data) return null;

    if (Date.now() > data.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    logger.info(`Cache HIT for key: ${key}`);
    return data.value;
  }

  set(key, value, customTtl = null) {
    const expiry = Date.now() + (customTtl || this.ttl);
    this.cache.set(key, { value, expiry });
    logger.info(`Cache SET for key: ${key}`);
  }

  clear() {
    this.cache.clear();
  }
}

module.exports = new CacheService();
