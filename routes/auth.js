const router = require('express').Router()
const User = require('../models/users');
const { check} = require('express-validator/check');
const { isEmpty } = require('validator');
const authController = require('../controllers/auth')
// Sign-up Routes
router.get('/sign-up', authController.signupPage)
router.post('/sign-up', [
    check('email').notEmpty().withMessage('Your email is required').isEmail()
    .withMessage('Invalid email')
    .normalizeEmail()
    .custom((value, {req})=>{
      return User.findOne({where:{email:value}}).then(match=>{
        if(match){
            throw new Error('Email is already in use');
        }
        return true
       })
    }),
    check('password').notEmpty().withMessage('Password is required').isAlphanumeric().withMessage('Your password must contain both alphabet and numbers').isLength({ min: 6 }).withMessage('Your password lenth must greater than 6 characters'),
    check('confirm_password').notEmpty().withMessage('Confirm password must not be empty').custom((value, {req})=>{
        if(value !== req.body.password){
            throw new Error('The password does not match');
        }
        return true
    })


], authController.postSignup);

// Login Routes
router.get('/login', authController.loginPage);
router.post('/login',[
    check('email', "Email doest not exist or invalid email").notEmpty().withMessage('Your email is required')
    .isEmail().withMessage('Invalid email').trim(),
    check('password').notEmpty().trim()
], authController.login);


module.exports = router