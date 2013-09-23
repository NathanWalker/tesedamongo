window.angular.module('App.controllers').controller("PostsCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "$location", "$window", "$routeParams", "Global", "PostsService", "ImagesService", "PagesCache", "orderByFilter", function(s, $rootScope, $filter, $timeout, $location, $window, $routeParams, Global, PostsService, ImagesService, PagesCache, orderByFilter) {

      var allPosts = [];
      s.showNewForm = false;
      s.editing = false;
      s.fileUploading = false;
      s.uploadedImage = undefined;
      s.tagSelectionOn = false;

      var resetActivePost = function() {
        s.activePost = {
          title: '',
          content: ''
        };
        s.fileUploading = false;
        s.uploadedImage = undefined;
        s.tagSelectionOn = false;
      };

      s.openNewForm = function() {
        s.editing = false;
        resetActivePost();
        s.toggleNew(true);
      };

      s.toggleNew = function(force) {
        s.showNewForm = _.isUndefined(force) ? !s.showNewForm : force;
        PagesCache.resetScroll();
      };

      s.limitedContent = function(post){
        if(post.content.length > 500){
          return post.content.substring(0, 500) + "&nbsp;<a href='/#!/news/" + post._id + "'>Read more ...</a>";
        } else {
          return post.content;
        }
      };


      s.posts = [];

      var orderPosts = function(posts) {
        s.posts = orderByFilter(posts, '-created');
        allPosts = s.posts;
      };

      var populatePosts = function(query) {
        query = query || {};
        PostsService.query(query, function (posts) {
          orderPosts(posts);

          // user may edit from post detail view (show.html) which redirects here and sets activePost
          if ($routeParams.edit) {
            var editId = $routeParams.edit;
            editPostFound = _.find(s.posts, function(p) {
              return p._id == editId;
            });
            if(editPostFound) {
              s.editPost(editPostFound);
            }
          }
        });
      };

      s.create = function (activePost) {
        if(s.editing){
          s.update(activePost);
        } else {

          var post = new PostsService({
            title: activePost.title,
            content: activePost.content
          });

          if(s.uploadedImage) {
            post.image = s.uploadedImage.url;
          }

          post.$save(function (response) {
            if(response && response._id){
              s.posts.push(response);
              orderPosts(s.posts);
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
        s.fileUploading = false;
        s.uploadedImage = undefined;
      };

      s.tagFilterName = function(tag) {
        return '.' + tag.name.replace(/[ ]/ig, '-').replace(/[.]/ig, '-');
      };

      s.tagConnect = function(dragEl, dropEl) { // function referenced by the drop target
        var drop = angular.element(dropEl);
        var drag = angular.element(dragEl);

        var postId = drop.attr('data-post-id');
        var tagId = drag.attr('data-tag-id');

        var foundPost = _.find(s.posts, function(p){
          return p._id == postId;
        });
        if(foundPost){
          s.update(foundPost, {tagId:tagId});
        }
      };

      s.removeTagFromPost = function(tag, post){
        if(Global.isAdmin()){
          if($window.confirm("Are you sure you want to remove this category from this article?")){
            s.update(post, {removeTagId:tag._id});
          }
        }

      };

      s.changeRouteToEdit = function(){
        if(s.post) {
          $location.url('news?edit=' + s.post._id);
        }
      };

      s.update = function (activePost, params) {
        if(s.uploadedImage) {
          activePost.image = s.uploadedImage.url;
        }
        params = params || {};
        activePost.$update(params, function () {
          s.toggleNew(false);
          resetActivePost();
        });
      };

      s.find = function (query) {
        query = query || {};
        PostsService.query(query, function (posts) {
          orderPosts(posts);
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

      s.$on('tag:selected', function(e, tag, allActiveTags){
        // filter posts to just the tag thats selected
        if(allActiveTags.length==0){
          s.tagSelectionOn = false;
          //reset to original
          orderPosts(allPosts);
        } else {
          s.tagSelectionOn = true;
          var activeTagIds = _.pluck(allActiveTags, '_id');
          var taggedPosts = _.filter(allPosts, function(p){
            return _.filter(p.tags, function(t) { return _.contains(activeTagIds, t._id);}).length > 0;
          });
          s.posts = orderByFilter(taggedPosts, '-created');
        }
      });

      s.$on('image:removed', function(e) {
        s.uploadedImage = undefined;
      });

      s.progress = function(percentDone) {
        s.fileUploading = true;
            // console.log("progress: " + percentDone + "%");
      };

      s.done = function(files, data) {
            // console.log("upload complete");
            // console.log("data: " + JSON.stringify(data));
            writeFiles(files, data);
      };

      s.getData = function(files) {
            //this data will be sent to the server with the files
            return {msg: "from the client", date: new Date()};
      };

      s.error = function(files, type, msg) {
            // console.log("Upload error: " + msg);
            // console.log("Error type:" + type);
            writeFiles(files);
      }

      function writeFiles(files, data)
      {

            // console.log('Files')
            // for (var i = 0; i < files.length; i++) {
            //       console.log('\t' + files[i].name);
            // }
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

      if ($routeParams.post) {
        s.findOne();
      } else {
        populatePosts();
        resetActivePost();

        PagesCache.getPage({route:'news'}).then(function (page) {
          s.page = page;
        });
      }

  }
]);
