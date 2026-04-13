const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const Project = require('./models/Project');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/aether');
    console.log('  ✅ MongoDB Connected');
  } catch (err) {
    console.error('  ❌ MongoDB Connection Error:', err.message);
    console.log('  ⚠️ Continuing with in-memory fallback (CRUD will not persist)');
  }
};

connectDB();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ─── Routes ────────────────────────────────────────────────────────

// Landing Page
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Aether — The Future of Productivity',
    page: 'home'
  });
});

// Dashboard
app.get('/dashboard', async (req, res) => {
  try {
    let projects = await Project.find().sort({ createdAt: -1 });
    
    // Seed default projects if none exist
    if (projects.length === 0) {
      const defaultProjects = [
        { name: 'Neural Network Optimization', description: 'Optimizing core ML models for faster inference.', progress: 78, status: 'In Progress', teamMembers: 4, color: '#3b82f6' },
        { name: 'Quantum UI Kit', description: 'Next-gen design system for quantum applications.', progress: 45, status: 'In Progress', teamMembers: 6, color: '#8b5cf6' },
        { name: 'Edge Node Deployment', description: 'Scaling edge computing nodes across the globe.', progress: 92, status: 'Review', teamMembers: 3, color: '#ec4899' },
        { name: 'Synthetix Brand Pack', description: 'New visual identity for Aether Ecosystem.', progress: 100, status: 'Completed', teamMembers: 2, color: '#10b981' }
      ];
      await Project.insertMany(defaultProjects);
      projects = await Project.find().sort({ createdAt: -1 });
    }

    const stats = [
      { label: 'Active Tasks', value: projects.length.toString(), change: '+15%', icon: 'layers', trend: 'up' },
      { label: 'Network Health', value: '99.9%', change: '+0.1%', icon: 'activity', trend: 'up' },
      { label: 'Team Velocity', value: '2.4x', change: '+12%', icon: 'zap', trend: 'up' },
      { label: 'Projects Done', value: projects.filter(p => p.status === 'Completed').length.toString(), change: '+23%', icon: 'check-circle', trend: 'up' }
    ];

    res.render('dashboard', {
      title: 'Dashboard — Aether',
      page: 'dashboard',
      projects,
      stats
    });
  } catch (err) {
    console.error('Dashboard Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Create Project API
app.post('/api/projects', async (req, res) => {
  try {
    const { name, description, teamMembers } = req.body;
    
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#6366f1'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newProject = new Project({
      name,
      description,
      teamMembers: parseInt(teamMembers) || 1,
      color: randomColor,
      progress: 0,
      status: 'In Progress'
    });

    await newProject.save();
    
    res.status(201).json({ 
      success: true, 
      data: newProject 
    });
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Pricing
app.get('/pricing', (req, res) => {
  res.render('pricing', {
    title: 'Pricing — Aether',
    page: 'pricing'
  });
});

// Signup
app.get('/signup', (req, res) => {
  res.render('signup', {
    title: 'Join Aether — Quantum Account',
    page: 'signup'
  });
});

app.post('/signup', (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
  }

  res.status(200).json({ 
    success: true, 
    message: 'Welcome to Aether! Redirecting to dashboard...' 
  });
});

// 404
app.use((req, res) => {
  res.status(404).render('404', {
    title: '404 — Aether',
    page: '404'
  });
});

// ─── Start Server ──────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n  ✨ Aether is glowing at http://localhost:${PORT}\n`);
});
