const router = require('express').Router()
const authController = require('../controllers/auth')

router.get('/sign-up', authController.signupPage)
router.post('/sign-up', authController.postSignup);
router.get('/login', authController.loginPage);
router.post('/login', authController.login);
module.exports = router