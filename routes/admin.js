const router =require('express').Router();
const isAuth = require('../middleware/is_auth');
const isAdmin = require('../middleware/is_admin')
const adminController = require('../controllers/admin');

router.get('/admin', isAuth, isAdmin, adminController.adminHomePage)


module.exports= router