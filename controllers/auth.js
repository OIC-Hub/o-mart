const User = require('../models/users')
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const {validationResult} = require('express-validator')
const bcrypt =require('bcrypt');
const session = require('express-session');
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
            const email ={
              to: [user.email, 'omolewu12@gmail.com'],
              from: {
                name: 'O-Mart',
                email: 'info@o-mart.com.ng'
              },
              subject: 'Welcome to O-mart Shopping',
              html:`
               <h2>Welcome ${user.email}</h2>
              `
            }

            var transport = nodemailer.createTransport({
              host: "sandbox.smtp.mailtrap.io",
              port: 2525,
              auth: {
                user: "username",
                pass: "password"
              }
            });
            transport.sendMail(email).then((respons)=>{
              return res.redirect('/login');
              console.log()
            }).catch(err=> console.log(err))
         
       }).catch(err => console.log(err))
    }).catch(err => console.log(err))
  


}

// Login Controller
exports.loginPage = (req, res)=>{
    if(!req.session.isLoggedIn){
  res.render('auth/login',
     {
        title:'Login',
         loginErrors: req.flash('loginErrors'),
        userErr: req.flash('userErr'),
        passwordErr: req.flash('passwordErr') 
    });
  }else{
    res.redirect('/')
  }
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

bcrypt.compare(password, user.password)
.then(match =>{
  if( ! match){
    req.flash('passwordErr', 'Invalid  password')
   return req.session.save(()=>{
        res.redirect('/login')
    })
  }
  req.session.isLoggedIn=true;
  req.session.user = user
  if(user.role === 'user'){
    res.redirect('/')
  }
  else{
    res.redirect('/admin')
  }
})
}).catch(err => console.log(err))
}

exports.logout = (req, res)=>{
  return req.session.destroy(()=>{
    res.redirect('/login')
  })
}
exports.resetPassword = (req, res)=>{
 // 
}
exports.forgotPassword= (req, res)=>{
  res.render('auth/forgotpassword', {title:'Forgot Password', error: req.flash('error'), userError:req.flash('userError')})
}
exports.forgotPasswordPost = (req, res)=>{
  const {email} = req.body;
  const errors = validationResult(req);
  if(! errors.isEmpty()){
    req.flash('error', errors.array())
   return  req.session.save(()=>{
      return  res.redirect('/forgot-password')
    })
  }
crypto.randomBytes(32, (err, buffer)=>{
  if(err){
    req.flash('userError', 'Unable to perform this function at this moment');
   return req.session.save(()=>{
      res.redirect('/forgot-password')
    })
  }
 let token = buffer.toString('hex');
 User.findOne({
  where:{
    email:email
  }
}).then(user=>{
  if(! user){
    req.flash('userError', 'User does not exist');
   return  req.session.save(()=>{
      res.redirect('/forgot-password')
    })
  }
  user.resetToken = token;
  user.resetTokenExpiration = Date.now() + 90000000
 return user.save()
}).then(user=>{

  let email = {
    to: user.email,
    from:{
      name:'O-mart store',
      email: 'info@o-mart.com'
    },
    subject: 'Retrive password',
    html: `
     <h2>You requested to retrive your password</h2>
     <p><a href="http:/localhost:3000/retrive-password/${token}">Click here </a> to retrive your password</p>
     <p>This link will expire in the next 24 hours.<br>
     Kindly ignore if you don't send this request
     </p>
    `
  }
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "UserName",
      pass: "UserPassword"
    }
  });
  transport.sendMail(email).then((respons)=>{
    return res.redirect('/login');
  }).catch(err=> console.log(err))
  return res.redirect('/login');
});

})
}

exports.retrivePassword=(req, res)=>{
  let token = req.params.token;
  User.findOne({
    where:{
      resetToken:token
    }
  }).then(user=>{
    if(!user){
      req.flash('retrivePassword', 'invalid URL');
     return req.session.save(()=>{
        res.redirect('/login')
      })
    }
    if(user.resetTokenExpiration < Date.now()){
      req.flash('retrivePassword', 'URL has expired');
      return req.session.save(()=>{
         res.redirect('/login')
       })
    }
   return res.render('auth/retrive-password', {title:'Retrive Password'})
  })
}