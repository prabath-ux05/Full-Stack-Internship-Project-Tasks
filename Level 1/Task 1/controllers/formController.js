const User = require('../models/User');

exports.renderForm = (req, res) => {
    // Render the initial multi-step form
    res.render('index');
};

exports.processForm = (req, res) => {
    const { firstName, lastName, role, email, password } = req.body;
    
    // Save to temporary memory store via Model
    User.save({ firstName, lastName, role, email, password });
    
    // Redirect to prevent duplicate form submissions (Post/Redirect/Get pattern)
    res.redirect('/success');
};

exports.renderSuccess = (req, res) => {
    // Retrieve data to show on the success page
    const latestUser = User.findLatest();
    const allUsers = User.findAll();

    if (!latestUser) {
        return res.redirect('/');
    }

    res.render('success', { 
        user: latestUser, 
        totalSubmissions: allUsers.length 
    });
};
