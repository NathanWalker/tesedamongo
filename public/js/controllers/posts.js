window.angular.module('App.controllers').controller("PostsCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "$location", "$window", "$routeParams", "Global", "PostsService", function(s, $rootScope, $filter, $timeout, $location, $window, $routeParams, Global, PostsService) {

      s.showNewForm = false;
      s.editing = false;

      var resetActivePost = function() {
        s.activePost = {
          title: '',
          content: '',
          image:''
        };
      };

      s.openNewForm = function() {
        s.editing = false;
        resetActivePost();
        s.toggleNew(true);
      };

      s.toggleNew = function(force) {
        s.showNewForm = _.isUndefined(force) ? !s.showNewForm : force;
      };


      s.posts = [];

      var populatePosts = function(query) {
        PostsService.query(query, function (posts) {
          s.posts = posts;
        });
      };

      s.create = function (activePost) {
        if(s.editing){
          s.update(activePost);
        } else {

          var post = new PostsService({
            title: activePost.title,
            content: activePost.content,
            date: activePost.date,
            image: activePost.image
          });

          post.$save(function (response) {
            if(response && response._id){
              s.posts.push(response);
            }

            s.toggleNew(false);
            resetActivePost();
          });
        }

      };

      s.editPost = function(post) {
        s.editing = true;
        s.activePost = post;
        s.toggleNew(true);
      };

      s.update = function (activePost) {
        activePost.$update(function () {
          s.toggleNew(false);
          resetActivePost();
        });
      };

      s.find = function (query) {
        PostsService.query(query, function (posts) {
          s.posts = posts;
        });
      };

      s.findOne = function () {
        PostsService.get({ postId: $routeParams.post }, function (post) {
          s.post = post;
        });
      };

      s.remove = function (post) {
        if($window.confirm('Are you sure you want to delete?')){
          post.$remove();
          for (var i in s.posts) {
            var listedProduct = s.posts[i];
            if (listedProduct._id == post._id) {
              s.posts.splice(i, 1);

              s.toggleNew(false);
              resetActivePost();
              break;
            }
          }
        }
      };

      s.$on('tag:selected', function(e, tag){
        // to do, handle tag selection

      });

      if ($routeParams.post) {
        s.findOne();
      } else {
        populatePosts();
        resetActivePost();
      }

  }
]);
