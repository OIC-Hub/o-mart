exports.homePage = (req, res)=>{
   let user= req.session.user
    res.json(user)
    // res.render('pages/index.ejs', {title:'Home'});
}