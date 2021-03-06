
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , crypto = require('crypto')
  , _ = require('underscore')

/**
 * User Schema
 */

var UserSchema = new Schema({
  name: {type : String},
  company:{type : String},
  clientId:{type : String},
  admin:{type : Boolean, default:false},
  moderator:{type : Boolean, default:false},
  webAdmin:{type: Boolean, default:false},
  username: {type : String},
  provider: {type : String},
  hashed_password: String,
  salt: String
})

/**
 * Virtuals
 */

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() { return this._password })

/**
 * Validations
 */

var validatePresenceOf = function (value) {
  return value && value.length
}

// the below 4 validations only apply if you are signing up traditionally

UserSchema.path('name').validate(function (name) {
  return name.length
}, 'Name cannot be blank')

UserSchema.path('username').validate(function (username) {
  return username.length
}, 'Username cannot be blank')

UserSchema.path('username').validate(function (username) {
    // ensure username is actually a company only email
    // no personal emails allowed
  return username.indexOf('hotmail') == -1 && username.indexOf('yahoo') == -1 && username.indexOf('gmail') == -1 && username.indexOf('aol') == -1;
}, 'Login must be a company email. No personal emails allowed (hotmail, yahoo, gmail, aol)')

UserSchema.path('clientId').validate(function (clientId) {
  return clientId.length
}, 'Client ID cannot be blank')

UserSchema.path('company').validate(function (company) {
  return company.length
}, 'Company cannot be blank')

UserSchema.path('hashed_password').validate(function (hashed_password) {
  return hashed_password.length
}, 'Password cannot be blank')


/**
 * Pre-save hook
 */

UserSchema.pre('save', function(next) {
  if (!this.isNew) return next()

  if (!validatePresenceOf(this.password))
    next(new Error('Invalid password'))
  else
    next()
})

/**
 * Methods
 */

UserSchema.methods = {

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },

  slimOutput:function() {
    return {
      name:this.name,
      company:this.company,
      clientId:this.clientId,
      username:this.username
    }
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function() {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function(password) {
    if (!password) return ''
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
  }
}

mongoose.model('User', UserSchema)
