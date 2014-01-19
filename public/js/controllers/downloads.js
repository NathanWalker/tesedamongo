window.angular.module('App.controllers').controller("DownloadsCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "$window", "SoftwareService", "orderByFilter", function(s, $rootScope, $filter, $timeout, $window, SoftwareService, orderByFilter) {

    s.showDownloadForm = false;
    s.oneAtATime = true;
    s.editing = false;

    s.openNewDownloadForm = function(force, item) {
      if (_.isUndefined(force)){
        s.showDownloadForm = !s.showDownloadForm;
      } else {
        s.showDownloadForm = force;
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
          s.openNewDownloadForm(false);
          orderSoftwares(s.downloads);
        });
      };

    s.remove = function (item) {
        if($window.confirm('Are you sure you want to delete?')){
          item.$remove();
          for (var i in s.downloads) {
            var software = s.downloads[i];
            if (software._id == item._id) {
              s.downloads.splice(i, 1);

              s.openNewDownloadForm(false);
              break;
            }
          }
        }
      };


    s.create = function (activeItem) {
        if(s.editing){
          s.update(activeItem);
        } else {


          var item = new SoftwareService({
            name: activeItem.name,
            description: activeItem.description,
            order: activeItem.order || s.downloads.length+1
          });

          item.$save(function (response) {
            if(response && response._id){
              s.downloads.push(response);
              orderSoftwares(s.downloads);
            }

            s.openNewDownloadForm(false);
          });
        }

      };


    var orderSoftwares = function(softwares) {
        s.downloads = orderByFilter(softwares, '+order');
      };

    var populateSoftwares = function(query) {
        query = query || {};
        SoftwareService.query(query, function (softwares) {
          orderSoftwares(softwares);
        });
      };

    populateSoftwares();

}]);
