const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  teamMembers: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['In Progress', 'Review', 'Completed'],
    default: 'In Progress'
  },
  progress: {
    type: Number,
    default: 0
  },
  color: {
    type: String,
    default: '#6366f1'
  },
  createdBy: {
    type: String, // Mocked for this level, usually ObjectId
    default: 'currentUser'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', ProjectSchema);
