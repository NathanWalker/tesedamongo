var mongoose = require('mongoose')
  , async = require('async')
  , Post = mongoose.model('Post')
  , _ = require('underscore')

exports.create = function (req, res) {
  var post = new Post(req.body)
  post.save()
  res.jsonp(post)
}

exports.show = function(req, res){
  res.jsonp(req.post);
}

exports.post = function(req, res, next, id){
  var Post = mongoose.model('Post')
  Post.load(id, function (err, post) {
    if (err) return next(err)
    if (!post) return next(new Error('Failed to load post ' + id))
    req.post = post
    next()
  })
}

exports.all = function(req, res){
 Post.find().exec(function(err, posts) {
   if (err) {
      res.render('error', {status: 500});
   } else {
      res.jsonp(posts);
   }
 });
}

exports.update = function(req, res){
  var post = req.post
  post = _.extend(post, req.body)
  post.save(function(err) {
    res.jsonp(post)
  })
}

exports.destroy = function(req, res){
  var post = req.post
  post.remove(function(err){
    if (err) {
      res.render('error', {status: 500});
    } else {
      res.jsonp(1);
    }
  })
}
