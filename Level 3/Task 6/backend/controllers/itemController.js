const Item = require('../models/Item');

// @desc    Get all items
// @route   GET /api/items
// @access  Public
exports.getItems = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', category = '' } = req.query;

    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;

    const total = await Item.countDocuments(query);
    const items = await Item.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: items
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create new item
// @route   POST /api/items
// @access  Private (Admin only example)
exports.createItem = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const item = await Item.create(req.body);

    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
exports.updateItem = async (req, res, next) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    // Make sure user is item owner or admin
    if (item.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to update this item' });
    }

    item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
exports.deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    // Make sure user is item owner or admin
    if (item.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this item' });
    }

    await item.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
