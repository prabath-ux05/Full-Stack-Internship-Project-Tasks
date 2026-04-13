const express = require('express');
const {
  getAssets,
  createAsset,
  deleteAsset
} = require('../controllers/assetController');

const { protect } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getAssets)
  .post(protect, createAsset);

router
  .route('/:id')
  .delete(protect, deleteAsset);

module.exports = router;
