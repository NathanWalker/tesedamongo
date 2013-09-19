window.angular.module('App.controllers').controller("ContactCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "PagesService", function(s, $rootScope, $filter, $timeout, PagesService) {

    PagesService.query({route:'contact'}, function (pages) {
      s.page = _.first(pages);
    });
  }
]);
