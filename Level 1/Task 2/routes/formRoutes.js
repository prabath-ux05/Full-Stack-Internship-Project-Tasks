const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const formController = require('../controllers/FormController');

// Validation Rules
const registrationRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email')
        .isEmail().withMessage('Please enter a valid email address')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/\d/).withMessage('Password must contain at least one number')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
];

router.get('/', formController.renderForm);
router.post('/submit', registrationRules, formController.handleForm);
router.get('/success', formController.renderSuccess);

module.exports = router;
