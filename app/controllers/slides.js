var mongoose = require('mongoose')
  , async = require('async')
  , Slide = mongoose.model('Slide')
  , _ = require('underscore')

exports.create = function (req, res) {
  var slide = new Slide(req.body)
  slide.save()
  res.jsonp(slide)
}

exports.show = function(req, res){
  res.jsonp(req.slide);
}

exports.slide = function(req, res, next, id){
  var Slide = mongoose.model('Slide')
  Slide.load(id, function (err, slide) {
    if (err) return next(err)
    if (!slide) return next(new Error('Failed to load slide ' + id))
    req.slide = slide
    next()
  })
}

exports.all = function(req, res){
  var query = req.query ? req.query : {};
 Slide.find(query).exec(function(err, slides) {
   if (err) {
      res.render('error', {status: 500});
   } else {
      res.jsonp(slides);
   }
 });
}

exports.update = function(req, res){
  var slide = req.slide
  slide = _.extend(slide, req.body)
  slide.save(function(err) {
    res.jsonp(slide)
  })
}

exports.destroy = function(req, res){
  var slide = req.slide
  slide.remove(function(err){
    if (err) {
      res.render('error', {status: 500});
    } else {
      res.jsonp(1);
    }
  })
}
