const Product =require('../models/products');
// Pages controllers
const {validationResult} = require('express-validator');
exports.adminHomePage= (req, res)=>{
  let page = Number.parseInt(req.query.page) || 1;
 let totalProducts;
  let totalItem= 5;
  Product.count().then(totalProduct =>{
    totalProducts = totalProduct
    Product.findAll({ 
      offset:(page - 1) * totalItem,
       limit: totalItem
       })
  .then(products =>{
    if(products){
     return res.render('admin/index.ejs',
      {
        title:'Home',
       products: products,
       previousPage: page - 1, 
       currentPage: page, 
       hasNextPage: totalProducts > totalItem * page, 
       hasPreviousPage: page > 1,
       nextPage: page + 1, 
       pages: totalProducts/totalItem 


      });
    }
  })
  .catch(err=> console.log(err))

  }).catch(err => console.log(err))

 
}
// Product
exports.addProductPage=(req, res)=>{
     let error = req.flash('productErr');
     let success= req.flash('success');
    res.render('admin/add-product.ejs',
     {title:'Add product',
    error: error, success:success});
}
exports.addProduct=(req, res)=>{
    const {title, price, description, image } = req.body;
     
    
    const errors= validationResult(req);
    if(! errors.isEmpty()){
        req.flash('productErr', errors.array())
       return  req.session.save(()=>{
          res.redirect('/add-product')
        })
      }
    let imagepath = req.file.destination + req.file.filename 
    Product.create({
    title:title,
    price:price,
    description:description,
    image:imagepath,
    userId: req.session.user.id
  }).then(product=>{
        if(product){
          req.flash('succes', 'Product added successfully')
        return  req.session.save(()=>{
          res.redirect('/add-product')
         })
          
        }
  }).catch(err => {
   console.log(err)
  })
}
exports.logout=(req, res)=>{
    req.session.destroy(()=>{
      return  res.redirect('/login')
    })
    
}
