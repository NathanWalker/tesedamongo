window.angular.module('App.controllers').controller("VideosCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "$location", "$window", "$routeParams", "Global", "VideosService", "PagesService", function(s, $rootScope, $filter, $timeout, $location, $window, $routeParams, Global, VideosService, PagesService) {

      s.showNewForm = false;
      s.editing = false;

      var resetActiveVideo = function() {
        s.activeVideo = {
          title: '',
          url: '',
          type: '',
          poster: '',
          exclusive: false
        };
      };

      s.openNewForm = function() {
        s.editing = false;
        resetActiveVideo();
        s.toggleNew(true);
      };

      s.toggleNew = function(force) {
        s.showNewForm = _.isUndefined(force) ? !s.showNewForm : force;
      };


      s.videos = [];

      var populateVideos = function(query) {
        VideosService.query(query, function (videos) {
          s.videos = videos;
        });
      };

      s.create = function (activeVideo) {
        if(s.editing){
          s.update(activeVideo);
        } else {

          var video = new VideosService({
            title: activeVideo.title,
            url: activeVideo.url,
            type: activeVideo.type,
            poster: activeVideo.poster,
            exclusive: activeVideo.exclusive
          });

          video.$save(function (response) {
            if(response && response._id){
              s.videos.push(response);
            }

            s.toggleNew(false);
            resetActiveVideo();
          });
        }

      };

      s.editProduct = function(video) {
        s.editing = true;
        s.activeVideo = video;
        s.toggleNew(true);
      };

      s.update = function (activeVideo) {
        activeVideo.$update(function () {
          // $location.path('fantasyteams/' + fantasyteam._id);
          s.toggleNew(false);
          resetActiveVideo();
        });
      };

      s.find = function (query) {
        VideosService.query(query, function (videos) {
          s.videos = videos;
        });
      };

      s.findOne = function () {
        VideosService.get({ videoId: $routeParams.video }, function (video) {
          s.video = video;
        });
      };

      s.remove = function (video) {
        if($window.confirm('Are you sure you want to delete?')){
          video.$remove();
          for (var i in s.videos) {
            var listedProduct = s.videos[i];
            if (listedProduct._id == video._id) {
              s.videos.splice(i, 1);

              s.toggleNew(false);
              resetActiveVideo();
              break;
            }
          }
        }
      };

      if ($routeParams.video) {
        s.findOne();
      } else {
        PagesService.query({route:'tutorials'}, function (pages) {
          s.page = _.first(pages);
        });
        populateVideos();
        resetActiveVideo();
      }

  }
]);
