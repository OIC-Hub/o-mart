//Importing Libraries
const express = require('express');
const path = require('path');
const session = require('express-session');
// Models
 const User = require('./models/users')
 const Product = require('./models/products');
/* 
Routes
*/
// Authentication Routes
const Authroute = require('./routes/auth')
// Pages Routes

 const pagesRoutes = require('./routes/pages');
const sequelize = require('./database/db');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const Session = require('./models/sessions');
const app = express();
app.use(session({
    secret:'my secret',
    resave:false,
    saveUninitialized: false,
    store: new SequelizeStore({
        db: sequelize,
      }),
    cookie:{}
}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended:true}));

app.set('view engine', 'ejs')
// pages middleware
app.use(pagesRoutes)
app.use(Authroute)
// Listen to the port
sequelize.sync().then(()=>{
    app.listen(3000, ()=>{
        console.log('Connected to port 3000')
    })
})
