window.angular.module('App.controllers').controller("TagsCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "$location", "$window", "$routeParams", "Global", "TagsService", function(s, $rootScope, $filter, $timeout, $location, $window, $routeParams, Global, TagsService) {

      s.showNewForm = false;
      s.editing = false;

      var resetActiveTag = function() {
        s.activeTag = {
          name: '',
          type: ''
        };
      };

      s.openNewForm = function() {
        s.editing = false;
        resetActiveTag();
        s.toggleNew(true);
      };

      s.toggleNew = function(force) {
        s.showNewForm = _.isUndefined(force) ? !s.showNewForm : force;
      };


      s.tags = [];

      var populateTags = function(query) {
        TagsService.query(query, function (tags) {
          s.tags = tags;
        });
      };

      s.create = function (activeTag) {
        if(s.editing){
          s.update(activeTag);
        } else {

          var tag = new TagsService({
            name: activeTag.name,
            type: activeTag.type
          });

          tag.$save(function (response) {
            if(response && response._id){
              s.tags.push(response);
            }

            s.toggleNew(false);
            resetActiveTag();
          });
        }

      };

      s.editTag = function(tag) {
        s.editing = true;
        s.activeTag = tag;
        s.toggleNew(true);
      };

      s.update = function (activeTag) {
        activeTag.$update(function () {
          // $location.path('fantasyteams/' + fantasyteam._id);
          s.toggleNew(false);
          resetActiveTag();
        });
      };

      s.find = function (query) {
        TagsService.query(query, function (tags) {
          s.tags = tags;
        });
      };

      s.findOne = function () {
        TagsService.get({ tagId: $routeParams.tag }, function (tag) {
          s.tag = tag;
        });
      };

      s.remove = function (tag) {
        if($window.confirm('Are you sure you want to delete?')){
          tag.$remove();
          for (var i in s.tags) {
            var listedProduct = s.tags[i];
            if (listedProduct._id == tag._id) {
              s.tags.splice(i, 1);

              s.toggleNew(false);
              resetActiveTag();
              break;
            }
          }
        }
      };

      s.$on('tag:remove', function(e, tagId) {
        var tag = _.find(s.tags, function(t) {
          return t._id == tagId;
        });
        if(tag){
          s.remove(tag);
        }
      });

      if ($routeParams.tag) {
        s.findOne();
      } else {
        populateTags();
        resetActiveTag();
      }

  }
]);
