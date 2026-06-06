const { validationResult } = require('express-validator');

function getLogin(req, res, next) {
    res.render('index');
}

function postLogin(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('index', {
            errors: errors.mapped(),
            data: { username: req.body.username },
        });
    }
    // TODO: authenticate user against database
    res.redirect('/inbox');
}

module.exports = {
    getLogin,
    postLogin,
};