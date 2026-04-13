const express = require('express');
const {
  getItems,
  createItem,
  updateItem,
  deleteItem
} = require('../controllers/itemController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getItems)
  .post(protect, authorize('admin'), createItem);

router
  .route('/:id')
  .put(protect, authorize('user', 'admin'), updateItem)
  .delete(protect, authorize('user', 'admin'), deleteItem);

module.exports = router;
