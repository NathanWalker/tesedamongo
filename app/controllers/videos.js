var mongoose = require('mongoose')
  , async = require('async')
  , Video = mongoose.model('Video')
  , _ = require('underscore')

exports.create = function (req, res) {
  var video = new Video(req.body)
  video.save()
  res.jsonp(video)
}

exports.show = function(req, res){
  res.jsonp(req.video);
}

exports.video = function(req, res, next, id){
  var Video = mongoose.model('Video')
  Video.load(id, function (err, video) {
    if (err) return next(err)
    if (!video) return next(new Error('Failed to load video ' + id))
    req.video = video
    next()
  })
}

exports.all = function(req, res){
 Video.find().exec(function(err, videos) {
   if (err) {
      res.render('error', {status: 500});
   } else {
      res.jsonp(videos);
   }
 });
}

exports.update = function(req, res){
  var video = req.video
  video = _.extend(video, req.body)
  video.save(function(err) {
    res.jsonp(video)
  })
}

exports.destroy = function(req, res){
  var video = req.video
  video.remove(function(err){
    if (err) {
      res.render('error', {status: 500});
    } else {
      res.jsonp(1);
    }
  })
}
