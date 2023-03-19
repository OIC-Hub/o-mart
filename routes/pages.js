const router = require('express').Router();
const pagesController = require('../controllers/pages');

 router.get('/', pagesController.homePage);
 router.use((req, res)=>{
    res.render('pages/404.ejs', {
        title: "Error 404"
    });
 });

 module.exports = router