var mongoose = require('mongoose')
  , async = require('async')
  , Image = mongoose.model('Image')
  , _ = require('underscore')

exports.create = function (req, res) {
  var image = new Image(req.body)
  image.save()
  res.jsonp(image)
}

exports.show = function(req, res){
  res.jsonp(req.image);
}

exports.image = function(req, res, next, id){
  var Image = mongoose.model('Image')
  Image.load(id, function (err, image) {
    if (err) return next(err)
    if (!image) return next(new Error('Failed to load image ' + id))
    req.image = image
    next()
  })
}

exports.all = function(req, res){
 Image.find().exec(function(err, images) {
   if (err) {
      res.render('error', {status: 500});
   } else {
      res.jsonp(images);
   }
 });
}

exports.update = function(req, res){
  var image = req.image
  image = _.extend(image, req.body)
  image.save(function(err) {
    res.jsonp(image)
  })
}

exports.destroy = function(req, res){
  var image = req.image
  image.remove(function(err){
    if (err) {
      res.render('error', {status: 500});
    } else {
      res.jsonp(1);
    }
  })
}
