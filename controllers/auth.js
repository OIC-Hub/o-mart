const User = require('../models/users')
exports.signupPage = (req, res)=>{
    res.render('auth/signup.ejs',{title:'Sign-Up'} );
}
exports.postSignup=(req, res)=>{
   const {email, password} = req.body;
   let role="user";
    User.create({
        email:email,
        password: password,
        role: role
    }).then(user =>{
       res.redirect('/sign-up');
    }).catch(err => console.log(err))

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