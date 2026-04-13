const Asset = require('../models/Asset');

// @desc    Get all assets
// @route   GET /api/assets
// @access  Private
exports.getAssets = async (req, res, next) => {
  try {
    const assets = await Asset.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assets.length,
      data: assets
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create new asset
// @route   POST /api/assets
// @access  Private
exports.createAsset = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const asset = await Asset.create(req.body);

    res.status(201).json({
      success: true,
      data: asset
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete asset
// @route   DELETE /api/assets/:id
// @access  Private
exports.deleteAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({ success: false, error: 'Asset not found' });
    }

    // Check ownership or admin
    if (asset.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    await asset.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
