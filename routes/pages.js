const router = require('express').Router();
const pagesController = require('../controllers/pages');

 router.get('/', pagesController.homePage);
module.exports = router