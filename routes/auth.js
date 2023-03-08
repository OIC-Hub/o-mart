const router = require('express').Router()
const { check} = require('express-validator/check');
const { isEmpty } = require('validator');
const authController = require('../controllers/auth')

router.get('/sign-up', authController.signupPage)
router.post('/sign-up', [
    check('email').notEmpty().withMessage('Your email is required').isEmail().withMessage('Invalid email').normalizeEmail(),
    check('password').notEmpty().withMessage('Password is required').isAlphanumeric().withMessage('Your password must contain both alphabet and numbers').isLength({ min: 6 }).withMessage('Your password lenth must greater than 6 characters'),
    check('confirm_password').notEmpty().withMessage('Confirm password must not be empty')
], authController.postSignup);
router.get('/login', authController.loginPage);
router.post('/login', authController.login);
module.exports = router