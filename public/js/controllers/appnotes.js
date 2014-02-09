window.angular.module('App.controllers').controller("AppNotesCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "$window", "AppNoteService", "orderByFilter", function(s, $rootScope, $filter, $timeout, $window, AppNoteService, orderByFilter) {

    s.showAppNoteForm = false;
    s.oneAtATime = true;
    s.editing = false;

    s.openNewAppNoteForm = function(force, item) {
      if (_.isUndefined(force)){
        s.showAppNoteForm = !s.showAppNoteForm;
      } else {
        s.showAppNoteForm = force;
      }

      if (item) {
        s.editing = true;
        s.activeItem = item;
      } else {
        s.editing = false;
        s.activeItem = {
          name:'',
          description:''
        };
      }
    };

    s.update = function (activeItem, params) {
        params = params || {};
        activeItem.$update(params, function () {
          s.openNewAppNoteForm(false);
          orderAppNotes(s.appnotes);
        });
      };

    s.remove = function (item) {
        if($window.confirm('Are you sure you want to delete?')){
          item.$remove();
          for (var i in s.appnotes) {
            var appnote = s.appnotes[i];
            if (appnote._id == item._id) {
              s.appnotes.splice(i, 1);

              s.openNewAppNoteForm(false);
              break;
            }
          }
        }
      };


    s.create = function (activeItem) {
        if(s.editing){
          s.update(activeItem);
        } else {


          var item = new AppNoteService({
            name: activeItem.name,
            description: activeItem.description,
            order: activeItem.order || s.appnotes.length+1
          });

          item.$save(function (response) {
            if(response && response._id){
              s.appnotes.push(response);
              orderAppNotes(s.appnotes);
            }

            s.openNewAppNoteForm(false);
          });
        }

      };


    var orderAppNotes = function(appnotes) {
        s.appnotes = orderByFilter(appnotes, '+order');
      };

    var populateAppNotes = function(query) {
        query = query || {};
        AppNoteService.query(query, function (appnotes) {
          orderAppNotes(appnotes);
        });
      };

    populateAppNotes();

}]);
