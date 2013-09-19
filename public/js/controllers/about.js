window.angular.module('App.controllers').controller("AboutCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "PagesService", function(s, $rootScope, $filter, $timeout, PagesService) {

    PagesService.query({route:'about'}, function (pages) {
      s.page = _.first(pages);
    });
  }
]);
