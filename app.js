//Importing Libraries
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const multer = require('multer')
// Models
 const User = require('./models/users')
 const Product = require('./models/products');
/* 
Routes
*/
// Authentication Routes
const Authroute = require('./routes/auth')
//Admin Routes
const adminRoutes =require('./routes/admin')
// Pages Routes

 const pagesRoutes = require('./routes/pages');
const sequelize = require('./database/db');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const Session = require('./models/sessions');
const app = express();
app.use(cookieParser())
app.use(session({
    secret:'my secret',
    resave:false,
    saveUninitialized: false,
    store: new SequelizeStore({
        db: sequelize,
      }),
    cookie:{}
}))
app.use(flash())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended:true}));
  let storage = multer.diskStorage({
    destination:(req, file, cb)=>{
     cb(null, 'public/images')
    },
    filename:(req, file, cb)=>{
    let extension = file.mimetype.split('/')[1];
      cb(null, Date.now() + "-" + req.body.title + '.' + extension)
    }
  })
app.use(multer({storage: storage}).single('image'))
app.set('view engine', 'ejs')
app.use((req, res, next)=>{
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.user =req.session.user
    next()
})
// pages middleware
app.use(pagesRoutes)
app.use(Authroute)
app.use(adminRoutes);
// Listen to the port
// Product.sync({alter:true})
sequelize.sync().then(()=>{
    app.listen(3000, ()=>{
        console.log('Connected to port 3000')
    })
})
