var mongoose = require('mongoose')
  , async = require('async')
  , Software = mongoose.model('Software')
  , _ = require('underscore')

exports.create = function (req, res) {
  var software = new Software(req.body)
    software.save()
    res.jsonp(software)
}

exports.show = function(req, res){
  res.jsonp(req.software);
}

exports.software = function(req, res, next, id){
  Software.load(id, function (err, software) {
    if (err) return next(err)
    if (!software) return next(new Error('Failed to load software ' + id))
    req.software = software
    next()
  })
}

exports.all = function(req, res){
  var query = req.query ? req.query : {};
  var resultHandler = function(err, softwares) {
   if (err) {
      res.jsonp(0);
   } else {
      res.jsonp(softwares);
   }
 };

if (query.search){
  var re = new RegExp(query.search, "i");
  Software.find().or([{name: re}, {description: re}]).exec(resultHandler);
} else {
  Software.find(query).exec(resultHandler);
}

}

exports.update = function(req, res){
  var software = req.software
  software = _.extend(software, req.body)
  software.save(function(err) {
    res.jsonp(software)
  })

}

exports.destroy = function(req, res){
  var software = req.software
  software.remove(function(err){
    if (err) {
      res.render('error', {status: 500});
    } else {
      res.jsonp(1);
    }
  })
}
