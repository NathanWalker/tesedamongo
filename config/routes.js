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

  // product routes
  var products = require('../app/controllers/products')
  app.get('/products', products.all)
  app.post('/products', auth.requiresLogin, products.create)
  app.get('/products/:productId', products.show)
  app.put('/products/:productId', auth.requiresLogin, products.update)
  app.del('/products/:productId', auth.requiresLogin, products.destroy)

  app.param('productId', products.product)

  // videos routes
  var videos = require('../app/controllers/videos')
  app.get('/videos', videos.all)
  app.post('/videos', auth.requiresLogin, videos.create)
  app.get('/videos/:videoId', videos.show)
  app.put('/videos/:videoId', auth.requiresLogin, videos.update)
  app.del('/videos/:videoId', auth.requiresLogin, videos.destroy)

  app.param('videoId', videos.video)

  // posts routes
  var posts = require('../app/controllers/posts')
  app.get('/posts', posts.all)
  app.post('/posts', auth.requiresLogin, posts.create)
  app.get('/posts/:postId', posts.show)
  app.put('/posts/:postId', auth.requiresLogin, posts.update)
  app.del('/posts/:postId', auth.requiresLogin, posts.destroy)

  app.param('postId', posts.post)

  // tags routes
  var tags = require('../app/controllers/tags')
  app.get('/tags', tags.all)
  app.post('/tags', auth.requiresLogin, tags.create)
  app.get('/tags/:tagId', tags.show)
  app.put('/tags/:tagId', auth.requiresLogin, tags.update)
  app.del('/tags/:tagId', auth.requiresLogin, tags.destroy)

  app.param('tagId', tags.tag)

  // videos routes
  var images = require('../app/controllers/images')
  app.get('/images', images.all)
  app.post('/images', auth.requiresLogin, images.create)
  app.get('/images/:imageId', images.show)
  app.put('/images/:imageId', auth.requiresLogin, images.update)
  app.del('/images/:imageId', auth.requiresLogin, images.destroy)

  app.param('imageId', images.image)

  // pages routes
  var pages = require('../app/controllers/pages')
  app.get('/pages', pages.all)
  app.post('/pages', auth.requiresLogin, pages.create)
  app.get('/pages/:pageId', pages.show)
  app.put('/pages/:pageId', auth.requiresLogin, pages.update)
  app.del('/pages/:pageId', auth.requiresLogin, pages.destroy)

  app.param('pageId', pages.page)

  // home route
  var index = require('../app/controllers/index')
  app.get('/', index.render)

}
