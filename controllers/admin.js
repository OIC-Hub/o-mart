const Product =require('../models/products');
// Pages controllers
const {validationResult} = require('express-validator');
exports.adminHomePage= (req, res)=>{
 res.render('admin/index.ejs', {title:'Home'});
}
// Product
exports.addProductPage=(req, res)=>{
    res.render('admin/add-product.ejs', {title:'Add product'});
}
exports.addProduct=(req, res)=>{
    const {title, price, description, image } = req.body;
    const errors= validationResult(req);
    if(! errors.isEmpty()){ 
        return res.status(422).json(errors.array())
    }
    Product.create({
    title:title,
    price:price,
    description:description,
    image:image,
    userId: req.session.user.id
  }).then(user=>{
     return res.status(200).json([
        {success: 'success'},
        user
     ])
  }).catch(err => {
    return res.status(422).json(
        [
        {error: 'error'},
         err
        ])
  })
}
exports.logout=(req, res)=>{
    req.session.destroy(()=>{
      return  res.redirect('/login')
    })
    
}
