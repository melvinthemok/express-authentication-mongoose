const session = require('express-session')
const flash = require('connect-flash')
const passport = require('./config/ppConfig')
require('dotenv').config({ silent: true })
const isLoggedIn = require('./middleware/isLoggedIn')
var express = require('express')
var ejsLayouts = require('express-ejs-layouts')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
const userController = require('./controllers/auth')
var app = express()

if (process.env.NODE_ENV === 'test') {
  mongoose.connect('mongodb://localhost/express-authentication')
} else {
  mongoose.connect('mongodb://localhost/express-authentication-test')
}

app.set('view engine', 'ejs')

app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(ejsLayouts)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
// You must include the passport configuration below your session configuration. This ensures that Passport is aware that the session module exists.
app.use(passport.initialize())
app.use(passport.session())
/*
 * Include the flash module by calling it within app.use().
 * IMPORTANT: This MUST go after the session module
 */
app.use(flash())

app.use(function (req, res, next) {
  // before every route, attach the flash messages and current user to res.locals
  res.locals.alerts = req.flash()
  res.locals.currentUser = req.user
  next()
})

app.get('/', function (req, res) {
  res.render('index')
})

// app.use(isLoggedIn)
// app.get('/profile', function (req, res) {
//   res.render('profile')
// })
//
app.get('/profile', isLoggedIn, function (req, res) {
  res.render('profile')
})

app.use('/auth', require('./controllers/auth'))

var server = app.listen(process.env.PORT || 3000, () => {
  console.log('Server listening')
})

module.exports = server
