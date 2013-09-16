var async = require('async')

module.exports = function (app, passport, auth) {

  // user routes
  var users = require('../app/controllers/users')
  app.get('/signin', users.signin)
  app.get('/signup', users.signup)
  app.get('/signout', users.signout)
  app.post('/users', users.create)
  app.post('/users/session', passport.authenticate('local', {failureRedirect: '/#!/support?f=1#form-area', failureFlash: 'Invalid email or password.'}), users.session)
  app.get('/users/me', users.me)
  app.get('/users', users.all)
  app.get('/users/:userId', users.show)
  app.put('/users/:userId', auth.requiresLogin, users.update)
  app.del('/users/:userId', auth.requiresLogin, users.destroy)

  app.param('userId', users.user)

  // league routes
  var leagues = require('../app/controllers/leagues')
  app.get('/leagues', leagues.all)
  app.post('/leagues', auth.requiresLogin, leagues.create)
  app.get('/leagues/:leagueId', leagues.show)
  app.put('/leagues/:leagueId', auth.requiresLogin, leagues.update)
  app.del('/leagues/:leagueId', auth.requiresLogin, leagues.destroy)

  app.param('leagueId', leagues.league)

  // fantasy team routes
  var fantasyteams = require('../app/controllers/fantasyteams')
  app.get('/fantasyteams', fantasyteams.all)
  app.post('/fantasyteams', auth.requiresLogin, fantasyteams.create)
  app.get('/fantasyteams/:fantasyTeamId', fantasyteams.show)
  app.put('/fantasyteams/:fantasyTeamId', auth.requiresLogin, fantasyteams.update)
  app.del('/fantasyteams/:fantasyTeamId', auth.requiresLogin, fantasyteams.destroy)

  app.param('fantasyTeamId', fantasyteams.fantasyteam)

    // product routes
  var products = require('../app/controllers/products')
  app.get('/products', products.all)
  app.post('/products', auth.requiresLogin, products.create)
  app.get('/products/:productId', products.show)
  app.put('/products/:productId', auth.requiresLogin, products.update)
  app.del('/products/:productId', auth.requiresLogin, products.destroy)

  app.param('productId', products.product)

  // player routes
  var players = require('../app/controllers/players')
  app.get('/players', players.all)
  app.get('/players/:playerId', players.show)

  app.param('playerId', players.player)

  // home route
  var index = require('../app/controllers/index')
  app.get('/', index.render)

}
