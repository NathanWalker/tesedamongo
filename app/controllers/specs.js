var mongoose = require('mongoose')
  , async = require('async')
  , Spec = mongoose.model('Spec')
  , _ = require('underscore')

exports.create = function (req, res) {
  var spec = new Spec(req.body)
    spec.save()
    res.jsonp(spec)
}

exports.show = function(req, res){
  res.jsonp(req.spec);
}

exports.spec = function(req, res, next, id){
  Spec.load(id, function (err, spec) {
    if (err) return next(err)
    if (!spec) return next(new Error('Failed to load spec ' + id))
    req.spec = spec
    next()
  })
}

exports.all = function(req, res){
  var query = req.query ? req.query : {};
  var resultHandler = function(err, specs) {
   if (err) {
      res.jsonp(0);
   } else {
      res.jsonp(specs);
   }
 };

if (query.search){
  var re = new RegExp(query.search, "i");
  Spec.find().or([{name: re}, {description: re}]).exec(resultHandler);
} else {
  Spec.find(query).exec(resultHandler);
}

}

exports.update = function(req, res){
  var spec = req.spec
  spec = _.extend(spec, req.body)
  spec.save(function(err) {
    res.jsonp(spec)
  })

}

exports.destroy = function(req, res){
  var spec = req.spec
  spec.remove(function(err){
    if (err) {
      res.render('error', {status: 500});
    } else {
      res.jsonp(1);
    }
  })
}
