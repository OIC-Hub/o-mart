 exports.error404=(req, res)=>{
    res.render('pages/404.ejs', {
        title: "Error 404"
    });
 }
 exports.error500 = (req, res, next)=>{
    res.status(500).render('pages/500.ejs', {
        title: "Error 500"
    });
 }