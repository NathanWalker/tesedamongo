var mongoose = require('mongoose')
  , async = require('async')
  , Post = mongoose.model('Post')
  , _ = require('underscore')

exports.create = function (req, res) {
  var post = new Post(req.body)
  var query = req.query ? req.query : {};

  var createPost = function(){
    post.save()
    res.jsonp(post)
  };

  if(query.tagId){
    var Tag = mongoose.model('Tag')
    Tag.load(query.tagId, function (err, tag) {
      if (!err && tag) {
        post.tags.push(tag);
        createPost();
      } else {
        createPost();
      }
    });
  } else {
     createPost();
  }
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
  var query = req.query ? req.query : {};
 Post.find(query).populate('tags').exec(function(err, posts) {
   if (err) {
      res.jsonp(0);
   } else {
      res.jsonp(posts);
   }
 });
}

exports.update = function(req, res){
  var post = req.post
  post = _.extend(post, req.body)
  var query = req.query ? req.query : {};

  var updatePost = function(){
    post.save(function(err) {
      res.jsonp(post)
    })
  };

  if(query.tagId){
    var Tag = mongoose.model('Tag')
    Tag.load(query.tagId, function (err, tag) {
      if (!err && tag) {
        post.tags.push(tag);
        updatePost();
      } else {
        updatePost();
      }
    });
  } else if(query.removeTagId){
    var tagIndex = -1;
    for(var i = 0; i < post.tags.length; i++){
      var postTag = post.tags[i];
      if(postTag._id == query.removeTagId){
        tagIndex = i;
        break;
      }
    }
    if(tagIndex > -1){
      post.tags.splice(tagIndex, 1);
    }
    updatePost()
  } else {
    updatePost()
  }


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
