var mongoose = require('mongoose')
  , async = require('async')
  , Product = mongoose.model('Product')
  , _ = require('underscore')

exports.create = function (req, res) {
  var product = new Product(req.body)
  product.save()
  res.jsonp(product)
}

exports.show = function(req, res){
  res.jsonp(req.product);
}

exports.product = function(req, res, next, id){
  var Product = mongoose.model('Product')
  Product.load(id, function (err, product) {
    if (err) return next(err)
    if (!product) return next(new Error('Failed to load product ' + id))
    req.product = product
    next()
  })
}

exports.all = function(req, res){
  var query = req.query ? req.query : {};
 Product.find(query).exec(function(err, products) {
   if (err) {
      res.render('error', {status: 500});
   } else {
      res.jsonp(products);
   }
 });
}

exports.update = function(req, res){
  var product = req.product
  product = _.extend(product, req.body)
  product.save(function(err) {
    res.jsonp(product)
  })
}

exports.destroy = function(req, res){
  var product = req.product
  product.remove(function(err){
    if (err) {
      res.render('error', {status: 500});
    } else {
      res.jsonp(1);
    }
  })
}
