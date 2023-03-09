const User = require('../models/users')
const {validationResult} = require('express-validator')
const bcrypt =require('bcrypt');
exports.signupPage = (req, res)=>{

    let errors = req.flash('errors');

   res.render('auth/signup.ejs',{title:'Sign-Up', errorMessage: errors, oldInput: req.flash('oldInput')} );
}
exports.postSignup=(req, res) => {
    let {email, password} = req.body;
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        const oldInput ={
            email: email,
            password:password,
            confirmPassword:req.body.confirm_password
        }
        req.flash('oldInput', oldInput);
       req.flash('errors', errors.array())
      return req.session.save(()=>{
         return res.redirect(301, '/sign-up')
       }) 
    }
    bcrypt.hash(password, 12).then(hashedPassword=>{
        User.create({email: email,
            password:hashedPassword,
             role:'user'})
           .then(user =>{
           return res.redirect('/login');
       }).catch(err => console.log(err))
    }).catch(err => console.log(err))
  


}
exports.loginPage = (req, res)=>{
    res.render('auth/login',
     {
        title:'Login',
         loginErrors: req.flash('loginErrors'),
        userErr: req.flash('userErr'),
        passwordErr:req.flash('passwordErr')
        
    });
}
exports.login=(req, res)=>{
    const {email, password}=req.body
    errors = validationResult(req);

    if(! errors.isEmpty()){
      req.flash('loginErrors', errors.array())
     return req.session.save(()=>{
        res.redirect('/login')
      })
    }
   User.findOne({
    where:{
    email:email
   }
}).then(user=>{

    
 if(!user){
    req.flash('userErr', 'User does not exist')
   return  req.session.save(()=>{
      res.redirect('/login')  
    })
}

return user
}).then(user=>{
   
    if(user.password !== password){
        req.flash('PasswordErr', 'Invalid password')
   return  req.session.save(()=>{
    res.redirect('/login')  
    }) 
    }
    req.session.isLoggedIn=true;
    req.session.user = user
  return  res.redirect('/')
}).catch(err => console.log(err))
  
}