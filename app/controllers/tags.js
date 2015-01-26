var mongoose = require('mongoose')
  , async = require('async')
  , Tag = mongoose.model('Tag')
  , _ = require('underscore')

exports.create = function (req, res) {
  var tag = new Tag(req.body)
  tag.save()
  res.jsonp(tag)
}

exports.show = function(req, res){
  res.jsonp(req.tag);
}

exports.tag = function(req, res, next, id){
  var Tag = mongoose.model('Tag')
  Tag.load(id, function (err, tag) {
    if (err) return next(err)
    if (!tag) return next(new Error('Failed to load tag ' + id))
    req.tag = tag
    next()
  })
}

exports.all = function(req, res){
  var query = req.query ? req.query : {};
 Tag.find(query).exec(function(err, tags) {
   if (err) {
      res.render('error', {status: 500});
   } else {
      res.jsonp(tags);
   }
 });
}

exports.update = function(req, res){
  var tag = req.tag
  tag = _.extend(tag, req.body)
  tag.save(function(err) {
    res.jsonp(tag)
  })
}

exports.destroy = function(req, res){
  var tag = req.tag
  tag.remove(function(err){
    if (err) {
      res.render('error', {status: 500});
    } else {
      res.jsonp(1);
    }
  })
}
