const User = require('../models/user')
var express = require('express')
const passport = require('../config/ppConfig')
var router = express.Router()

router.get('/signup', function (req, res) {
  res.render('./auth/signup')
})

// router.post('/signup', function (req, res) {
//   User.create({
//     email: req.body.email,
//     name: req.body.name,
//     password: req.body.password
//   }, function (err, createdUser) {
//     if (err) {
//       console.log('An error occurred: ' + err)
//       res.redirect('/auth/signup')
//     } else {
//       res.redirect('/')
//     }
//   })
// })
// Ideally, we want to already be logged in after signup. We can modify the signup route to call the passport.authenticate function again. Note that we'll need to call it as an IIFE, passing the request and response
// router.post('/signup', function (req, res) {
//   // this was written for sequelize previously and does not work here
//   db.user.findOrCreate({
//     where: { email: req.body.email },
//     defaults: {
//       name: req.body.name,
//       password: req.body.password
//     }
//   }).spread(function (user, created) {
//     if (created) {
//       // replace the contents of this if statement with the code below
//       passport.authenticate('local', {
//         successRedirect: '/'
//       })(req, res)
//     } else {
//       console.log('Email already exists')
//       res.redirect('/auth/signup')
//     }
//   }).catch(function (error) {
//     console.log('An error occurred: ', error.message)
//     res.redirect('/auth/signup')
//   })
// })
//
router.post('/signup', function (req, res) {
  User.create({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password
  }, function (err, createdUser) {
    if (err) {
      // FLASH -
      req.flash('error', 'Could not create user account')
      res.redirect('/auth/signup')
    } else {
      // FLASH
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Account created and logged in'
      })(req, res)
    }
  })
})

router.get('/login', function (req, res) {
  res.render('./auth/login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: 'Invalid username and/or password',
  successFlash: 'You have logged in'
}))

router.get('/logout', function (req, res) {
  req.logout()
  // FLASH
  req.flash('success', 'You have logged out')
  res.redirect('/')
})

module.exports = router
