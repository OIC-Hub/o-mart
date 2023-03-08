const User = require('../models/users')
const {validationResult} = require('express-validator/check')
exports.signupPage = (req, res)=>{

    let errors = req.flash('errors');
   res.render('auth/signup.ejs',{title:'Sign-Up', errorMessage: errors} );
}
exports.postSignup=(req, res) => {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
       req.flash('errors', errors.array())
       res.redirect('/sign-up')
    }
}
exports.loginPage = (req, res)=>{
    res.render('auth/login', {title:'Login'});
}
exports.login=(req, res)=>{
    const {email, password}=req.body
    User.findOne({
        where:{
            email:email
        }
    }).then(user =>{
        if(! user){
          return   res.redirect('/login');
        }
        return user
    }).then(user =>{
        if(user.password !== password){
            return   res.redirect('/login');
        }
         req.session.isLoggedIn= true;
         req.session.user =user
         return   res.redirect('/');
    }).catch(err =>{
        console.log(err)
    })
}