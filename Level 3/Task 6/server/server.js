const express = require('express');
const cors = require('cors');
const itemRoutes = require('./routes/itemRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/items', itemRoutes);

// Simple fallback route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the REST API' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
