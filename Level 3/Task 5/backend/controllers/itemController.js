const Item = require('../models/Item');

exports.getItems = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category = '' } = req.query;

    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }

    const total = await Item.countDocuments(query);
    const items = await Item.find(query)
      .skip((Math.max(1, page) - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: items
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.createItem = async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    if (error.name === 'ValidationError') {
       return res.status(400).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
