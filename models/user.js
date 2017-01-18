const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [
      3,
      'your user name must be between 3 and 99 characters'
    ],
    maxlength: [
      99,
      'your user name must be between 3 and 99 characters'
    ]
  },
  email: {
    type: String,
    required: [
      true,
      'an email address is required'
    ],
    unique: [
      true,
      'that email address belongs to an existing user'
    ],
    lowercase: [
      true,
      'please key in your email address in lowercase'
    ],
    match: [
      emailRegex,
      'that email address is not a valid regular expression'
    ]
  },
  password: {
    type: String,
    required: [
      true,
      'a password is required'
    ],
    minlength: [
      8,
      'your password must be between 8 and 99 characters'
    ],
    maxlength: [
      99,
      'your password must be between 8 and 99 characters'
    ]
  }
})

UserSchema.pre('save', function (next) {
  var user = this
  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next()
  // hash the password
  var hash = bcrypt.hashSync(user.password, 10)
  // Override the cleartext password with the hashed one
  user.password = hash
  next()
})

UserSchema.methods.validPassword = function (password) {
  // Compare is a bcrypt method that will return a boolean,
  return bcrypt.compareSync(password, this.password)
}

// what this does is to override the transform function below to .toJSON options, which gets called as a default when .toJSON is called (???)
UserSchema.options.toJSON = {
  transform: function (doc, ret, options) {
        // delete the password from the JSON data, and return
    delete ret.password
    return ret
  }
}

const User = mongoose.model('User', UserSchema)

module.exports = User
