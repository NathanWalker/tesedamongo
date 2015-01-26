window.angular.module('App.controllers').controller("BannerEditCtrl", ["$scope", "$rootScope", "$q", "$filter", "$timeout", "$location", "$window", "$routeParams", "Global", "BannerService", "SlideService", "PagesCache", "orderByFilter", function(s, $rootScope, $q, $filter, $timeout, $location, $window, $routeParams, Global, BannerService, SlideService, PagesCache, orderByFilter) {

      s.showNewForm = false;
      s.editing = false;

      var resetActiveBanner = function() {
        s.activeBanner = {
          title:'',
          route:'',
          slides:[]
        };
      };

      s.openNewForm = function() {
        s.editing = false;
        resetActiveBanner();
        s.toggleNew(true);
      };

      s.toggleNew = function(force) {
        s.showNewForm = _.isUndefined(force) ? !s.showNewForm : force;
        PagesCache.resetScroll();
      };

      s.addSlide = function(){

        var slide = new SlideService({
            markup: '',
            order:s.activeBanner.slides.length+1
          });

        s.activeBanner.slides.push(slide);
      };


      s.banners = [];

      var populateBanners = function(query) {
        BannerService.query(query, function (banners) {
          s.banners = banners;
        });
      };

      s.create = function (activeBanner) {
        if(s.editing){
          s.update(activeBanner);
        } else {


          var banner = new BannerService({
            title: activeBanner.title,
            route: activeBanner.route
          });

          handleSlides(activeBanner).then(function(){
            banner.$save(function (response) {
            if(response && response._id){
              s.banners.push(response);
            }

            s.toggleNew(false);
            resetActiveBanner();
          });
          });
        }

      };

      var handleSlides = function(activeBanner) {
        var defer = $q.defer();

        if(activeBanner.slides.length > 0) {
          var cnt = 0;
          var currentSlide;

          var updateSlide = function() {
            var updatableSlide = new SlideService(currentSlide);
            updatableSlide.$update(function () {
              processSlides(true);
            });
          };

          var createSlide = function(){
            currentSlide.$save(function (response) {
              processSlides(true);
            });
          };

          var processSlides = function(advance){
            if (advance) {
              cnt++;
            }
            if (activeBanner.slides.length == cnt) {
              defer.resolve();
            } else {
              currentSlide = activeBanner.slides[cnt];
              if (currentSlide._id) {
                updateSlide();
              } else {
                createSlide();
              }
            }
          };

          processSlides();
        } else {
          defer.resolve();
        }
        return defer.promise;
      };

      s.editBanner = function(banner) {
        s.editing = true;
        s.activeBanner = banner;
        s.toggleNew(true);
      };

      s.update = function (activeBanner) {
        handleSlides(activeBanner).then(function(){
          activeBanner.$update(function () {
            s.toggleNew(false);
            resetActiveBanner();
          });
        });
      };

      s.deleteSlide = function (slide) {
        if($window.confirm('Are you sure you want to delete?')){
          if (slide._id){
            var slideId = slide._id;
            var deletableSlide = new SlideService(slide);
            deletableSlide.$remove();
          }

          for (var i =0; i < s.activeBanner.slides.length; i++) {
            if (s.activeBanner.slides[i]._id == slideId) {
              s.activeBanner.slides.splice(i, 1);
              break;
            }
          }
        }
      };

      /** Sorting */
      var resortSlides = function(){
        var cnt = 0;

        var updateSlideOrder = function(){
          var slideToUpdate = s.activeBanner.slides[cnt];
          slideToUpdate.order = cnt+1;
          cnt++;
          if(cnt == s.activeBanner.slides.length){
            s.updatingSort = false;
          } else {
            updateSlideOrder();
          }

        };

        // kick it off
        updateSlideOrder();
      };

      s.updatingSort = false;
      s.sortableOptions = {
        update: function(e, ui) {
          s.updatingSort = true;
          $timeout(function(){
            // get new index of the slide after dom and scope has updated
            resortSlides();
          }, 100);
        },
        axis: 'y',
        cursor:'move',
        delay:150,
        items:'> li.sortable-item'
      };

      s.find = function (query) {
        BannerService.query(query, function (products) {
          s.products = products;
        });
      };

      s.findOne = function () {
        BannerService.get({ bannerId: $routeParams.bannerId }, function (banner) {
          s.banner = banner;
        });
      };

      s.remove = function (banner) {
        if($window.confirm('Are you sure you want to delete?')){
          banner.$remove();
          for (var i in s.banners) {
            var listedBanner = s.banners[i];
            if (listedBanner._id == banner._id) {
              s.banners.splice(i, 1);

              s.toggleNew(false);
              resetActiveBanner();
              break;
            }
          }
        }
      };

      if ($routeParams.bannerId) {
        s.findOne();
      } else {
        populateBanners();
        resetActiveBanner();
      }

  }
]);
