window.angular.module('App.controllers').controller("SpecCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "PagesService", function(s, $rootScope, $filter, $timeout, PagesService) {

    PagesService.query({route:'specs'}, function (pages) {
      s.page = _.first(pages);
    });
  }
]);
