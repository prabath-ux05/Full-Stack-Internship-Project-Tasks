const EventEmitter = require('events');
const logger = require('../utils/logger');

// Background Task Processor (EventEmitter-based Queue)
class TaskQueue extends EventEmitter {
  constructor() {
    super();
    this.on('processTask', async (taskData) => {
      await this.worker(taskData);
    });
  }

  // Push task to "queue"
  push(type, payload) {
    logger.info(`Adding background job: ${type}`);
    this.emit('processTask', { type, payload });
  }

  // Simulated worker processing
  async worker({ type, payload }) {
    try {
      logger.info(`Worker starting job [${type}]...`);
      
      // Artificial delay to simulate heavy work
      await new Promise(resolve => setTimeout(resolve, 2000));

      switch (type) {
        case 'EMAIL':
          logger.info(`Sending email to: ${payload.email}... DONE`);
          break;
        case 'ANALYTICS':
          logger.info(`Processing analytics for task: ${payload.taskId}... DONE`);
          break;
        default:
          logger.warn(`Unknown task type: ${type}`);
      }
    } catch (error) {
      logger.error(`Worker job failed: ${type}`, error);
    }
  }
}

module.exports = new TaskQueue();
