const express = require('express');
const router = express.Router();
const { createProject, getProjects } = require('../controllers/projectController');

// In a real app, you would add protect middleware here: router.post('/', protect, createProject);
router.post('/', createProject);
router.get('/', getProjects);

module.exports = router;
