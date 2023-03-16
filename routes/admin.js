const router =require('express').Router();
const{check} = require('express-validator');
const isAuth = require('../middleware/is_auth');
const isAdmin = require('../middleware/is_admin')
const adminController = require('../controllers/admin');

router.get('/admin', isAuth, isAdmin, adminController.adminHomePage)
router.get('/add-product', isAuth, isAdmin, adminController.addProductPage);
router.post('/add-product',[
    check('title', ' Title can not be blank or invalid title').notEmpty().isString(),
    check('price', 'Price can not be blank or invalid price').notEmpty().isNumeric(),
    check('description', ' escription  not be blank or invalid description').notEmpty().isString(),
],
 adminController.addProduct);
module.exports= router