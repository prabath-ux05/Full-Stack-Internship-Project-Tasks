// In-memory data store for demonstration
let items = [
  { id: 1, title: 'Learn React', completed: false },
  { id: 2, title: 'Build a REST API', completed: false }
];
let nextId = 3;

// @desc    Get all items
// @route   GET /api/items
exports.getItems = (req, res) => {
  res.status(200).json({ success: true, data: items });
};

// @desc    Create an item
// @route   POST /api/items
exports.createItem = (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: 'Please provide a title' });
  }

  const newItem = {
    id: nextId++,
    title,
    completed: false
  };

  items.push(newItem);
  res.status(201).json({ success: true, data: newItem });
};

// @desc    Update an item
// @route   PUT /api/items/:id
exports.updateItem = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, completed } = req.body;

  const itemIndex = items.findIndex(item => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }

  // Update fields
  if (title !== undefined) items[itemIndex].title = title;
  if (completed !== undefined) items[itemIndex].completed = completed;

  res.status(200).json({ success: true, data: items[itemIndex] });
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
exports.deleteItem = (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = items.findIndex(item => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }

  items.splice(itemIndex, 1);
  res.status(200).json({ success: true, data: {} });
};
