const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    const { name, description, teamMembers } = req.body;

    // Basic validation
    if (!name || !description) {
      return res.status(400).json({ success: false, message: 'Name and description are required' });
    }

    // Generate random color for UI
    const colors = ['#6366f1', '#8b5cf6', '#a78bfa', '#ec4899', '#06b6d4', '#f59e0b'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const project = await Project.create({
      name,
      description,
      teamMembers: teamMembers || 1,
      color: randomColor,
      progress: 0,
      status: 'In Progress'
    });

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: projects });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
