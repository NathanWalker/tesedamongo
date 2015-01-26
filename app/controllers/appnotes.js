var mongoose = require('mongoose')
  , async = require('async')
  , AppNote = mongoose.model('AppNote')
  , _ = require('underscore')

exports.create = function (req, res) {
  var appnote = new AppNote(req.body)
    appnote.save()
    res.jsonp(appnote)
}

exports.show = function(req, res){
  res.jsonp(req.appnote);
}

exports.appnote = function(req, res, next, id){
  AppNote.load(id, function (err, appnote) {
    if (err) return next(err)
    if (!appnote) return next(new Error('Failed to load appnote ' + id))
    req.appnote = appnote
    next()
  })
}

exports.all = function(req, res){
  var query = req.query ? req.query : {};
  var resultHandler = function(err, appnotes) {
   if (err) {
      res.jsonp(0);
   } else {
      res.jsonp(appnotes);
   }
 };

if (query.search){
  var re = new RegExp(query.search, "i");
  AppNote.find().or([{name: re}, {description: re}]).exec(resultHandler);
} else {
  AppNote.find(query).exec(resultHandler);
}

}

exports.update = function(req, res){
  var appnote = req.appnote
  appnote = _.extend(appnote, req.body)
  appnote.save(function(err) {
    res.jsonp(appnote)
  })

}

exports.destroy = function(req, res){
  var appnote = req.appnote
  appnote.remove(function(err){
    if (err) {
      res.render('error', {status: 500});
    } else {
      res.jsonp(1);
    }
  })
}
