var async = require('async');
var fs= require('fs');
var path = require('path');
var express = require('express');
var AWS = require('aws-sdk');
var accessKeyId =  process.env.AWS_ACCESS_KEY || "xxxxxx";
var secretAccessKey = process.env.AWS_SECRET_KEY || "+xxxxxx+B+xxxxxxx";
AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
});

var s3 = new AWS.S3();
var nodeEnv = process.env.NODE_ENV || 'development';

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

  // files
  app.post('/files', function(req, res){
    if (req.body) {
      console.log(JSON.stringify(req.body));
    }

    var cnt = 0;
    var fileKeys = Object.keys(req.files);
    var key = fileKeys[cnt];
    var file = req.files[key];

    var dataSuccess = {
      filenames: []
    };


    var writeTheFile = function(file, key) {
      console.log('Found a file named ' + key + ', it is ' + file.size + ' bytes');
      console.log(file.path);
      fs.readFile(file.path, function (err, data) {
        var basePath = path.join(__dirname, '../public/uploads')
        var fileName = Date.now().toString() + "-" + Math.floor((Math.random()*10000)+1) + "-" + key;
        var newPath = path.join(basePath, fileName);
        console.log('writing file to: ' + newPath);

        if(nodeEnv == 'development'){
          fs.writeFile(newPath, data, function (err) {
            cnt++;
            dataSuccess.filenames.push(fileName);
            if (cnt == fileKeys.length){
              res.send(dataSuccess);
            } else {
              key = fileKeys[cnt];
              writeTheFile(req.files[key], key);
            }
          });
        } else {

          // amazon s3
          var params = {
              Bucket: 'tesedamongo',
              Key: fileName,
              Body: "Hello"
          };

          s3.putObject(params, function (perr, pres) {
              if (perr) {
                  console.log("Error uploading data: ", perr);
              } else {
                  console.log("Successfully uploaded data to myBucket/myKey");
                  cnt++;
                  dataSuccess.filenames.push(fileName);
                  if (cnt == fileKeys.length){
                    res.send(dataSuccess);
                  } else {
                    key = fileKeys[cnt];
                    writeTheFile(req.files[key], key);
                  }
              }
          });

        }
      });
    };

    writeTheFile(file, key);
  });

  // home route
  var index = require('../app/controllers/index')
  app.get('/', index.render)

}
