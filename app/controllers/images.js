var mongoose = require('mongoose')
  , async = require('async')
  , Image = mongoose.model('Image')
  , _ = require('underscore')
  , rimraf = require('rimraf')
  , path = require('path')
  , AWS = require('aws-sdk');

var accessKeyId =  process.env.AWS_ACCESS_KEY_ID || "xxxxxx";
var secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "+xxxxxx+B+xxxxxxx";
AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region:'us-west-2'
});

var s3 = new AWS.S3();
var nodeEnv = process.env.NODE_ENV || 'development';

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
  var query = req.query ? req.query : {};
  var resultHandler = function(err, images) {
   if (err) {
      res.jsonp(0);
   } else {
      res.jsonp(images);
   }
 };

  Image.find(query).exec(resultHandler);
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
  // remove from filesystem first

  if(nodeEnv == 'development'){
    var basePath = path.join(__dirname, '../../public/uploads')
      var filePath = path.join(basePath, image.url);
      console.log('deleting file from: ' + filePath);
      rimraf(filePath, function(err) {
        if (err) { throw err; }
        // done
        image.remove(function(err){
          if (err) {
            res.render('error', {status: 500});
          } else {
            res.jsonp(1);
          }
        })
      })
    } else {

      // amazon s3
      var params = {
          Bucket: 'tesedamongo',
          Key: image.url
      };

      s3.deleteObject(params, function (perr, pres) {
          if (perr) {
              console.log("Error deleting: ", perr);
          } else {
              console.log("Successfully deleted: tesedamongo/" + image.url);
              image.remove(function(err){
                if (err) {
                  res.render('error', {status: 500});
                } else {
                  res.jsonp(1);
                }
              })
          }
      });
    }
}
