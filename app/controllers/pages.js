var mongoose = require('mongoose')
  , async = require('async')
  , Page = mongoose.model('Page')
  , _ = require('underscore')

exports.create = function (req, res) {
  var page = new Page(req.body)
  page.save()
  res.jsonp(page)
}

exports.show = function(req, res){
  res.jsonp(req.page);
}

exports.page = function(req, res, next, id){
  var Page = mongoose.model('Page')
  Page.load(id, function (err, page) {
    if (err) return next(err)
    if (!page) return next(new Error('Failed to load page ' + id))
    req.page = page
    next()
  })
}

exports.all = function(req, res){
  var query = req.query ? req.query : {};
  var resultHandler = function(err, pages) {
   if (err) {
      res.render('error', {status: 500});
   } else {
      res.jsonp(pages);
   }
 };

  if (query.content){
    // search for any content
    Page.where('content').regex(new RegExp(query.content, "i")).exec(resultHandler);
  } else {
    Page.find(query).exec(resultHandler);
  }
}

exports.update = function(req, res){
  var page = req.page
  page = _.extend(page, req.body)
  page.save(function(err) {
    res.jsonp(page)
  })
}

exports.destroy = function(req, res){
  var page = req.page
  page.remove(function(err){
    if (err) {
      res.render('error', {status: 500});
    } else {
      res.jsonp(1);
    }
  })
}
