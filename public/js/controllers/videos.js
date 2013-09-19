window.angular.module('App.controllers').controller("VideosCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "$location", "$window", "$routeParams", "Global", "VideosService", "PagesService", "ImagesService", "TagsService", "orderByFilter", function(s, $rootScope, $filter, $timeout, $location, $window, $routeParams, Global, VideosService, PagesService, ImagesService, TagsService, orderByFilter) {

      s.showNewForm = false;
      s.editing = false;
      s.fileUploading = false;
      s.uploadedImage = undefined;
      s.videoTags = [];

      var resetActiveVideo = function() {
        s.activeVideo = {
          title: '',
          url: '',
          type: 'YouTube',
          order:1,
          poster: '',
          exclusive: false
        };
        s.fileUploading = false;
        s.uploadedImage = undefined;
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

      var orderVideos = function(videos){
        if(!$rootScope.global.isSignedIn()){
          // weed out exclusives
          videos = _.reject(videos, function(v){
            return v.exclusive;
          });
        }
        s.videos = orderByFilter(videos, '+order');
      };

      var populateVideos = function(query) {
        VideosService.query(query, function (videos) {
          orderVideos(videos);
        });
      };

      s.create = function (activeVideo) {
        if(s.editing){
          s.update(activeVideo);
        } else {

          var video = new VideosService({
            title: activeVideo.title,
            type: activeVideo.type,
            url: activeVideo.url,
            order: Number(activeVideo.order),
            exclusive: activeVideo.exclusive || false
          });

          if(s.uploadedImage){
            video.poster = s.uploadedImage.url;
          }

          video.$save(function (response) {
            if(response && response._id){
              s.videos.push(response);
              orderVideos(s.videos);
            }

            s.toggleNew(false);
            resetActiveVideo();
          });
        }

      };

      s.editVideo = function(video) {
        s.editing = true;
        s.activeVideo = video;
        s.toggleNew(true);
        s.fileUploading = false;
        s.uploadedImage = undefined;
      };

      s.update = function (activeVideo, params) {
        if(s.uploadedImage) {
          activeVideo.poster = s.uploadedImage.url;
        }
        params = params || {};
        activeVideo.$update(params, function () {
          // $location.path('fantasyteams/' + fantasyteam._id);
          s.toggleNew(false);
          resetActiveVideo();
        });
      };

      s.find = function (query) {
        VideosService.query(query, function (videos) {
          orderVideos(videos);
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

      if($rootScope.global.isModerator()){
        s.$on('tag:loaded', function(e, tags) {
          s.videoTags = tags;
        });
      } else {
        TagsService.query({type:'tutorials'}, function (tags) {
          s.videoTags = tags;
        });
      }

      s.tagFilterName = function(tag) {
        return '.' + tag.name.replace(/[ ]/ig, '-').replace(/[.]/ig, '-');
      };

      s.tagConnect = function(dragEl, dropEl) { // function referenced by the drop target
        var drop = angular.element(dropEl);
        var drag = angular.element(dragEl);

        var videoId = drop.attr('data-video-id');
        var tagId = drag.attr('data-tag-id');

        var foundVideo = _.find(s.videos, function(v){
          return v._id == videoId;
        });
        if(foundVideo){
          s.update(foundVideo, {tagId:tagId});
        }
      };

      s.$on('tag:selected', function(e, tag){
        // to do, handle tag selection

      });

      s.$on('image:removed', function(e) {
        s.uploadedImage = undefined;
      });

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
              image = new ImagesService({
                url: imageName
              });
              image.$save(function (response) {
                if(response && response._id){
                   s.uploadedImage = response;
                   s.fileUploading = false;
                }
              });
            }

      }

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
