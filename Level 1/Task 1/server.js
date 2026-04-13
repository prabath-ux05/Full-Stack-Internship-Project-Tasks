const express = require('express');
const path = require('path');
const formRoutes = require('./routes/formRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Main Routing
app.use('/', formRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Task 1 Server running on http://localhost:${PORT}`);
});
