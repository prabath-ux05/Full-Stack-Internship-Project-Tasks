const { validationResult } = require('express-validator');
const UserModel = require('../models/UserModel');

exports.renderForm = (req, res) => {
    res.render('index', { errors: [], formData: {} });
};

exports.handleForm = (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).render('index', {
            errors: errors.array(),
            formData: req.body
        });
    }

    const { name, email, password } = req.body;
    UserModel.save({ name, email, password });
    
    res.redirect('/success');
};

exports.renderSuccess = (req, res) => {
    const latestUser = UserModel.getLatest();
    if (!latestUser) return res.redirect('/');
    
    res.render('success', { 
        user: latestUser,
        allUsers: UserModel.getAll()
    });
};
