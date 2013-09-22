window.angular.module('App.controllers').controller("ImagesCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "$location", "$window", "$routeParams", "Global", "ImagesService", "PagesCache", function(s, $rootScope, $filter, $timeout, $location, $window, $routeParams, Global, ImagesService, PagesCache) {

      s.showNewForm = false;
      s.editing = false;
      s.fileUploading = false;

      var resetActiveImage = function() {
        s.activeImage = {
          url: ''
        };
        s.fileUploading = false;
      };

      s.openNewForm = function() {
        s.editing = false;
        resetActiveImage();
        s.toggleNew(true);
      };

      s.toggleNew = function(force) {
        s.showNewForm = _.isUndefined(force) ? !s.showNewForm : force;
        PagesCache.resetScroll();
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
            url: activeImage.url
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

      s.editImage = function(image) {
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


      s.progress = function(percentDone) {
        s.fileUploading = true;
            console.log("progress: " + percentDone + "%");
      };

      s.done = function(files, data) {
            console.log("upload complete");
            console.log("data: " + JSON.stringify(data));
            writeFiles(files, data);
      };

      s.getData = function(files) {
            //this data will be sent to the server with the files
            return {msg: "from the client", date: new Date()};
      };

      s.error = function(files, type, msg) {
            console.log("Upload error: " + msg);
            console.log("Error type:" + type);
            writeFiles(files);
      }

      function writeFiles(files, data)
      {

            console.log('Files')
            for (var i = 0; i < files.length; i++) {
                  console.log('\t' + files[i].name);
            }
            if(data) {
              var imageName = data.filenames[0];
              s.create({
                url: imageName
              });
            }

      }

      if ($routeParams.image) {
        s.findOne();
      } else {
        populateImages();
        resetActiveImage();
      }

  }
]);
