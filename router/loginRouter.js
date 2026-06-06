const express = require('express');
const { check } = require('express-validator');
const { getLogin, postLogin } = require('../controller/loginController');
const decorateHtmlRes = require('../middlewares/common/decorateHtmlRes');

const router = express.Router();

const loginValidators = [
    check("username")
        .trim()
        .notEmpty()
        .withMessage("Email or mobile number is required.")
        .custom((value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const mobileRegex = /^\+?[\d\s\-(). ]{7,15}$/;
            if (!emailRegex.test(value) && !mobileRegex.test(value)) {
                throw new Error("Enter a valid email address or mobile number.");
            }
            return true;
        }),
    check("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters."),
];

router.get('/', decorateHtmlRes('Login'), getLogin);
router.post('/', decorateHtmlRes('Login'), loginValidators, postLogin);

module.exports = router;
