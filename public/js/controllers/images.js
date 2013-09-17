window.angular.module('App.controllers').controller("ImagesCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "$location", "$window", "$routeParams", "Global", "ImagesService", function(s, $rootScope, $filter, $timeout, $location, $window, $routeParams, Global, ImagesService) {

      s.showNewForm = false;
      s.editing = false;

      var resetActiveImage = function() {
        s.activeImage = {
          url: ''
        };
      };

      s.openNewForm = function() {
        s.editing = false;
        resetActiveImage();
        s.toggleNew(true);
      };

      s.toggleNew = function(force) {
        s.showNewForm = _.isUndefined(force) ? !s.showNewForm : force;
      };


      s.images = [];

      var populateImages = function(query) {
        ImagesService.query(query, function (images) {
          s.images = images;
        });
      };

      s.create = function (activeImage) {
        if(s.editing){
          s.update(activeImage);
        } else {

          var image = new ImagesService({
            name: activeImage.name,
            type: activeImage.type
          });

          image.$save(function (response) {
            if(response && response._id){
              s.images.push(response);
            }

            s.toggleNew(false);
            resetActiveImage();
          });
        }

      };

      s.editTag = function(image) {
        s.editing = true;
        s.activeImage = image;
        s.toggleNew(true);
      };

      s.update = function (activeImage) {
        activeImage.$update(function () {
          // $location.path('fantasyteams/' + fantasyteam._id);
          s.toggleNew(false);
          resetActiveImage();
        });
      };

      s.find = function (query) {
        ImagesService.query(query, function (images) {
          s.images = images;
        });
      };

      s.findOne = function () {
        ImagesService.get({ imageId: $routeParams.image }, function (image) {
          s.image = image;
        });
      };

      s.remove = function (image) {
        if($window.confirm('Are you sure you want to delete?')){
          image.$remove();
          for (var i in s.images) {
            var listedProduct = s.images[i];
            if (listedProduct._id == image._id) {
              s.images.splice(i, 1);

              s.toggleNew(false);
              resetActiveImage();
              break;
            }
          }
        }
      };

      if ($routeParams.image) {
        s.findOne();
      } else {
        populateImages();
        resetActiveImage();
      }

  }
]);
