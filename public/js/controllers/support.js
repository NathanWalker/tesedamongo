window.angular.module('App.controllers').controller("SupportCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "PagesService", function(s, $rootScope, $filter, $timeout, PagesService) {

    PagesService.query({route:'support'}, function (pages) {
      s.page = _.first(pages);
    });
  }
]);
