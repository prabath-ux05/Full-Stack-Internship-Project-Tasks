const express = require('express');
const path = require('path');
const formRoutes = require('./routes/formRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', formRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong on our end.');
});

app.listen(PORT, () => {
    console.log(`🚀 Task 2 Server running at http://localhost:${PORT}`);
});
