var mongoose = require('mongoose')
  , async = require('async')
  , Banner = mongoose.model('Banner')
  , _ = require('underscore')

exports.create = function (req, res) {
  var banner = new Banner(req.body)
  var query = req.query ? req.query : {};

  var createBanner = function(){
    banner.save()
    res.jsonp(banner)
  };

  if(query.slideIds){
    banner.slides = [];
    var ids = query.slideIds.split(',')
    var cnt = 0;
    var currentSlideId = ids[cnt];
    var Slide = mongoose.model('Slide')

    var completeHandler = function(){
      cnt++;
      if (cnt == ids.length){
        createBanner()
      } else {
        currentSlideId = ids[cnt];
        addSlide()
      }
    }
    var addSlide = function(){
      Slide.load(currentSlideId, function (err, slide) {
        if (!err && slide) {
          banner.slides.push(slide);
          completeHandler();
        } else {
          completeHandler();
        }
      });
    }

    addSlide()

  } else {
     createBanner();
  }
}

exports.show = function(req, res){
  res.jsonp(req.banner);
}

exports.banner = function(req, res, next, id){
  Banner.load(id, function (err, banner) {
    if (err) return next(err)
    if (!banner) return next(new Error('Failed to load banner ' + id))
    req.banner = banner
    next()
  })
}

exports.all = function(req, res){
  var query = req.query ? req.query : {};
 Banner.find(query).populate('slides').exec(function(err, banners) {
   if (err) {
      res.jsonp(0);
   } else {
      res.jsonp(banners);
   }
 });
}

exports.update = function(req, res){
  var banner = req.banner
  banner = _.extend(banner, req.body)
  var query = req.query ? req.query : {};

  var updateBanner = function(){
    banner.save(function(err) {
      res.jsonp(banner)
    })
  };

  if(query.slideIds){
    banner.slides = [];
    var ids = query.slideIds.split(',')
    var cnt = 0;
    var currentSlideId = ids[cnt];
    var Slide = mongoose.model('Slide')

    var completeHandler = function(){
      cnt++;
      if (cnt == ids.length){
        updateBanner()
      } else {
        currentSlideId = ids[cnt];
        addSlide()
      }
    }
    var addSlide = function(){
      Slide.load(currentSlideId, function (err, slide) {
        if (!err && slide) {
          banner.slides.push(slide);
          completeHandler();
        } else {
          completeHandler();
        }
      });
    }

    addSlide()

  } else if(query.removeSlideId){
    var slideIndex = -1;
    for(var i = 0; i < banner.slides.length; i++){
      var bannerSlide = banner.slides[i];
      if(bannerSlide._id == query.removeSlideId){
        slideIndex = i;
        break;
      }
    }
    if(slideIndex > -1){
      banner.slides.splice(slideIndex, 1);
    }
    updateBanner()
  } else {
    updateBanner()
  }


}

exports.destroy = function(req, res){
  var banner = req.banner
  banner.remove(function(err){
    if (err) {
      res.render('error', {status: 500});
    } else {
      res.jsonp(1);
    }
  })
}
