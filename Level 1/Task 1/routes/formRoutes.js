const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');

// Clean routing mapping URLs to specific Controller actions
router.get('/', formController.renderForm);
router.post('/submit', formController.processForm);
router.get('/success', formController.renderSuccess);

module.exports = router;
