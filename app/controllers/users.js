
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User')

//exports.signin = function (req, res) {}

/**
 * Auth callback
 */

exports.authCallback = function (req, res, next) {
  res.redirect('/')
}

/**
 * Show login form
 */

exports.signin = function (req, res) {
  res.render('users/signin', {
    title: 'Signin',
    message: req.flash('error')
  })
}

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
  res.render('users/signup', {
    title: 'Sign up',
    user: new User()
  })
}

/**
 * Logout
 */

exports.signout = function (req, res) {
  req.logout()
  res.redirect('/')
}

/**
 * Session
 */

exports.session = function (req, res) {
  res.redirect('/#!/support')
}

/**
 * Create user
 */

exports.create = function (req, res) {
  var user = new User(req.body)
  user.provider = 'local'

  // hard coded client ids for administration
  if(user.clientId == 'TesedaAdmin123'){
    user.admin = true;
  }
  if(user.clientId == 'TesedaModerator123'){
    user.moderator = true;
  }
  user.save(function (err) {
    if (err) {
      var errors = err.errors.toString();
      return res.redirect('/#!/support?f=2&err=' + errors + '&user=' + user.toJSON() + '#form-area')
      /*res.render('users/signup', { errors: err.errors, user: user })*/
    }
    req.logIn(user, function(err) {
      if (err) return next(err)
      return res.redirect('/#!/support?a=1')
    })
  })
}

/**
 *  Show profile
 */

exports.show = function (req, res) {
  var user = req.profile
  res.render('users/show', {
    title: user.name,
    user: user
  })
}

exports.me = function (req, res) {
  res.jsonp(req.user || null);
}

exports.all = function(req, res){
  var query = req.query ? req.query : {};
 User.find(query).exec(function(err, users) {
   if (err) {
      res.render('error', {status: 500});
   } else {
      res.jsonp(users);
   }
 });
}

/**
 * Find user by id
 */

exports.user = function (req, res, next, id) {
  User
    .findOne({ _id : id })
    .exec(function (err, user) {
      if (err) return next(err)
      if (!user) return next(new Error('Failed to load User ' + id))
      req.profile = user
      next()
    })
}

exports.update = function(req, res){
  var user = req.profile
  user = _.extend(user, req.body)
  user.save(function(err) {
    res.jsonp(user)
  })
}

exports.destroy = function(req, res){
  var user = req.profile
  user.remove(function(err){
    if (err) {
      res.render('error', {status: 500});
    } else {
      res.jsonp(1);
    }
  })
}
