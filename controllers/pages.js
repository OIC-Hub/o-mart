  const Product = require('../models/products')

exports.homePage = (req, res, next)=>{
   let user= req.session.user
   let page = req.query.page || 1;
   let totalitemsPerPage = 8
    console.log(page)
    let totalItems;

Product.count().then(dataTotalItems =>{
   
    totalItems = dataTotalItems
    Product.findAll({
        offset: (page -1) * totalitemsPerPage ,
        limit:totalitemsPerPage
       })
       .then(product => {
        res.render('pages/index.ejs',
         {
            title:'Home', 
            products:product, 
            hasprevious: page > 1,
            previousValue:page - 1,
            hasNext: totalItems > page * totalitemsPerPage,
            nextvalue: page + 1,
            totalPages: Math.ceil(totalItems / totalitemsPerPage)
        });    
       })
       .catch(err => {
          return next(err)
       })

})

.catch(err => console.log(err))
   
    
}