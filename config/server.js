const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const session = require("express-session")
const flash = require("connect-flash")

const passport = require("passport")

// app
const app = express();

// session
app.use(session({
    secret: "secrect",
    resave: true,
    saveUninitialized: true
}))

// passport
app.use(passport.initialize())
app.use(passport.session());

require("./auth").passport
require('./auth')(passport);
// flash
app.use(flash())

// arquivos estaticos 
app.use(express.static('public'))

// body parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// view engine
app.set('view engine', 'ejs');
app.set('views', './app/views');  

// db
mongoose.connect('mongodb://localhost/node').then(() => {
    console.log("DB OK")
}).catch((erro) => {
    console.log("erro de DB: " + erro)
})
mongoose.Promise = global.Promise

// middleware
app.use((req, res, next)=>{
    console.log('Request Type:', req.method + " - " + res.statusCode);
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null
    next();
 })

// rotas 
const index = require('../app/routes/home/index')
const admin = require('../app/routes/admin/admin');
const user = require("../app/routes/users")

app.use("/", index)
app.use("/admin", admin)
app.use("/account", user)

///// ---- ////
module.exports = app;